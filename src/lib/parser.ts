
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer)
        return data.text
    } catch (error) {
        console.error('Error parsing PDF:', error)
        throw new Error('Failed to parse PDF file.')
    }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer })
        return result.value
    } catch (error) {
        console.error('Error parsing DOCX:', error)
        throw new Error('Failed to parse DOCX file.')
    }
}

export async function parseResume(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer())

    if (file.type === 'application/pdf') {
        return parsePdf(buffer)
    } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
    ) {
        return parseDocx(buffer)
    }

    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
}
