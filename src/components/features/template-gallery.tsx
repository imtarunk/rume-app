
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { TemplateCard } from '@/components/features/template-card'
import { Template1 } from '@/components/templates/template-1'
import { Template2 } from '@/components/templates/template-2'
import { Template3 } from '@/components/templates/template-3'
import { Template4 } from '@/components/templates/template-4'
import { Template5 } from '@/components/templates/template-5'
import { cn } from '@/lib/utils'
import { Sparkles, Lock, ArrowRight, Eye, X } from 'lucide-react'

const MOCK_DATA = {
    personalInfo: {
        fullName: "Tarun Saini",
        email: "tarun@codextarun.xyz",
        phone: "+91 999999999",
        location: "Chandigarh, India",
        summary: "Product-focused Engineer specializing in building high-performance AI applications. Expert in React, Node.js, and modern cloud stacks.",
        title: "Staff Product Engineer",
        linkedinUrl: "https://linkedin.com/in/tarun",
        portfolioUrl: "https://codextarun.xyz",
        githubUsername: "imtarunk",
        calendlyUrl: "https://calendly.com",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    workExperience: [
        {
            company: "Rume AI",
            position: "Lead Engineer",
            startDate: "2024-01",
            endDate: "Present",
            description: ["Leading development of AI-powered portfolio solutions.", "Implementing high-performance server-side rendering for complex templates.", "Optimized data extraction pipelines using Gemini 1.5 Pro."],
            skills: ["React", "Next.js", "TypeScript"]
        },
        {
            company: "Tech Giant",
            position: "Senior Frontend Engineer",
            startDate: "2021-06",
            endDate: "2023-12",
            description: ["Architected the core UI library used across all internal tools.", "Reduced bundle size by 40% through aggressive code splitting."],
            skills: ["React", "Web Performance"]
        }
    ],
    projects: [
        {
            name: "Rume Portfolio",
            description: "An AI-powered portfolio builder that converts resumes to high-end websites in seconds.",
            technologies: ["Next.js", "Tailwind", "Supabase", "Gemini"],
            link: "https://rume.app",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        },
        {
            name: "The Infinite Grid",
            description: "A high-performance CSS grid component for large-scale data visualization.",
            technologies: ["React", "Canvas", "Algorithm"],
            link: "#",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        }
    ],
    skills: [
        {
            category: "Core Tech",
            items: ["React", "TypeScript", "Next.js", "AI/ML"]
        },
        {
            category: "Tools",
            items: ["PostgreSQL", "TailwindCSS", "Framer Motion"]
        }
    ],
    education: [
        {
            school: "Tech Institute",
            degree: "B.Tech",
            fieldOfStudy: "Computer Science",
            startDate: "2018-07",
            endDate: "2022-06"
        }
    ],
    settings: {
        is_published: true,
        blogEnabled: true,
        blogUrl: "#"
    }
}

const TEMPLATES = [
    {
        name: 'Executive',
        desc: 'Minimalist, powerful, and ultra-professional.',
        color: 'from-slate-900 to-slate-800',
        isFree: true,
        id: 'template-1',
        tag: 'Classic'
    },
    {
        name: 'Creative',
        desc: 'Bold gradients and high-impact layouts.',
        color: 'from-orange-600/20 to-amber-600/20',
        isFree: false,
        id: 'template-2',
        tag: 'Bold'
    },
    {
        name: 'Bento',
        desc: 'Sophisticated grid-based design.',
        color: 'from-orange-600/20 to-amber-600/20',
        isFree: false,
        id: 'template-3',
        tag: 'Modern'
    },
    {
        name: 'Minimalist',
        desc: 'Clean, typography-focused professional look.',
        color: 'from-emerald-600/20 to-teal-600/20',
        isFree: false,
        id: 'template-4',
        tag: 'Premium'
    },
    {
        name: 'Designer',
        desc: 'Elevated serif typography and organic layouts.',
        color: 'from-blue-600/20 to-indigo-600/20',
        isFree: false,
        id: 'template-5',
        tag: 'Artistic'
    }
]

export function TemplateGallery() {
    const [previewId, setPreviewId] = useState<string | null>(null)

    const renderTemplate = (id: string, data: any) => {
        switch (id) {
            case 'template-1': return <Template1 data={data} />
            case 'template-2': return <Template2 data={data} />
            case 'template-3': return <Template3 data={data} />
            case 'template-4': return <Template4 data={data} />
            case 'template-5': return <Template5 data={data} />
            default: return <Template1 data={data} />
        }
    }

    return (
        <div className="space-y-32">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10 lg:gap-16">
                {TEMPLATES.map((tmpl, i) => (
                    <TemplateCard key={i} className="group relative flex flex-col h-full transition-all">
                        <div className="absolute -inset-1 rounded-[3.5rem] bg-gradient-to-b from-white/10 to-transparent blur-xl transition-opacity opacity-0 group-hover:opacity-100" />

                        <div className="relative flex-1 bg-white/[0.03] border border-white/10 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl hover:border-white/20 transition-all duration-700 flex flex-col shadow-2xl">
                            {/* Visual Preview Area */}
                            <div className={cn("aspect-[16/10] bg-gradient-to-br transition-all duration-700 relative overflow-hidden", tmpl.color)}>
                                {/* Browser Mockup Frame */}
                                <div className="absolute inset-8 bottom-0 rounded-t-[2rem] border-x border-t border-white/20 bg-white/5 shadow-2xl overflow-hidden group-hover:inset-6 group-hover:bottom-0 transition-all duration-700">
                                    <div className="h-8 bg-white/10 border-b border-white/10 flex items-center px-4 gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                                        <div className="w-2 h-2 rounded-full bg-green-400/50" />
                                        <div className="ml-2 px-3 py-1 bg-white/5 rounded-full text-[8px] text-white/30 font-mono">rume.app/tarun</div>
                                    </div>

                                    {/* Scaled Template Rendering */}
                                    <div className="absolute inset-0 top-8 scale-[0.5] origin-top-left h-[200%] w-[200%] group-hover:scale-[0.52] transition-all duration-1000 pointer-events-none overflow-hidden bg-[#0a0a0a]">
                                        <div className="transform-gpu">
                                            {renderTemplate(tmpl.id, MOCK_DATA)}
                                        </div>
                                    </div>

                                    {/* Hover Overlay for Preview Button */}
                                    <div className="absolute inset-0 top-8 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewId(tmpl.id);
                                            }}
                                            className="bg-white text-black hover:bg-gray-100 rounded-full px-8 h-12 font-black uppercase text-xs tracking-widest shadow-2xl scale-90 group-hover:scale-100 transition-all"
                                        >
                                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                                        </Button>
                                    </div>
                                </div>

                                {/* Premium Label */}
                                {!tmpl.isFree && (
                                    <div className="absolute top-10 right-10 z-10 transition-transform group-hover:translate-x-2">
                                        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
                                            <Lock className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Premium</span>
                                        </div>
                                    </div>
                                )}

                                {/* Floating Tag */}
                                <div className="absolute top-10 left-10 z-10 transition-transform group-hover:-translate-x-2">
                                    <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase text-white/70 tracking-widest">
                                        {tmpl.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-10 space-y-6 mt-auto bg-gradient-to-b from-transparent to-black/30">
                                <div className="space-y-3">
                                    <h4 className="text-4xl font-black text-foreground tracking-tighter leading-none group-hover:text-orange-500 transition-colors">{tmpl.name}</h4>
                                    <p className="text-muted-foreground font-medium text-base leading-relaxed max-w-sm">
                                        {tmpl.desc}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                        tmpl.isFree ? "text-green-400 bg-green-400/5 border-green-400/20" : "text-orange-400 bg-orange-400/5 border-orange-400/20"
                                    )}>
                                        {tmpl.isFree ? 'Free Access' : 'One-Time Payment'}
                                    </div>
                                    <div className="text-white bg-white/5 w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TemplateCard>
                ))}
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
                    >
                        <div className="flex items-center justify-between h-20 px-8 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                                    Demo Mode
                                </div>
                                <span className="text-white font-bold tracking-tight">
                                    Previewing: {TEMPLATES.find(t => t.id === previewId)?.name}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setPreviewId(null)}
                                className="rounded-full hover:bg-white/10 text-white"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            <div className="max-w-[1400px] mx-auto py-20 px-4 md:px-10">
                                <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5">
                                    {renderTemplate(previewId, MOCK_DATA)}
                                </div>
                            </div>
                        </div>

                        <div className="h-24 bg-black/80 backdrop-blur-md border-t border-white/5 flex items-center justify-center px-8">
                            <Button
                                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-12 h-14 font-black uppercase text-sm tracking-widest shadow-2xl shadow-orange-500/20"
                                onClick={() => {
                                    setPreviewId(null);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                Create My Portfolio with this Style
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
