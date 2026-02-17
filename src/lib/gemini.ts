
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: { responseMimeType: 'application/json' },
})

export interface ResumeData {
    personalInfo: {
        fullName: string
        title: string
        email: string
        phone: string
        location: string
        linkedinUrl: string
        portfolioUrl: string
        summary: string
        profileImageUrl?: string
    }
    workExperience: {
        company: string
        position: string
        startDate: string
        endDate: string
        description: string[]
        skills: string[]
    }[]
    education: {
        school: string
        degree: string
        fieldOfStudy: string
        startDate: string
        endDate: string
    }[]
    skills: {
        category: string
        items: string[]
    }[]
    projects: {
        name: string
        description: string
        technologies: string[]
        link: string
        imageUrl?: string
    }[]
    certifications: {
        name: string
        issuer: string
        date: string
    }[]
    settings?: {
        is_published?: boolean
        subdomain?: string
        custom_domain?: string
    }
}

const promptTemplate = `
You are a highly specialized AI resume parser. Your sole task is to extract data from a resume and format it into a STRICT JSON structure.

### RULES:
1. **NO EMPTY RESPONSES**: You must always return a valid JSON object matching the schema below.
2. **NO FAKE INFORMATION**: Do not invent jobs, schools, or certifications.
3. **COMMON DATA**: If a basic field like 'title' or 'summary' is missing, infer a professional common value based on the resume content (e.g., if they know React, title could be "Frontend Developer").
4. **DATE FORMAT**: Always use "YYYY-MM" or "Present".
5. **JSON ONLY**: Do not include any text, markdown blocks, or explanations. Just the raw JSON.

### SCHEMA:
{
  "personalInfo": {
    "fullName": "string",
    "title": "string (Common professional title if missing)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedinUrl": "string",
    "portfolioUrl": "string",
    "summary": "string (Short professional bio)"
  },
  "workExperience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": ["string array"],
      "skills": ["string array"]
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ],
  "skills": [
    {
      "category": "string (Common categories: Tech, Tools, Soft Skills)",
      "items": ["string array"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string array"],
      "link": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM"
    }
  ]
}

### RESUME TEXT TO PARSE:
`

export async function parseResumeWithGemini(text: string): Promise<ResumeData> {
    try {
        const fullPrompt = `${promptTemplate}\n${text}`
        const result = await model.generateContent(fullPrompt)
        const response = result.response
        const jsonString = response.text()

        if (!jsonString || jsonString.trim() === "{}") {
            throw new Error("Empty response from Gemini")
        }

        const data = JSON.parse(jsonString)
        return validateAndFillDefaults(data)
    } catch (error) {
        console.error('Error parsing resume with Gemini:', error)
        // Return a structural default instead of throwing to prevent app crash
        return validateAndFillDefaults({})
    }
}

export function validateAndFillDefaults(data: any): ResumeData {
    // 1. Handle "Legacy" / Alternative JSON Structure
    let personalInfo = data?.personalInfo || {}
    let workExperience = data?.workExperience || []
    let education = data?.education || []
    let skills = data?.skills || []
    let projects = data?.projects || []
    let certifications = data?.certifications || []

    // --- MAPPING LOGIC FOR DIFFERENT FORMATS ---

    // A) Personal Info Mapping
    if (!data?.personalInfo) {
        // Try to find a title from experience if top-level is missing
        let inferredTitle = data?.title || data?.label || "";
        if (!inferredTitle && Array.isArray(data?.experience) && data.experience.length > 0) {
            inferredTitle = data.experience[0].role || data.experience[0].position || "";
        }

        // Check for top-level fields (name, summary, contact object)
        personalInfo = {
            fullName: data?.name || data?.fullName || "Name Not Found",
            title: inferredTitle || "",
            email: data?.contact?.email || data?.email || "",
            phone: data?.contact?.phone || data?.phone || "",
            location: data?.contact?.location || data?.location || "",
            linkedinUrl: data?.contact?.linkedin || data?.linkedin || "",
            portfolioUrl: data?.contact?.github || data?.portfolio || "", // Mapping github to portfolio if no explicit portfolio
            summary: data?.summary || "",
        }
    }

    // B) Skills Mapping (Object or flat array to expected grouped format)
    if (data?.skills) {
        if (!Array.isArray(data.skills) && typeof data.skills === 'object') {
            // Convert object { tools: [], languages: [] } to [{ category: 'tools', items: [] }]
            skills = Object.entries(data.skills).map(([category, items]) => ({
                category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
                items: Array.isArray(items) ? items : [String(items)]
            }))
        } else if (Array.isArray(data.skills) && data.skills.length > 0 && typeof data.skills[0] === 'string') {
            // Convert flat string array ["React", "CSS"] to [{ category: 'Skills', items: ["React", "CSS"] }]
            skills = [{
                category: "Skills",
                items: data.skills
            }]
        }
    }

    // C) Work Experience Mapping (experience -> workExperience)
    if ((!workExperience || workExperience.length === 0) && Array.isArray(data?.experience)) {
        workExperience = data.experience.map((exp: any) => ({
            company: exp.company || "",
            position: exp.role || exp.position || "",
            startDate: exp.start_date || exp.startDate || "",
            endDate: exp.end_date || exp.endDate || "",
            description: Array.isArray(exp.description) ? exp.description : [exp.description || ""],
            skills: [] // Legacy format might not have per-job skills
        }))
    }

    // D) Projects Mapping (title -> name, etc)
    if (Array.isArray(projects)) {
        projects = projects.map((proj: any) => ({
            name: proj.name || proj.title || "",
            description: Array.isArray(proj.description) ? proj.description.join('. ') : (proj.description || ""),
            technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
            link: proj.link || "",
            imageUrl: proj.imageUrl || ""
        }))
    }

    // E) Education Mapping (institution -> school, etc)
    if (Array.isArray(education)) {
        education = education.map((edu: any) => ({
            school: edu.school || edu.institution || "",
            degree: edu.degree || "",
            fieldOfStudy: edu.fieldOfStudy || "",
            startDate: edu.startDate || edu.start_date || "",
            endDate: edu.endDate || edu.end_date || ""
        }))
    }

    // --- FINAL VALIDATION & DEFAULTS ---

    return {
        personalInfo: {
            fullName: personalInfo.fullName || "Name Not Found",
            title: personalInfo.title || "Title Not Found",
            email: personalInfo.email || "",
            phone: personalInfo.phone || "",
            location: personalInfo.location || "",
            linkedinUrl: personalInfo.linkedinUrl || "",
            portfolioUrl: personalInfo.portfolioUrl || "",
            summary: personalInfo.summary || "",
            profileImageUrl: personalInfo.profileImageUrl || "",
        },
        workExperience: Array.isArray(workExperience) ? workExperience : [],
        education: Array.isArray(education) ? education : [],
        skills: Array.isArray(skills) ? skills : [],
        projects: Array.isArray(projects) ? projects.map((p: any) => ({
            ...p,
            imageUrl: p.imageUrl || ""
        })) : [],
        certifications: Array.isArray(certifications) ? certifications : [],
        settings: data?.settings || {},
    }
}
