import { jsPDF } from 'jspdf'
import { ResumeData } from './gemini'

export async function generateResumePDF(data: ResumeData, fileName?: string): Promise<void> {
    const { personalInfo, workExperience = [], education = [], skills = [], projects = [] } = data
    const { fullName = '', title = '', email = '', phone = '', location = '', linkedinUrl = '', portfolioUrl = '', summary = '' } = personalInfo as any

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Helper function to add text with wrapping
    const addText = (text: string, size: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(size)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.setTextColor(color[0], color[1], color[2])

        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
        lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
                doc.addPage()
                yPosition = margin
            }
            doc.text(line, margin, yPosition)
            yPosition += size * 0.5
        })
        yPosition += 2
    }

    // Header - Name and Title
    addText(fullName, 24, true, [45, 45, 45])
    addText(title, 14, false, [100, 100, 100])
    yPosition += 3

    // Contact Information
    addText(`${email} | ${phone} | ${location}`, 10, false, [80, 80, 80])
    if (linkedinUrl) addText(`LinkedIn: ${linkedinUrl}`, 9, false, [0, 102, 204])
    if (portfolioUrl) addText(`Portfolio: ${portfolioUrl}`, 9, false, [0, 102, 204])
    yPosition += 8

    // Professional Summary
    if (summary) {
        addText('PROFESSIONAL SUMMARY', 12, true, [216, 88, 40])
        yPosition += 2
        addText(summary, 10, false)
        yPosition += 6
    }

    // Work Experience
    if (workExperience.length > 0) {
        addText('WORK EXPERIENCE', 12, true, [216, 88, 40])
        yPosition += 2

        workExperience.forEach((job: any) => {
            addText(`${job.position} at ${job.company}`, 11, true)
            addText(`${job.startDate} - ${job.endDate || 'Present'}`, 9, false, [100, 100, 100])

            if (job.description && job.description.length > 0) {
                job.description.forEach((desc: string) => {
                    addText(`• ${desc}`, 9, false)
                })
            }

            if (job.skills && job.skills.length > 0) {
                addText(`Skills: ${job.skills.join(', ')}`, 9, false, [80, 80, 80])
            }
            yPosition += 4
        })
    }

    // Education
    if (education.length > 0) {
        addText('EDUCATION', 12, true, [216, 88, 40])
        yPosition += 2

        education.forEach((edu: any) => {
            addText(`${edu.degree} in ${edu.fieldOfStudy}`, 11, true)
            addText(edu.school, 10, false)
            addText(`${edu.startDate} - ${edu.endDate || 'Present'}`, 9, false, [100, 100, 100])
            yPosition += 4
        })
    }

    // Skills
    if (skills.length > 0) {
        addText('SKILLS', 12, true, [216, 88, 40])
        yPosition += 2

        skills.forEach((skillGroup: any) => {
            addText(`${skillGroup.category}: ${skillGroup.items.join(', ')}`, 10, false)
        })
        yPosition += 4
    }

    // Projects
    if (projects.length > 0) {
        addText('PROJECTS', 12, true, [216, 88, 40])
        yPosition += 2

        projects.forEach((project: any) => {
            addText(project.name, 11, true)
            addText(project.description, 9, false)
            addText(`Technologies: ${project.technologies.join(', ')}`, 9, false, [80, 80, 80])
            if (project.link) addText(`Link: ${project.link}`, 9, false, [0, 102, 204])
            yPosition += 4
        })
    }

    // Save the PDF
    const pdfFileName = fileName?.replace(/\.(pdf|docx|txt)$/i, '.pdf') || `${fullName.replace(/\s+/g, '_')}_Resume.pdf`
    doc.save(pdfFileName)
}
