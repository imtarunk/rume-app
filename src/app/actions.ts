
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

    // Strict Enforcement: Check if user is trying to select a paid template without purchase
    if (templateId !== 'template-1') {
        const { data: purchase } = await supabase
            .from('premium_access')
            .select('id')
            .eq('user_id', user.id)
            .single()

        if (!purchase) {
            return { error: 'Premium purchase required for this template' }
        }
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

import { razorpay } from '@/lib/razorpay'

export async function createRazorpayOrder(templateId: string, resumeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const amount = 99; // ₹99

    const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: `r_${resumeId}`,
        notes: {
            userId: user.id,
            resumeId: resumeId,
            templateId: templateId
        }
    };

    try {
        const order = await razorpay.orders.create(options);
        return {
            orderId: order.id,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID,
            user: {
                name: user.email?.split('@')[0] || 'User',
                email: user.email,
            }
        }
    } catch (error) {
        console.error('Razorpay order creation failed:', error);
        throw new Error('Failed to create payment order');
    }
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
            return { error: 'Premium purchase required to publish this template' }
        }
    }

    // Strict Enforcement: If is_published is true, ensure all other portfolios for this user are unpublished
    if (settings.is_published) {
        await supabase
            .from('resumes')
            .update({ is_published: false })
            .eq('user_id', user.id)
            .neq('id', resumeId)
    }

    const updatedContent = {
        ...resume.content,
        settings: {
            ...(resume.content as any).settings,
            ...settings
        }
    }

    // 3. Update current resume (Trigger will handle unpublishing others if is_published is true)
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

export async function uploadImage(formData: FormData, resumeId: string, imageType: 'profile' | 'project', projectIndex?: number) {
    const file = formData.get('image') as File

    if (!file) {
        return { error: 'No file uploaded' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${resumeId}/${imageType}-${imageType === 'project' ? projectIndex : 'main'}-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file, {
                upsert: true,
                contentType: file.type
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: 'Failed to upload image' }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(fileName)

        // Update resume data with image URL
        const { data: resume } = await supabase
            .from('resumes')
            .select('content')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single()

        if (!resume) {
            return { error: 'Resume not found' }
        }

        const updatedContent = { ...resume.content } as any

        if (imageType === 'profile') {
            updatedContent.personalInfo.profileImageUrl = publicUrl
        } else if (imageType === 'project' && projectIndex !== undefined) {
            if (updatedContent.projects[projectIndex]) {
                updatedContent.projects[projectIndex].imageUrl = publicUrl
            }
        }

        const { error: updateError } = await supabase
            .from('resumes')
            .update({ content: updatedContent })
            .eq('id', resumeId)
            .eq('user_id', user.id)

        if (updateError) {
            return { error: 'Failed to update resume with image URL' }
        }

        revalidatePath(`/preview/${resumeId}`)
        revalidatePath(`/portfolio/${resumeId}`)

        return { success: true, imageUrl: publicUrl }
    } catch (error) {
        console.error('Image upload error:', error)
        return { error: 'Failed to process image upload' }
    }
}

export async function getResumeFile(resumeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { data: resume } = await supabase
        .from('resumes')
        .select('file_name, content')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single()

    if (!resume) {
        return { error: 'Resume not found' }
    }

    return {
        success: true,
        fileName: resume.file_name,
        // Return the resume data so it can be converted back to a downloadable format
        data: resume.content
    }
}
