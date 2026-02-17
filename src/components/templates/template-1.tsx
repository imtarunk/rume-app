
import { ResumeData } from '@/lib/gemini'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

export function Template1({ data }: { data: ResumeData }) {
    const { personalInfo = {}, workExperience = [], education = [], skills = [], projects = [] } = data || {}
    const { fullName = '', title = '', email = '', phone = '', location = '', linkedinUrl = '', portfolioUrl = '', summary = '' } = personalInfo as any

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 pb-20">
            {/* Header / Hero */}
            <header className="border-b border-gray-100 py-10 sm:py-20 bg-gray-50/30">
                <Container className="max-w-4xl">
                    <div className="space-y-4 sm:space-y-6">
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                            {fullName}
                        </h1>
                        <p className="text-lg sm:text-2xl text-gray-500 font-light">{title}</p>

                        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm text-gray-600">
                            {email && (
                                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors py-1">
                                    <Icons.google className="w-4 h-4 shrink-0" />
                                    <span className="truncate max-w-[200px] sm:max-w-none">{email}</span>
                                </a>
                            )}
                            {linkedinUrl && (
                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-900 transition-colors py-1">
                                    <Icons.user className="w-4 h-4 shrink-0" />
                                    LinkedIn
                                </a>
                            )}
                            {portfolioUrl && (
                                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gray-900 transition-colors py-1">
                                    <Icons.laptop className="w-4 h-4 shrink-0" />
                                    Portfolio
                                </a>
                            )}
                            {location && (
                                <span className="flex items-center gap-2 text-gray-500 py-1">
                                    <Icons.media className="w-4 h-4 shrink-0" />
                                    {location}
                                </span>
                            )}
                        </div>

                        <p className="pt-4 sm:pt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                            {summary}
                        </p>
                    </div>
                </Container>
            </header>

            <Container className="max-w-4xl py-12 sm:py-20 space-y-12 sm:space-y-20">
                {/* Experience */}
                {workExperience?.length > 0 && (
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <Icons.page className="w-4 h-4" />
                            </span>
                            Work Experience
                        </h2>
                        <div className="space-y-10 sm:space-y-14">
                            {workExperience.map((job, i) => (
                                <div key={i} className="relative pl-6 sm:pl-8 border-l-2 border-gray-100 last:border-0">
                                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-200" />
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">{job.position}</h3>
                                            <span className="text-xs sm:text-sm font-medium text-gray-400 font-mono">
                                                {job.startDate} — {job.endDate}
                                            </span>
                                        </div>
                                        <p className="text-base sm:text-lg text-gray-700 font-medium">{job.company}</p>
                                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm sm:text-base text-gray-600 mt-4 leading-relaxed marker:text-gray-300">
                                            {job.description?.map((desc, j) => (
                                                <li key={j}>{desc}</li>
                                            ))}
                                        </ul>
                                        {job.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4 pt-2">
                                                {job.skills.map((skill, k) => (
                                                    <span key={k} className="px-2 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                <Icons.laptop className="w-4 h-4" />
                            </span>
                            Projects
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {projects.map((project, i) => (
                                <div key={i} className="group p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all duration-500">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                                        {project.technologies?.map((tech, j) => (
                                            <span key={j} className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education & Skills Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12 sm:gap-16">
                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <Icons.page className="w-4 h-4" />
                                </span>
                                Education
                            </h2>
                            <div className="space-y-8">
                                {education.map((edu, i) => (
                                    <div key={i} className="space-y-1">
                                        <h3 className="font-semibold text-gray-900 leading-tight">{edu.school}</h3>
                                        <p className="text-gray-700 text-sm sm:text-base">{edu.degree}, {edu.fieldOfStudy}</p>
                                        <p className="text-[10px] sm:text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mt-1">{edu.startDate} — {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <Icons.settings className="w-4 h-4" />
                                </span>
                                Skills
                            </h2>
                            <div className="space-y-8">
                                {skills.map((skillGroup, i) => (
                                    <div key={i}>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                            {skillGroup.category}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skillGroup.items.map((item, j) => (
                                                <span key={j} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs sm:text-sm font-semibold text-gray-700">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </Container>
        </div>
    )
}
