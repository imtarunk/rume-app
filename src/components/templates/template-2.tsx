
import { ResumeData } from '@/lib/gemini'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

export function Template2({ data, resumeId, fileName }: { data: ResumeData, resumeId?: string, fileName?: string }) {
    const { personalInfo = {}, workExperience = [], education = [], skills = [], projects = [] } = data || {}
    const { fullName = '', title = '', email = '', phone = '', location = '', linkedinUrl = '', portfolioUrl = '', summary = '' } = personalInfo as any

    return (
        <div className="bg-[#0a0a0a] min-h-screen font-sans text-gray-100 pb-20 selection:bg-purple-500/30">

            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 sm:opacity-100" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-56 sm:w-80 h-56 sm:h-80 bg-blue-600/20 rounded-full blur-3xl opacity-50 sm:opacity-100" />

                <Container className="py-20 sm:py-32 relative z-10">
                    <div className="max-w-4xl">
                        <p className="text-purple-400 font-mono mb-4 text-xs sm:text-sm tracking-widest uppercase">Hello, I'm</p>
                        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 leading-tight">
                            {fullName}.
                        </h1>
                        <h2 className="text-2xl sm:text-4xl font-bold text-gray-400 mb-8 leading-tight">
                            {title}
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
                            {summary}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">
                            {email && (
                                <Button className="bg-white text-black hover:bg-gray-200 rounded-xl px-6 h-12 font-bold">
                                    <Icons.google className="mr-2 w-4 h-4" />
                                    Email Me
                                </Button>
                            )}
                            {linkedinUrl && (
                                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 rounded-xl px-6 h-12 font-bold">
                                    <Icons.user className="mr-2 w-4 h-4" />
                                    LinkedIn
                                </Button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="pb-20 sm:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Left Column (Skills & Education) */}
                    <div className="space-y-12">
                        {/* Skills */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg sm:text-xl font-bold mb-8 flex items-center gap-2">
                                <Icons.settings className="w-5 h-5 text-purple-400" />
                                Expertise
                            </h3>
                            <div className="space-y-8">
                                {skills?.map((group, i) => (
                                    <div key={i}>
                                        <h4 className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">{group.category}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {group.items?.map?.((skill, j) => (
                                                <span key={j} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400 transition-all duration-300">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg sm:text-xl font-bold mb-8 flex items-center gap-2">
                                <Icons.page className="w-5 h-5 text-blue-400" />
                                Education
                            </h3>
                            <div className="space-y-8">
                                {education?.map((edu, i) => (
                                    <div key={i} className="group">
                                        <div className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{edu.school}</div>
                                        <div className="text-sm text-gray-400">{edu.degree}</div>
                                        <div className="text-[10px] font-bold text-gray-600 font-mono mt-2 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Experience & Projects) */}
                    <div className="lg:col-span-2 space-y-16 sm:space-y-24">
                        {/* Experience */}
                        <section>
                            <h3 className="text-xl sm:text-2xl font-bold mb-10 flex items-center gap-4">
                                <span className="text-purple-500 font-mono text-sm">01.</span>
                                <span>Experience</span>
                                <div className="h-[1px] bg-white/10 flex-1 hidden sm:block" />
                            </h3>
                            <div className="space-y-12 sm:space-y-16">
                                {workExperience?.map((job, i) => (
                                    <div key={i} className="group relative">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">{job.position}</h4>
                                            <span className="font-mono text-xs text-gray-500 mt-1 sm:mt-0">{job.startDate} — {job.endDate}</span>
                                        </div>
                                        <div className="text-base sm:text-lg text-gray-400 mb-6 font-medium">{job.company}</div>
                                        <ul className="space-y-4 text-sm sm:text-base text-gray-500">
                                            {job.description?.map((desc, j) => (
                                                <li key={j} className="flex gap-3">
                                                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-purple-500/50 shrink-0" />
                                                    <span className="leading-relaxed">{desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h3 className="text-xl sm:text-2xl font-bold mb-10 flex items-center gap-4">
                                <span className="text-blue-500 font-mono text-sm">02.</span>
                                <span>Selected Projects</span>
                                <div className="h-[1px] bg-white/10 flex-1 hidden sm:block" />
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {projects?.map((project, i) => (
                                    <div key={i} className="group p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">{project.name}</h4>
                                            <Icons.arrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform shrink-0" />
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed line-clamp-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                            {project.technologies?.map((tech, j) => (
                                                <span key={j} className="text-[10px] font-black text-purple-500/70 font-mono uppercase tracking-widest">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </Container>

        </div>
    )
}
