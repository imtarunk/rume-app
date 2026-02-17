
'use client'

import { ResumeData } from '@/lib/gemini'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { generateResumePDF } from '@/lib/pdf-generator'

export function Template3({ data, resumeId, fileName }: { data: ResumeData, resumeId?: string, fileName?: string }) {
    const { personalInfo = {}, workExperience = [], education = [], skills = [], projects = [] } = data || {}
    const { fullName = '', title = '', email = '', phone = '', location = '', linkedinUrl = '', portfolioUrl = '', summary = '', profileImageUrl = '' } = personalInfo as any

    const [hoveredProject, setHoveredProject] = useState<number | null>(null)

    const handleDownloadResume = async () => {
        await generateResumePDF(data, fileName)
    }


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
        <div className="bg-[#F8E8DD] min-h-screen font-sans text-[#2D2D2D] pb-20 selection:bg-[#D85828]/30">
            {/* Header */}
            <header className="py-8">
                <Container className="max-w-6xl">
                    <motion.nav
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-md rounded-full border border-white/20 shadow-xl shadow-black/5"
                    >
                        <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="w-8 h-8 bg-gradient-to-br from-[#D85828] to-[#FF6B3D] rounded-lg flex items-center justify-center text-white text-sm font-black italic shadow-lg shadow-[#D85828]/30"
                            >
                                {fullName.split(' ')[0][0]}
                            </motion.div>
                            {fullName.split(' ')[0]}
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-[#2D2D2D]/60">
                            <a href="#about" className="hover:text-[#D85828] transition-colors relative group">
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D85828] group-hover:w-full transition-all duration-300" />
                            </a>
                            <a href="#work" className="hover:text-[#D85828] transition-colors relative group">
                                Work
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D85828] group-hover:w-full transition-all duration-300" />
                            </a>
                            <a href="#contact" className="hover:text-[#D85828] transition-colors relative group">
                                Contact
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D85828] group-hover:w-full transition-all duration-300" />
                            </a>
                        </div>
                        <Button className="bg-[#D85828] hover:bg-[#C04820] text-white rounded-full px-6 text-xs font-black uppercase tracking-widest h-10 shadow-lg shadow-[#D85828]/30 transition-all hover:shadow-xl hover:shadow-[#D85828]/40 hover:scale-105">
                            Say Hi
                        </Button>
                    </motion.nav>
                </Container>
            </header>

            <Container className="max-w-6xl py-10">
                {/* Bento Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[120px]"
                >

                    {/* Intro Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="md:col-span-3 md:row-span-2 bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-10 flex flex-col justify-center border border-white/20 shadow-xl shadow-black/5 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D85828]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-[0.9] mb-6">
                                {title.split(',').map((part: string, i: number) => (
                                    <motion.span
                                        key={i}
                                        className="block"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5, duration: 0.6 }}
                                    >
                                        {part.trim()}{i === 0 ? ',' : ''}
                                    </motion.span>
                                ))}
                            </h1>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="flex items-center gap-4"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 rounded-full border-2 border-[#D85828]/20 flex items-center justify-center"
                                >
                                    <Icons.star className="w-5 h-5 text-[#D85828]" />
                                </motion.div>
                                <p className="text-lg font-medium text-[#2D2D2D]/60 leading-tight">
                                    Crafting digital experiences <br />
                                    through code and design.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Image Placeholder Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        className="md:col-span-1 md:row-span-3 bg-gradient-to-br from-[#EEDCCE] to-[#E5C9B8] rounded-[2.5rem] overflow-hidden relative group border border-white/20 shadow-xl shadow-black/5"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                        {profileImageUrl ? (
                            <img
                                src={profileImageUrl}
                                alt={fullName}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[#D85828]/20 group-hover:scale-110 transition-transform duration-700">
                                <Icons.user className="w-32 h-32" />
                            </div>
                        )}
                        {/* If user uploads a photo, it will go here */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute bottom-6 left-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#2D2D2D]/60 mb-1">Status</p>
                            <p className="text-xs font-bold flex items-center gap-2">
                                <motion.span
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-green-500"
                                />
                                Available for projects
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Bio Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#D85828] to-[#C04820] rounded-[2.5rem] p-10 flex flex-col justify-end text-white border border-[#D85828]/20 shadow-xl shadow-[#D85828]/20 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <p className="text-2xl font-medium leading-tight tracking-tight mb-4">
                                {summary || "A passionate designer and developer focused on building functional and beautiful digital products."}
                            </p>
                            <div className="flex items-center gap-2 text-white/60 font-black uppercase text-[10px] tracking-widest">
                                <Icons.laptop className="w-3 h-3" />
                                Based in {location || "Everywhere"}
                            </div>
                        </div>
                    </motion.div>

                    {/* Social/Say Hi Card */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-1 md:row-span-2 bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 space-y-4 border border-white/20 shadow-xl shadow-black/5"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: <Icons.linkedin className="w-5 h-5" />, url: linkedinUrl, color: 'hover:bg-[#0A66C2]' },
                                { icon: <Icons.google className="w-5 h-5" />, url: `mailto:${email}`, color: 'hover:bg-[#EA4335]' },
                                { icon: <Icons.user className="w-5 h-5" />, url: portfolioUrl, color: 'hover:bg-[#6366F1]' },
                                { icon: <Icons.arrowUpRight className="w-5 h-5" />, url: "#", color: 'hover:bg-[#D85828]' }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "aspect-square rounded-2xl bg-[#F8E8DD] flex items-center justify-center text-[#D85828] hover:text-white transition-all duration-300 shadow-md",
                                        social.color
                                    )}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                        <div className="pt-2">
                            <h3 className="text-xl font-black tracking-tight mb-2">Let's chat!</h3>
                            <p className="text-xs font-medium text-[#2D2D2D]/60 leading-relaxed">
                                Open for collaborations <br /> and new opportunities.
                            </p>
                        </div>
                    </motion.div>

                    {/* Sidebar "List" Card */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-1 md:row-span-4 bg-white/40 rounded-[2.5rem] p-8 border border-white/20 flex flex-col shadow-xl shadow-black/5"
                    >
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1 h-6 bg-[#D85828] rounded-full" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D85828]">Specialized In</h3>
                        </div>
                        <div className="space-y-6 flex-1">
                            {skills.slice(0, 4).map((skillGroup, i) => (
                                <motion.div
                                    key={i}
                                    className="space-y-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.8 }}
                                >
                                    <p className="text-xs font-bold">{skillGroup.category}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {skillGroup.items.slice(0, 3).map((item, j) => (
                                            <motion.span
                                                key={j}
                                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(216, 88, 40, 0.1)' }}
                                                className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#2D2D2D]/5 font-medium transition-colors"
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="mt-8 p-4 bg-gradient-to-br from-[#D85828]/5 to-[#D85828]/10 rounded-2xl border border-[#D85828]/10 text-center"
                        >
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#D85828]">Updated</p>
                            <p className="text-xs font-bold italic">February 2024</p>
                        </motion.div>
                    </motion.div>

                    {/* Footer Row Cards */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] rounded-[2.5rem] flex items-center justify-center gap-3 p-4 border border-white/5 shadow-xl shadow-black/10 cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Icons.page className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white">
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">View My</p>
                            <p className="text-xs font-bold tracking-tight leading-none">Full Resume</p>
                        </div>
                    </motion.div>

                    {/* Experience Highlights */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-2 md:row-span-1 bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-4 px-8 flex items-center justify-between border border-white/20 shadow-xl shadow-black/5"
                    >
                        {workExperience.slice(0, 2).map((job, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 1 }}
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#D85828] mb-1">{job.company}</p>
                                <p className="text-xs font-bold tracking-tight">{job.position}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                </motion.div>

                {/* Projects Section */}
                <motion.div
                    id="work"
                    className="mt-20 space-y-12"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D85828]/10 border border-[#D85828]/20 text-[#D85828] text-[10px] font-black uppercase tracking-widest"
                            >
                                <Icons.star className="w-3 h-3" />
                                Selected Projects
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tighter leading-none text-[#2D2D2D]">
                                Notable Work.
                            </h2>
                        </div>
                        <p className="text-[#2D2D2D]/60 font-medium max-w-sm">
                            A showcase of my recent explorations in design and development.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                className="group space-y-6"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                onMouseEnter={() => setHoveredProject(i)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <motion.div
                                    className="aspect-video bg-gradient-to-br from-[#EEDCCE] to-[#E5C9B8] rounded-[2.5rem] overflow-hidden relative border border-white/20 shadow-xl shadow-black/10"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/40 group-hover:to-black/60 transition-all duration-500" />
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center text-[#D85828]/10"
                                        animate={{
                                            scale: hoveredProject === i ? 1.1 : 1,
                                            rotate: hoveredProject === i ? 5 : 0
                                        }}
                                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} className="w-full h-full object-cover" alt={project.name} />
                                        ) : (
                                            <Icons.laptop className="w-32 h-32" />
                                        )}
                                    </motion.div>
                                    <motion.div
                                        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{
                                            scale: hoveredProject === i ? 1 : 0,
                                            rotate: hoveredProject === i ? 0 : -180
                                        }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <Icons.arrowUpRight className="w-6 h-6" />
                                    </motion.div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <motion.div
                                            initial={{ y: 10 }}
                                            animate={{ y: hoveredProject === i ? 0 : 10 }}
                                            className="text-white space-y-2"
                                        >
                                            <p className="text-xs font-bold">Click to view project</p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {project.technologies.slice(0, 3).map((tech, j) => (
                                            <motion.span
                                                key={j}
                                                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D85828]"
                                                initial={{ opacity: 0, x: -5 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: j * 0.05 + i * 0.2 }}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-bold tracking-tighter leading-none group-hover:text-[#D85828] transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-[#2D2D2D]/60 font-medium leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.footer
                    id="contact"
                    className="mt-40 text-center space-y-12"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="space-y-6">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="w-20 h-20 bg-gradient-to-br from-[#D85828] to-[#FF6B3D] rounded-3xl flex items-center justify-center text-white text-3xl font-black italic mx-auto shadow-2xl shadow-[#D85828]/30"
                        >
                            {fullName.split(' ')[0][0]}
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tighter">
                            Let's build something <br />
                            <span className="text-[#D85828]">exceptional.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={handleDownloadResume}
                                className="bg-[#2D2D2D] hover:bg-black text-white rounded-full px-10 h-16 font-black uppercase text-xs tracking-widest shadow-xl"
                            >
                                Download Resume
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="bg-[#D85828] hover:bg-[#C04820] text-white rounded-full px-10 h-16 font-black uppercase text-xs tracking-widest shadow-xl shadow-[#D85828]/20">
                                Email Me
                            </Button>
                        </motion.div>
                    </div>
                    <div className="pt-20 text-[10px] font-black uppercase tracking-[0.3em] text-[#2D2D2D]/40 pb-10">
                        © {new Date().getFullYear()} {fullName}. All Rights Reserved.
                    </div>
                </motion.footer>
            </Container>
        </div>
    )
}
