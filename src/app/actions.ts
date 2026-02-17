
'use server'

import { createClient } from '@/lib/supabase/server'
import { parseResume } from '@/lib/parser'
import { parseResumeWithGemini } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function uploadResume(formData: FormData) {
    const file = formData.get('resume') as File

    if (!file) {
        throw new Error('No file uploaded')
    }

    // 1. Authenticate user
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized. Please log in.' }
    }

    try {
        // 2. Parse File to Text
        const text = await parseResume(file)

        // 3. Extract JSON with Gemini
        const resumeData = await parseResumeWithGemini(text)

        // 4. Save to Supabase (Upsert Logic)
        const { data: existingResume } = await supabase
            .from('resumes')
            .select('id')
            .eq('user_id', user.id)
            .single()

        let result;
        if (existingResume) {
            result = await supabase
                .from('resumes')
                .update({
                    content: resumeData,
                    file_name: file.name,
                    // Keep existing template_id
                })
                .eq('id', existingResume.id)
                .select()
                .single()
        } else {
            result = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    content: resumeData,
                    file_name: file.name,
                })
                .select()
                .single()
        }

        if (result.error) {
            console.error('Supabase error:', result.error)
            throw new Error('Failed to save resume.')
        }

        // 5. Revalidate and Redirect
        return { success: true, id: result.data.id }

    } catch (error) {
        console.error('Upload error:', error)
        return { error: error instanceof Error ? error.message : 'Failed to process resume' }
    }
}

export async function updateResumeTemplate(resumeId: string, templateId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('resumes')
        .update({ template_id: templateId })
        .eq('id', resumeId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating template:', error)
        return { error: 'Failed to update template' }
    }

    revalidatePath(`/preview/${resumeId}`)
    revalidatePath(`/portfolio/${resumeId}`)
    return { success: true }
}

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function createCheckoutSession(templateId: string, resumeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const price = 99; // ₹99

    const headersList = await headers()
    const origin = headersList.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: `Rume Premium Upgrade`,
                        description: 'Unlock all current and future premium templates forever.',
                    },
                    unit_amount: price * 100, // Amount in cents/paise
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/preview/${resumeId}?payment=success`,
        cancel_url: `${origin}/preview/${resumeId}?payment=cancel`,
        customer_email: user.email,
        metadata: {
            userId: user.id,
            resumeId: resumeId
        }
    })

    return { sessionId: session.id, url: session.url }
}

export async function updateResumeSettings(resumeId: string, settings: { is_published?: boolean, subdomain?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Fetch existing content to merge settings
    const { data: resume, error: fetchError } = await supabase
        .from('resumes')
        .select('content, template_id')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !resume) return { error: 'Resume not found' }

    // Check if user is trying to publish a paid template without purchase
    if (settings.is_published && resume.template_id !== 'template-1') {
        const { data: purchase } = await supabase
            .from('premium_access')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!purchase) {
            return { error: 'Premium subscription required' }
        }
    }

    const updatedContent = {
        ...resume.content,
        settings: {
            ...(resume.content as any).settings,
            ...settings
        }
    }

    // 2. Enforce one active portfolio rule
    if (settings.is_published === true) {
        // Unpublish all other resumes for this user
        const { data: otherResumes } = await supabase
            .from('resumes')
            .select('id, content')
            .eq('user_id', user.id)
            .neq('id', resumeId)

        if (otherResumes) {
            for (const other of otherResumes) {
                const otherContent = {
                    ...other.content as any,
                    settings: {
                        ...(other.content as any).settings,
                        is_published: false
                    }
                }
                await supabase
                    .from('resumes')
                    .update({
                        is_published: false,
                        content: otherContent
                    })
                    .eq('id', other.id)
            }
        }
    }

    // 3. Update current resume
    const { error } = await supabase
        .from('resumes')
        .update({
            content: updatedContent,
            is_published: settings.is_published ?? (resume as any).is_published
        })
        .eq('id', resumeId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath(`/preview/${resumeId}`)
    revalidatePath(`/portfolio/${resumeId}`)
    revalidatePath('/')
    return { success: true }
}

export async function updateResumeData(resumeId: string, content: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('resumes')
        .update({ content })
        .eq('id', resumeId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating content:', error)
        return { error: 'Failed to update content' }
    }

    revalidatePath(`/preview/${resumeId}`)
    revalidatePath(`/portfolio/${resumeId}`)
    return { success: true }
}
