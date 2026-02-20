
'use client'

import { ResumeData } from '@/lib/gemini'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function Template5({ data, resumeId, fileName }: { data: ResumeData, resumeId?: string, fileName?: string }) {
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

    if (!isMounted) return null

    return (
        <div className="bg-[#F8F6F3] min-h-screen font-sans text-[#333333] selection:bg-[#F3590E]/30 overflow-x-hidden">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;700&display=swap');
                
                .font-serif-basker {
                    font-family: 'Libre Baskerville', serif;
                }
                
                .font-dm-sans {
                    font-family: 'DM Sans', sans-serif;
                }

                .bg-grid-slate-900 {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.1)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
                }
            `}</style>

            {/* Header */}
            <header className="py-6 sm:py-10 sticky top-0 z-50 bg-[#F8F6F3]/80 backdrop-blur-md">
                <Container className="max-w-6xl">
                    <nav className="flex items-center justify-between font-dm-sans">
                        <div className="flex items-center gap-12">
                            <span className="text-xl font-bold tracking-tight text-[#001666]">{fullName}</span>
                            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                                <a href="#work" className="hover:text-[#F3590E] transition-colors">Work</a>
                                <a href="#skills" className="hover:text-[#F3590E] transition-colors">Expertise</a>
                                <a href="#contact" className="hover:text-[#F3590E] transition-colors">Contact</a>
                            </div>
                        </div>
                        <Button asChild className="bg-[#F3590E] hover:bg-[#d94d0b] text-white rounded-full px-6 h-11 font-bold text-sm shadow-lg shadow-[#F3590E]/20">
                            <a href={`mailto:${email}`}>Say Hello</a>
                        </Button>
                    </nav>
                </Container>
            </header>

            {/* Hero */}
            <section className="py-20 sm:py-32 relative">
                <Container className="max-w-4xl text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-8"
                    >
                        <motion.span variants={itemVariants} className="inline-block text-[#F3590E] font-dm-sans font-bold text-sm uppercase tracking-widest">
                            {location}
                        </motion.span>
                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl font-serif-basker font-bold text-[#001666] leading-[1.1]">
                            {title.split(' ').map((word: string, i: number) => (
                                <span key={i} className={cn(i % 2 === 1 ? "italic" : "")}>{word}{' '}</span>
                            ))}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg sm:text-xl text-[#333333]/80 max-w-2xl mx-auto font-dm-sans leading-relaxed">
                            {summary}
                        </motion.p>
                        <motion.div variants={itemVariants} className="pt-8">
                            {calendlyUrl ? (
                                <Button asChild className="bg-[#F3590E] hover:bg-[#d94d0b] text-white rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-[#F3590E]/30 group">
                                    <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                                        Get in Touch <Icons.arrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                            ) : (
                                <Button asChild className="bg-[#F3590E] hover:bg-[#d94d0b] text-white rounded-full px-10 h-16 text-lg font-bold shadow-2xl shadow-[#F3590E]/30 group">
                                    <a href={`mailto:${email}`} className="flex items-center gap-3">
                                        Get in Touch <Icons.arrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                </Container>

                {/* Floating Elements Mockup */}
                <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 0.8, x: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-20 -left-10 w-64 h-48 bg-white shadow-2xl rounded-2xl rotate-[-12deg] border border-black/5 overflow-hidden"
                    >
                        <div className="w-full h-full bg-[#001666]/5 flex items-center justify-center">
                            <Icons.laptop className="w-12 h-12 text-[#001666]/20" />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 0.8, x: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="absolute top-20 -right-10 w-64 h-48 bg-white shadow-2xl rounded-2xl rotate-[12deg] border border-black/5 overflow-hidden"
                    >
                        <div className="w-full h-full bg-[#F3590E]/5 flex items-center justify-center">
                            <Icons.user className="w-12 h-12 text-[#F3590E]/20" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Work */}
            <section id="work" className="py-24 sm:py-32">
                <Container className="max-w-6xl">
                    <div className="mb-20 text-center space-y-4">
                        <h2 className="text-4xl sm:text-6xl font-serif-basker font-bold italic text-[#001666]">Design in action</h2>
                        <p className="text-gray-500 font-dm-sans">Selected projects that define my creative process.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="group space-y-8"
                            >
                                <div className="aspect-[4/3] rounded-[2.5rem] bg-[#EBE9E4] border border-black/5 overflow-hidden relative">
                                    {project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                            <Icons.laptop className="w-20 h-20 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-[#001666]/0 group-hover:bg-[#001666]/5 transition-colors duration-500" />
                                </div>
                                <div className="space-y-4 px-4">
                                    <h3 className="text-2xl font-bold text-[#001666] uppercase tracking-tight font-dm-sans">{project.name}</h3>
                                    <p className="text-[#333333]/70 font-dm-sans leading-relaxed line-clamp-2">
                                        {project.description}
                                    </p>
                                    <Button asChild variant="link" className="text-[#F3590E] p-0 h-auto font-bold uppercase tracking-widest text-xs">
                                        <a href={project.link || "#"}>View Case Study <Icons.arrowRight className="w-3 h-3 ml-2" /></a>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Expertise / Skills Cloud */}
            <section id="skills" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.03] [mask-image:radial-gradient(white,transparent_80%)]" />
                <Container className="max-w-4xl text-center relative z-10 space-y-16">
                    <div className="space-y-6">
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[#F3590E]/10 flex items-center justify-center">
                                <Icons.star className="w-8 h-8 text-[#F3590E]" />
                            </div>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-serif-basker font-bold text-[#001666]">What I bring to <br /><span className="italic">the table</span></h2>
                        <p className="text-gray-500 font-dm-sans max-w-lg mx-auto">A mix of technical prowess and user-centric philosophy.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.flatMap(s => s.items).map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                transition={{ duration: 0.3 }}
                                className="px-8 py-4 rounded-full bg-[#F8F6F3] border border-[#001666]/5 text-[#001666] font-bold font-dm-sans text-sm sm:text-base shadow-sm cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Behind the Canvas */}
            <section className="py-32 bg-[#1A1C20] text-white">
                <Container className="max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Icons.laptop className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-4xl sm:text-6xl font-serif-basker font-bold leading-tight">Behind the <br /><span className="italic text-[#F3590E]">canvas</span></h2>
                            <p className="text-gray-400 font-dm-sans text-lg leading-relaxed max-w-md">
                                My approach combines analytical thinking with artistic intuition. Every pixel serves a purpose, and every interaction tells a story.
                            </p>
                            <div className="flex gap-4">
                                {workExperience.slice(0, 3).map((exp, i) => (
                                    <div key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#F3590E]">
                                        {exp.position}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.2 }}
                                    className={cn("aspect-[2/3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden", i === 2 ? "translate-y-12" : "")}
                                >
                                    <div className="w-full h-full bg-gradient-to-b from-transparent to-black/50" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Footer / CTA */}
            <section id="contact" className="py-32 sm:py-48 text-center bg-[#F8F6F3]">
                <Container className="max-w-4xl space-y-12">
                    <div className="w-16 h-16 rounded-full bg-[#F3590E]/10 flex items-center justify-center mx-auto mb-10">
                        <Icons.mail className="w-8 h-8 text-[#F3590E]" />
                    </div>
                    <h2 className="text-4xl sm:text-7xl font-serif-basker font-bold text-[#001666] leading-tight max-w-3xl mx-auto">Ready to build something <br /><span className="italic">amazing?</span></h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                        <Button asChild className="bg-[#F3590E] hover:bg-[#d94d0b] text-white rounded-full px-12 h-20 text-xl font-bold shadow-2xl shadow-[#F3590E]/30 group w-full sm:w-auto">
                            <a href={`mailto:${email}`} className="flex items-center gap-3">
                                Start a Conversation <Icons.arrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="border-[#001666]/10 hover:bg-[#001666]/5 text-[#001666] rounded-full px-12 h-20 text-xl font-bold w-full sm:w-auto">
                            <a href={linkedinUrl || "#"}>Connect on LinkedIn</a>
                        </Button>
                    </div>

                    <div className="pt-32 flex flex-col items-center gap-8">
                        <div className="flex gap-10">
                            {linkedinUrl && <a href={linkedinUrl} className="text-[#001666]/40 hover:text-[#001666] transition-colors"><Icons.linkedin className="w-6 h-6" /></a>}
                            {githubUsername && <a href={`https://github.com/${githubUsername}`} className="text-[#001666]/40 hover:text-[#001666] transition-colors"><Icons.user className="w-6 h-6" /></a>}
                            <a href={`mailto:${email}`} className="text-[#001666]/40 hover:text-[#001666] transition-colors"><Icons.mail className="w-6 h-6" /></a>
                        </div>
                        <p className="text-sm font-dm-sans font-medium text-gray-500">
                            © {new Date().getFullYear()} {fullName}. All rights reserved.
                        </p>
                    </div>
                </Container>
            </section>
        </div>
    )
}
