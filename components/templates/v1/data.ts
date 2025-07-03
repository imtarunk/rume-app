export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  type: string;
  location: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  about: string;
  contact: ContactInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  footer: string;
}

export const getPortfolioData = async ({ userId }: { userId: string }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/resume/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
  }
};
