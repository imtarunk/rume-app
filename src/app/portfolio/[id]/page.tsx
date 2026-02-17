
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Template1 } from '@/components/templates/template-1'
import { Template2 } from '@/components/templates/template-2'
import { ResumeData, validateAndFillDefaults } from '@/lib/gemini'

export default async function PortfolioPage({ params, searchParams }: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ template?: string }>
}) {
    const { id } = await params;
    const { template } = await searchParams;

    const supabase = await createClient()

    // Fetch resume
    // Note: RLS policies might prevent public access if we don't allow anon select.
    // We need to ensure RLS allows public read for portfolios, or use service role if we want to keep it private but shareable via token.
    // For this MVP, let's assume we update RLS or use the user's session if they are the owner, 
    // but for public sharing, we really need a "public" flag or policy.
    // Since I can't easily change RLS without SQL, I'll use a trick: 
    // I'll assume the user is logged in for now, OR I'll assume I can read it if I'm testing.
    // Actually, standard RLS "Users can view their own resumes" means public can't see it.
    // I should probably have added a "public" boolean to the table and a policy for it.
    // For the sake of the demo, I will use `supabase.auth.getUser()` to check if owner, 
    // but if I want it public, I'd need to bypass RLS or update it.
    // I'll try to fetch it. If it fails (due to RLS), I'll handle error.

    // To make it truly shareable without login, we need to bypass RLS or have a public policy.
    // Since I created the schema with "Users can view their own resumes", anonymous users can't see it.
    // I will update the schema or just explain this limitation.
    // BUT, I can use the `service_role` key to fetch it if I really wanted to, but that's risky in client components.
    // This is a Server Component, so I can validly use a Service Role client if I had the key.
    // But I don't have the service role key in env vars (only anon).
    // I will assume for the demo that the user is viewing their own portfolio or I'll just render it for the happy path.

    const { data: resume, error } = await supabase
        .from('resumes')
        .select('content, template_id')
        .eq('id', id)
        .eq('is_published', true)
        .single()

    if (error || !resume) {
        // If error is RLS related (PGRST301? no, usually returns empty), we might default to 404.
        // Ideally we'd enable public access in SQL: `create policy "Public resumes" on resumes for select using (true);`
        return notFound()
    }

    const resumeData = resume.content as unknown as ResumeData
    const templateId = template || resume.template_id || 'template-1'

    if (templateId === 'template-2') {
        return <Template2 data={resumeData} />
    }

    return <Template1 data={resumeData} />
}
