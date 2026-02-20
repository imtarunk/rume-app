
'use client'

import { ResumeData } from '@/lib/gemini'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { GitHubCalendar } from 'react-github-calendar'
import { useState, useEffect } from 'react'

const CalendlyIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
            d="M14.5 9.5C14.5 8.39543 13.6046 7.5 12.5 7.5H11.5C9.29086 7.5 7.5 9.29086 7.5 11.5V12.5C7.5 14.7091 9.29086 16.5 11.5 16.5H12.5C13.6046 16.5 14.5 15.6046 14.5 14.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M14.5 11.5V12.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
)

export function Template4({ data, resumeId, fileName }: { data: ResumeData, resumeId?: string, fileName?: string }) {
    const { personalInfo = {}, workExperience = [], education = [], skills = [], projects = [], settings = {} } = data || {}
    const {
        fullName = '',
        title = '',
        email = '',
        location = '',
        linkedinUrl = '',
        portfolioUrl = '',
        summary = '',
        profileImageUrl = '',
        githubUsername = '',
        calendlyUrl = ''
    } = personalInfo as any

    const { blogEnabled = false, blogUrl = '' } = settings as any

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const
            }
        }
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen font-sans text-gray-100 pb-20 selection:bg-emerald-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                <Container className="max-w-5xl">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-emerald-500/20 overflow-hidden bg-emerald-500/10">
                                {profileImageUrl ? (
                                    <img src={profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-emerald-500 font-bold">
                                        {fullName[0]}
                                    </div>
                                )}
                            </div>
                            <span className="font-bold tracking-tight text-sm sm:text-base hidden sm:block">{fullName}</span>
                        </div>

                        <nav className="flex items-center gap-4 sm:gap-8">
                            <div className="hidden md:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <a href="#experience" className="hover:text-emerald-400 transition-colors">Experience</a>
                                <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
                                {githubUsername && <a href="#activity" className="hover:text-emerald-400 transition-colors">Activity</a>}
                            </div>
                            {blogEnabled && (
                                <Button asChild variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 rounded-full h-8 sm:h-10 px-4 sm:px-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    <a href={blogUrl} target="_blank" rel="noopener noreferrer">Blog</a>
                                </Button>
                            )}
                            {calendlyUrl && (
                                <div className="relative">
                                    <Button asChild className="bg-white/[0.03] hover:bg-white/[0.06] text-white border border-white/10 rounded-full h-10 sm:h-12 px-5 sm:px-7 flex items-center gap-4 transition-all duration-300 group shadow-xl sm:text-sm font-bold tracking-tight">
                                        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 text-[#0069FF] flex items-center justify-center">
                                                <CalendlyIcon className="w-full h-full" />
                                            </div>
                                            Book a Meeting
                                        </a>
                                    </Button>
                                    <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full z-10 animate-pulse" />
                                </div>
                            )}
                        </nav>
                    </div>
                </Container>
            </header>

            <Container className="max-w-5xl">
                {/* Hero */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="py-16 sm:py-24 space-y-8 sm:space-y-12"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Available for Projects
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <h1 className="text-4xl sm:text-7xl font-bold tracking-tighter leading-[0.95] max-w-4xl italic-serif-fix">
                            {title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={cn(i % 3 === 2 ? "font-serif italic text-emerald-500 px-1" : "text-white")}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">
                            {summary}
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-emerald-900 flex items-center justify-center overflow-hidden">
                                    <Icons.user className="w-6 h-6 text-emerald-500/50" />
                                </div>
                            ))}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-500">
                            Trusted by <span className="text-white">Forward-thinking</span> founders and engineering teams.
                        </div>
                    </motion.div>
                </motion.div>

                {/* GitHub Calendar */}
                {githubUsername && (
                    <motion.div
                        id="activity"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={itemVariants}
                        className="py-12 sm:py-20 border-t border-white/5"
                    >
                        <div className="mb-10 space-y-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Code Activity</h2>
                            <p className="text-2xl font-bold tracking-tight">Consistency in Build.</p>
                        </div>
                        <div className="p-6 sm:p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-x-auto min-h-[150px] flex items-center justify-center">
                            {isMounted ? (
                                <GitHubCalendar
                                    username={githubUsername}
                                    theme={{
                                        light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                    }}
                                    fontSize={12}
                                    blockMargin={4}
                                    blockSize={14}
                                />
                            ) : (
                                <div className="animate-pulse flex space-x-4">
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-white/5 rounded"></div>
                                            <div className="h-4 bg-white/5 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Experience */}
                <motion.section
                    id="experience"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="py-12 sm:py-20 border-t border-white/5"
                >
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Experience</h2>
                            <p className="text-3xl sm:text-4xl font-bold tracking-tight">Professional Journey</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {workExperience.map((job, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="group p-6 sm:px-10 sm:py-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-emerald-500/[0.03] hover:border-emerald-500/20 transition-all duration-500"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl sm:text-2xl font-black text-white group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                                            {job.company[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{job.position}</h3>
                                            <p className="text-gray-400 font-medium">{job.company}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-start md:items-end gap-1">
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            {job.startDate} — {job.endDate}
                                        </span>
                                        {job.endDate === 'Present' && (
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Currently Active</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <ul className="grid sm:grid-cols-2 gap-4">
                                        {job.description.slice(0, 4).map((desc, j) => (
                                            <li key={j} className="flex gap-3 text-sm text-gray-500 leading-relaxed font-medium">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/30 shrink-0" />
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Projects */}
                <motion.section
                    id="projects"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="py-12 sm:py-20 border-t border-white/5"
                >
                    <div className="mb-12 space-y-2">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Selected Works</h2>
                        <p className="text-3xl sm:text-4xl font-bold tracking-tight">Building the Future.</p>
                    </div>

                    <div className="grid gap-24 sm:gap-32">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="group relative grid md:grid-cols-2 gap-10 lg:gap-20 items-center"
                            >
                                {/* Background glow effect */}
                                <div className="absolute -inset-10 bg-emerald-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                <div className={cn("aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 group-hover:border-emerald-500/20 transition-all duration-700 relative shadow-2xl", i % 2 === 1 ? "md:order-2" : "")}>
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-emerald-500/20 transition-colors bg-[#111]">
                                            <Icons.laptop className="w-24 h-24" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-6 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                                View Case Study <Icons.arrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 relative">
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-500/80 font-mono">
                                            Project {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div className="h-px w-8 bg-white/10" />
                                        <div className="flex flex-wrap gap-3">
                                            {project.technologies.slice(0, 3).map((tech, j) => (
                                                <span key={j} className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white group-hover:text-emerald-400 transition-colors leading-[1.1]">
                                            {project.name}
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        {project.link && (
                                            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-black rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest group/btn">
                                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                    Live Preview
                                                    <Icons.arrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </a>
                                            </Button>
                                        )}
                                        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 text-gray-400 hover:text-white rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-all">
                                            <a href="#">
                                                Repository <Icons.linkedin className="ml-2 w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Footer Section */}
                <motion.footer
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="mt-32 py-20 border-t border-white/5 text-center space-y-12"
                >
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter">
                            Let's build something <br />
                            <span className="font-serif italic text-emerald-500">extraordinary.</span>
                        </h2>
                        <p className="text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">
                            Interested in creating a world-class digital experience? <br />
                            Let's connect and make it happen.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {calendlyUrl && (
                            <div className="relative">
                                <Button asChild className="bg-white text-black hover:bg-gray-100 rounded-full px-12 h-20 font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-3">
                                    <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                                        <div className="w-8 h-8 text-[#0069FF] flex items-center justify-center">
                                            <CalendlyIcon className="w-full h-full" />
                                        </div>
                                        Schedule a Call
                                    </a>
                                </Button>
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full z-10 animate-pulse shadow-lg shadow-emerald-500/50" />
                            </div>
                        )}
                        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5 rounded-full px-12 h-20 font-black uppercase text-xs tracking-[0.2em] transition-all duration-500">
                            <a href={`mailto:${email}`}>Get in Touch</a>
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-20 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-8 text-gray-600">
                            <a href="#" className="hover:text-emerald-500 transition-colors"><Icons.linkedin className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-emerald-500 transition-colors"><Icons.user className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-emerald-500 transition-colors"><Icons.mail className="w-5 h-5" /></a>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-800">
                            © {new Date().getFullYear()} {fullName}. All Rights Reserved.
                        </p>
                    </motion.div>
                </motion.footer>
            </Container>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                
                .italic-serif-fix {
                   /* Fix for some browsers clipping italic serif text */
                   padding-left: 0.1em;
                }
            `}</style>
        </div>
    )
}
