-- Migration: Razorpay Integration & Single Active Portfolio Rule
-- Created: 2024-02-17

-- 1. Ensure premium_access table exists for tracking payments
CREATE TABLE IF NOT EXISTS public.premium_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add template_id and is_published columns to resumes table if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resumes' AND column_name='template_id') THEN
        ALTER TABLE public.resumes ADD COLUMN template_id TEXT DEFAULT 'template-1';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resumes' AND column_name='is_published') THEN
        ALTER TABLE public.resumes ADD COLUMN is_published BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. Enable RLS and set policies for premium_access
ALTER TABLE public.premium_access ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'premium_access' AND policyname = 'Users can view their own premium status'
    ) THEN
        CREATE POLICY "Users can view their own premium status" 
        ON public.premium_access FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'resumes' AND policyname = 'Published portfolios are public'
    ) THEN
        CREATE POLICY "Published portfolios are public" 
        ON public.resumes FOR SELECT 
        USING (is_published = true);
    END IF;
END $$;

-- 4. Trigger to enforce "Only one active portfolio" rule
-- This automatically unpublishes other resumes when one is set to is_published = true
CREATE OR REPLACE FUNCTION public.handle_single_active_portfolio()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) THEN
        -- Unpublish others and sync their JSON content
        UPDATE public.resumes
        SET is_published = false,
            content = jsonb_set(
                COALESCE(content, '{}'::jsonb), 
                '{settings,is_published}', 
                'false'::jsonb
            )
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_active_portfolio ON public.resumes;
CREATE TRIGGER trigger_single_active_portfolio
    BEFORE UPDATE OF is_published ON public.resumes
    FOR EACH ROW
    WHEN (NEW.is_published = true)
    EXECUTE FUNCTION public.handle_single_active_portfolio();

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_published ON public.resumes(is_published);
CREATE INDEX IF NOT EXISTS idx_premium_access_user_id ON public.premium_access(user_id);
