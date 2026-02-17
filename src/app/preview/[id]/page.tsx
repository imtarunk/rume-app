
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortfolioPreview } from '@/components/features/portfolio-preview'
import { ResumeData, validateAndFillDefaults } from '@/lib/gemini'

export default async function PreviewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params

    if (!id) redirect('/')

    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/')
    }

    // Fetch resume
    const { data: resume, error } = await supabase
        .from('resumes')
        .select('content, template_id, file_name')
        .eq('id', id)
        .single()

    if (error || !resume) {
        console.error("Error fetching resume:", error)
        return notFound()
    }

    const rawData = resume.content
    const resumeData = validateAndFillDefaults(rawData)

    return <PortfolioPreview
        data={resumeData}
        resumeId={id}
        initialTemplate={resume.template_id}
        fileName={resume.file_name}
    />
}
