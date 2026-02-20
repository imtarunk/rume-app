
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Settings, Share2, ChevronLeft, ExternalLink, Layout, FileText,
    Save, Check, Globe, Monitor, Smartphone, History, Zap, ArrowUpRight, Lock, Copy, Upload
} from 'lucide-react'

import { ResumeData } from '@/lib/gemini'
import { Template1 } from '@/components/templates/template-1'
import { Template2 } from '@/components/templates/template-2'
import { Template3 } from '@/components/templates/template-3'
import { Template4 } from '@/components/templates/template-4'
import { Button } from '@/components/ui/button'
import { updateResumeTemplate, updateResumeSettings, updateResumeData, createRazorpayOrder, uploadImage } from '@/app/actions'
import { cn } from '@/lib/utils'

interface PortfolioPreviewProps {
    data: ResumeData
    resumeId: string
    initialTemplate?: string
    fileName?: string
    hasFullAccess?: boolean
}

const TEMPLATES = [
    { id: 'template-1', name: 'Executive', description: 'Clean, professional, and impactful', color: 'bg-blue-600', isFree: true },
    { id: 'template-2', name: 'Creative', description: 'Bold, modern, and high-energy', color: 'bg-orange-600', isFree: false, price: 'Premium' },
    { id: 'template-3', name: 'Bento', description: 'Sophisticated grid-based design', color: 'bg-[#D85828]', isFree: false, price: 'Premium' },
    { id: 'template-4', name: 'Modern Minimal', description: 'Sleek, emerald-accented, tech-first', color: 'bg-emerald-600', isFree: false, price: 'Premium' }
]

export function PortfolioPreview({ data: initialData, resumeId, initialTemplate, fileName, hasFullAccess = false }: PortfolioPreviewProps) {
    const router = useRouter()
    const [data, setData] = useState(initialData)
    const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || 'template-1')
    const [isPublishing, setIsPublishing] = useState(false)
    const [showSettings, setShowSettings] = useState(true)
    const [activeTab, setActiveTab] = useState<'design' | 'content'>('design')
    const [subdomain, setSubdomain] = useState(data.settings?.subdomain || '')
    const [isPublished, setIsPublished] = useState(data.settings?.is_published || false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
    const [activeMainTab, setActiveMainTab] = useState<'preview' | 'templates'>('preview')

    const [isPremium, setIsPremium] = useState(hasFullAccess)

    const [editSummary, setEditSummary] = useState(data.personalInfo.summary)
    const [isCopied, setIsCopied] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const publishedUrl = mounted && isPublished
        ? `${window.location.origin}/portfolio/${resumeId}${subdomain ? `?s=${subdomain}` : ''}`
        : null

    const isTemplateUnlocked = (templateId: string) => {
        const template = TEMPLATES.find(t => t.id === templateId)
        if (template?.isFree) return true
        return isPremium
    }

    const copyToClipboard = async () => {
        if (!publishedUrl) return
        try {
            await navigator.clipboard.writeText(publishedUrl)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const triggerPayment = async (templateId: string, onBlock?: 'select' | 'publish') => {
        try {
            const orderData = await createRazorpayOrder(templateId, resumeId)

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "Rume",
                description: "Unlock Premium Template",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    setIsPremium(true)

                    if (onBlock === 'select') {
                        setSelectedTemplate(templateId)
                        await updateResumeTemplate(resumeId, templateId)
                        alert("Payment successful! Template unlocked and selected.")
                    } else if (onBlock === 'publish') {
                        // First activate the template
                        await updateResumeTemplate(resumeId, templateId)
                        // Then publish
                        const newStatus = true // Force to published on payment
                        await updateResumeSettings(resumeId, { is_published: newStatus, subdomain })
                        setIsPublished(newStatus)
                        alert("Payment successful! Your premium portfolio is now live.")
                    } else {
                        alert("Payment successful! All premium templates are now unlocked.")
                    }
                },
                prefill: {
                    name: orderData.user.name,
                    email: orderData.user.email,
                },
                theme: { color: "#f97316" },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error("Payment error:", error)
            alert("Failed to initiate payment. Please try again.")
        }
    }

    const handleTemplateChange = async (templateId: string) => {
        setSelectedTemplate(templateId)

        // Only sync to backend if it's already unlocked/free
        if (isTemplateUnlocked(templateId)) {
            await updateResumeTemplate(resumeId, templateId)
        }
    }

    const handlePublish = async () => {
        // If the currently selected template in UI is locked, must unlock first
        if (!isTemplateUnlocked(selectedTemplate)) {
            await triggerPayment(selectedTemplate, 'publish')
            return
        }

        setIsPublishing(true)
        const newStatus = !isPublished

        // Ensure the backend has the correct template ID before publishing
        await updateResumeTemplate(resumeId, selectedTemplate)

        const result = await updateResumeSettings(resumeId, { is_published: newStatus, subdomain })

        if (result.success) {
            setIsPublished(newStatus)
        } else if (result.error) {
            alert(result.error)
        }

        setIsPublishing(false)
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        await updateResumeSettings(resumeId, { is_published: isPublished, subdomain })
        setIsSaving(false)
    }

    const handleSaveContent = async () => {
        setIsSaving(true)
        const updatedContent = {
            ...data,
            personalInfo: {
                ...data.personalInfo,
                summary: editSummary
            }
        }
        const result = await updateResumeData(resumeId, updatedContent)
        if (result.success) {
            setData(updatedContent as any)
        }
        setIsSaving(false)
    }

    const handleChangeResume = () => {
        if (confirm("Are you sure you want to upload a new resume? This will replace your current portfolio data.")) {
            router.push('/?new=true')
        }
    }

    const TemplateComponent = (({
        'template-1': Template1,
        'template-2': Template2,
        'template-3': Template3,
        'template-4': Template4,
    } as Record<string, any>)[selectedTemplate]) || Template1

    return (
        <div className="flex flex-col h-screen bg-background font-sans overflow-hidden text-foreground">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 z-50 bg-background/80 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-xl hover:bg-white/5 active:scale-90">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1" />

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => setActiveMainTab('preview')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all",
                                activeMainTab === 'preview' ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveMainTab('templates')}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all",
                                activeMainTab === 'templates' ? "bg-white/10 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Templates
                        </button>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <Button
                        variant={viewMode === 'desktop' ? 'outline' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('desktop')}
                        className={cn("h-8 w-8 rounded-lg", viewMode === 'desktop' && "bg-background shadow-sm border-white/10")}
                    >
                        <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'mobile' ? 'outline' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('mobile')}
                        className={cn("h-8 w-8 rounded-lg", viewMode === 'mobile' && "bg-background shadow-sm border-white/10")}
                    >
                        <Smartphone className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2">
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20">
                            <Settings className="w-5 h-5" />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/settings')}
                            className="hidden sm:flex rounded-xl hover:bg-white/5"
                        >
                            <Globe className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>

                    {isPublished && publishedUrl && (
                        <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 mr-2">
                            <Button variant="ghost" asChild className="h-8 rounded-lg font-bold text-xs text-muted-foreground hover:text-orange-500 transition-colors px-3">
                                <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                                    Live
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="h-8 rounded-lg font-bold text-xs text-muted-foreground hover:text-foreground px-3"
                            >
                                {isCopied ? <Check className="w-3.5 h-3.5 mr-2 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                                {isCopied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    )}
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={cn(
                            "rounded-xl font-black px-4 sm:px-6 transition-all text-[11px] sm:text-xs",
                            isPublished
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                : !isTemplateUnlocked(selectedTemplate)
                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg active:scale-95"
                                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95"
                        )}
                    >
                        {isPublishing ? '...' : isPublished ? 'Revert' : !isTemplateUnlocked(selectedTemplate) ? 'Unlock & Go Live' : 'Go Live'}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar always visible */}

                {/* Left Side: Sidebar/Settings Drawer */}
                <aside className="fixed md:relative left-0 top-0 bottom-0 w-80 bg-background border-r border-white/5 transform transition-transform duration-500 ease-in-out z-40 translate-x-0 opacity-100">
                    <div className="h-full flex flex-col p-6">
                        <div className="flex items-center justify-between mb-8 md:hidden">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Editor Tools</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="rounded-xl h-9 w-9">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        </div>
                        {/* Tab Headers */}
                        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-8">
                            <button
                                onClick={() => setActiveTab('design')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black tracking-tight uppercase transition-all",
                                    activeTab === 'design' ? "bg-white/10 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Layout className="w-3.5 h-3.5" />
                                Design
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black tracking-tight uppercase transition-all",
                                    activeTab === 'content' ? "bg-white/10 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Content
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'design' ? (
                                    <motion.div
                                        key="design"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Layout Engine</h4>
                                            <div className="grid gap-4">
                                                {TEMPLATES.map((tmpl) => (
                                                    <div
                                                        key={tmpl.id}
                                                        onClick={() => handleTemplateChange(tmpl.id)}
                                                        className={cn(
                                                            "w-full p-4 rounded-2xl border-2 text-left transition-all group cursor-pointer",
                                                            selectedTemplate === tmpl.id
                                                                ? "border-orange-500 bg-orange-500/10"
                                                                : "border-white/5 hover:border-white/10 hover:bg-white/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={cn("text-base font-black tracking-tight transition-colors flex items-center gap-2", selectedTemplate === tmpl.id ? "text-orange-500" : "text-foreground")}>
                                                                {tmpl.name}
                                                                {!isTemplateUnlocked(tmpl.id) && (
                                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20">
                                                                        <Lock className="w-2.5 h-2.5 text-orange-500" />
                                                                        <span className="text-[9px] font-black text-orange-500 uppercase">Premium</span>
                                                                    </div>
                                                                )}
                                                            </span>
                                                            {selectedTemplate === tmpl.id && <Check className="w-4 h-4 text-orange-500" />}
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">{tmpl.description}</p>
                                                        {selectedTemplate === tmpl.id && !isTemplateUnlocked(tmpl.id) && (
                                                            <div className="mt-4 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20 flex items-center justify-between">
                                                                <span className="text-[10px] font-black uppercase text-orange-500">Premium Required</span>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-7 rounded-md bg-orange-500 hover:bg-orange-600 text-[10px] font-black"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        triggerPayment(tmpl.id, 'select');
                                                                    }}
                                                                >
                                                                    Unlock Now
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {(selectedTemplate === 'template-3' || selectedTemplate === 'template-4') && (
                                            <>
                                                <div className="h-px bg-white/5" />
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-foreground">Profile Photo</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id="profile-image-upload"
                                                                className="hidden"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (!file) return

                                                                    const formData = new FormData()
                                                                    formData.append('image', file)

                                                                    setIsSaving(true)
                                                                    try {
                                                                        const result = await uploadImage(formData, resumeId, 'profile')
                                                                        if (result.success && result.imageUrl) {
                                                                            const updatedData = { ...data }
                                                                            if (!updatedData.personalInfo) updatedData.personalInfo = {} as any
                                                                            (updatedData.personalInfo as any).profileImageUrl = result.imageUrl
                                                                            setData(updatedData)
                                                                        } else {
                                                                            alert(result.error || 'Upload failed')
                                                                        }
                                                                    } catch (err) {
                                                                        alert('An error occurred during upload')
                                                                    } finally {
                                                                        setIsSaving(false)
                                                                    }
                                                                }}
                                                            />
                                                            {(data.personalInfo as any)?.profileImageUrl ? (
                                                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group/img">
                                                                    <img
                                                                        src={(data.personalInfo as any).profileImageUrl}
                                                                        alt="Profile"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <label
                                                                        htmlFor="profile-image-upload"
                                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white"
                                                                    >
                                                                        <Upload className="w-6 h-6 mb-2" />
                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <label
                                                                    htmlFor="profile-image-upload"
                                                                    className="w-full aspect-[3/4] border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-orange-500/50 hover:bg-white/5 transition-all cursor-pointer group/upload"
                                                                >
                                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-transform">
                                                                        <Upload className="w-6 h-6" />
                                                                    </div>
                                                                    <p className="text-xs font-black uppercase tracking-[0.1em]">Upload Photo</p>
                                                                    <p className="text-[10px] mt-1 opacity-50 font-bold uppercase tracking-widest">Square or Portrait</p>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(selectedTemplate === 'template-3' || selectedTemplate === 'template-4') && (
                                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Template Visuals</h4>
                                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">Custom Assets</span>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {/* Project Visuals */}
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Project Visuals</h5>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {data.projects.slice(0, 4).map((project, idx) => (
                                                                            <div key={idx} className="space-y-1.5">
                                                                                <label className="text-[9px] font-black uppercase text-muted-foreground truncate block px-1">{project.name || `Project ${idx + 1}`}</label>
                                                                                <div className="relative aspect-video rounded-xl border border-white/5 bg-white/5 overflow-hidden group/project">
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        id={`project-image-${idx}`}
                                                                                        className="hidden"
                                                                                        onChange={async (e) => {
                                                                                            const file = e.target.files?.[0]
                                                                                            if (!file) return
                                                                                            const formData = new FormData()
                                                                                            formData.append('image', file)
                                                                                            setIsSaving(true)
                                                                                            try {
                                                                                                const result = await uploadImage(formData, resumeId, 'project', idx)
                                                                                                if (result.success && result.imageUrl) {
                                                                                                    const updatedData = { ...data }
                                                                                                    updatedData.projects[idx].imageUrl = result.imageUrl
                                                                                                    setData(updatedData)
                                                                                                }
                                                                                            } catch (err) {
                                                                                                console.error('Project image upload failed')
                                                                                            } finally {
                                                                                                setIsSaving(false)
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    {project.imageUrl ? (
                                                                                        <img src={project.imageUrl} className="w-full h-full object-cover" alt="" />
                                                                                    ) : (
                                                                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                                                                            <Layout className="w-5 h-5" />
                                                                                        </div>
                                                                                    )}
                                                                                    <label htmlFor={`project-image-${idx}`} className="absolute inset-0 bg-black/60 opacity-0 group-hover/project:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                                                                                        <Upload className="w-4 h-4 text-white" />
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {selectedTemplate === 'template-4' && (
                                            <>
                                                <div className="h-px bg-white/5" />
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Template Settings</h4>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">Modern Style</span>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-foreground">GitHub Username</label>
                                                            <input
                                                                type="text"
                                                                value={(data.personalInfo as any)?.githubUsername || ''}
                                                                onChange={(e) => {
                                                                    const updatedData = { ...data }
                                                                    if (!updatedData.personalInfo) updatedData.personalInfo = {} as any
                                                                    (updatedData.personalInfo as any).githubUsername = e.target.value
                                                                    setData(updatedData)
                                                                }}
                                                                placeholder="e.g. imtarunks"
                                                                className="w-full bg-white/5 border border-white/5 rounded-xl h-10 px-4 text-xs font-bold placeholder:text-muted-foreground/30 focus:border-emerald-500/50 outline-none transition-all text-white"
                                                            />
                                                            <p className="text-[9px] text-muted-foreground px-1 italic">Used for GitHub Activity Calendar</p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-foreground">Calendly URL</label>
                                                            <input
                                                                type="text"
                                                                value={(data.personalInfo as any)?.calendlyUrl || ''}
                                                                onChange={(e) => {
                                                                    const updatedData = { ...data }
                                                                    if (!updatedData.personalInfo) updatedData.personalInfo = {} as any
                                                                    (updatedData.personalInfo as any).calendlyUrl = e.target.value
                                                                    setData(updatedData)
                                                                }}
                                                                placeholder="calendly.com/your-link"
                                                                className="w-full bg-white/5 border border-white/5 rounded-xl h-10 px-4 text-xs font-bold placeholder:text-muted-foreground/30 focus:border-emerald-500/50 outline-none transition-all text-white"
                                                            />
                                                        </div>

                                                        <div className="space-y-4 pt-2">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-xs font-bold text-foreground">Blog Button</label>
                                                                <button
                                                                    onClick={() => {
                                                                        const updatedData = { ...data }
                                                                        if (!updatedData.settings) updatedData.settings = {} as any
                                                                        (updatedData.settings as any).blogEnabled = !(updatedData.settings as any).blogEnabled
                                                                        setData(updatedData)
                                                                    }}
                                                                    className={cn(
                                                                        "w-8 h-4 rounded-full transition-colors relative",
                                                                        (data.settings as any)?.blogEnabled ? "bg-emerald-500" : "bg-white/10"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                                                                        (data.settings as any)?.blogEnabled ? "right-0.5" : "left-0.5"
                                                                    )} />
                                                                </button>
                                                            </div>
                                                            {(data.settings as any)?.blogEnabled && (
                                                                <input
                                                                    type="text"
                                                                    value={(data.settings as any)?.blogUrl || ''}
                                                                    onChange={(e) => {
                                                                        const updatedData = { ...data }
                                                                        if (!updatedData.settings) updatedData.settings = {} as any
                                                                        (updatedData.settings as any).blogUrl = e.target.value
                                                                        setData(updatedData)
                                                                    }}
                                                                    placeholder="blog.yourdomain.com"
                                                                    className="w-full bg-white/5 border border-white/5 rounded-xl h-10 px-4 text-xs font-bold focus:border-emerald-500/50 outline-none transition-all text-white"
                                                                />
                                                            )}
                                                        </div>

                                                        <Button
                                                            onClick={async () => {
                                                                setIsSaving(true)
                                                                await updateResumeData(resumeId, data as any)
                                                                setIsSaving(false)
                                                            }}
                                                            disabled={isSaving}
                                                            className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-black rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest mt-2"
                                                        >
                                                            {isSaving ? 'Saving...' : 'Save Design Config'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Site Config</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-foreground">Custom Subdomain</label>
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            value={subdomain}
                                                            onChange={(e) => setSubdomain(e.target.value)}
                                                            placeholder="yourname"
                                                            className="w-full bg-white/5 border border-white/5 rounded-xl h-11 px-4 pr-24 text-sm font-bold placeholder:text-muted-foreground/30 focus:bg-white/10 focus:border-orange-500/50 outline-none transition-all text-foreground"
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground pointer-events-none">.rume.app</div>
                                                    </div>
                                                    {subdomain && (
                                                        <p className="text-[10px] text-muted-foreground font-medium px-1">
                                                            Your site will be available at <span className="text-orange-500">{subdomain}.rume.app</span>
                                                        </p>
                                                    )}
                                                </div>

                                                {isPublished && publishedUrl && (
                                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Live Link</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 truncate text-[11px] font-bold text-foreground opacity-60">
                                                                {publishedUrl}
                                                            </div>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={copyToClipboard}
                                                                className="h-8 w-8 rounded-lg hover:bg-white/10 flex-shrink-0"
                                                            >
                                                                {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={handleSaveSettings}
                                                    disabled={isSaving}
                                                    className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {isSaving ? 'Updating...' : 'Save Config'}
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bio Summary</h4>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20">AI Parsed</span>
                                            </div>
                                            <div className="space-y-4">
                                                <textarea
                                                    value={editSummary}
                                                    onChange={(e) => setEditSummary(e.target.value)}
                                                    rows={10}
                                                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-medium leading-relaxed placeholder:text-muted-foreground/30 focus:bg-white/10 focus:border-orange-500/50 outline-none transition-all resize-none text-foreground"
                                                    placeholder="Tell your story..."
                                                />
                                                <Button
                                                    onClick={handleSaveContent}
                                                    disabled={isSaving}
                                                    className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isSaving ? <Zap className="w-4 h-4 animate-pulse" /> : <Save className="w-4 h-4" />}
                                                    Update Summary
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Experience Details</h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        await updateResumeData(resumeId, data as any);
                                                        setIsSaving(false);
                                                    }}
                                                    className="h-7 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400"
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                            <div className="space-y-6">
                                                {data.workExperience.map((job, idx) => (
                                                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Role</label>
                                                                <input
                                                                    type="text"
                                                                    value={job.position}
                                                                    onChange={(e) => {
                                                                        const updatedData = { ...data };
                                                                        updatedData.workExperience[idx].position = e.target.value;
                                                                        setData(updatedData);
                                                                    }}
                                                                    className="w-full bg-transparent border-b border-white/10 text-xs font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Company</label>
                                                                <input
                                                                    type="text"
                                                                    value={job.company}
                                                                    onChange={(e) => {
                                                                        const updatedData = { ...data };
                                                                        updatedData.workExperience[idx].company = e.target.value;
                                                                        setData(updatedData);
                                                                    }}
                                                                    className="w-full bg-transparent border-b border-white/10 text-xs font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Start Date</label>
                                                                <input
                                                                    type="text"
                                                                    value={job.startDate}
                                                                    onChange={(e) => {
                                                                        const updatedData = { ...data };
                                                                        updatedData.workExperience[idx].startDate = e.target.value;
                                                                        setData(updatedData);
                                                                    }}
                                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">End Date</label>
                                                                <input
                                                                    type="text"
                                                                    value={job.endDate}
                                                                    onChange={(e) => {
                                                                        const updatedData = { ...data };
                                                                        updatedData.workExperience[idx].endDate = e.target.value;
                                                                        setData(updatedData);
                                                                    }}
                                                                    className="w-full bg-transparent border-b border-white/10 text-[10px] font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detailed Projects</h4>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        await updateResumeData(resumeId, data as any);
                                                        setIsSaving(false);
                                                    }}
                                                    className="h-7 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400"
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                            <div className="space-y-6">
                                                {data.projects.map((project, idx) => (
                                                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Project Name</label>
                                                            <input
                                                                type="text"
                                                                value={project.name}
                                                                onChange={(e) => {
                                                                    const updatedData = { ...data };
                                                                    updatedData.projects[idx].name = e.target.value;
                                                                    setData(updatedData);
                                                                }}
                                                                className="w-full bg-transparent border-b border-white/10 text-xs font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Link</label>
                                                            <input
                                                                type="text"
                                                                value={project.link}
                                                                onChange={(e) => {
                                                                    const updatedData = { ...data };
                                                                    updatedData.projects[idx].link = e.target.value;
                                                                    setData(updatedData);
                                                                }}
                                                                className="w-full bg-transparent border-b border-white/10 text-[10px] font-bold focus:border-emerald-500/50 outline-none pb-1 text-foreground"
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase text-muted-foreground opacity-50">Description</label>
                                                            <textarea
                                                                value={project.description}
                                                                onChange={(e) => {
                                                                    const updatedData = { ...data };
                                                                    updatedData.projects[idx].description = e.target.value;
                                                                    setData(updatedData);
                                                                }}
                                                                rows={2}
                                                                className="w-full bg-transparent border-b border-white/10 text-[10px] font-medium focus:border-emerald-500/50 outline-none pb-1 text-foreground resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Data Source</h4>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
                                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black tracking-tight text-foreground truncate max-w-[140px]">{fileName || 'Resume.pdf'}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Master Source</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" onClick={handleChangeResume} className="w-full rounded-xl h-9 text-xs font-bold border-white/10 hover:bg-white/5 hover:border-foreground transition-all">
                                                    Re-upload & Parse
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="pt-8 border-t border-white/5 mt-auto">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                                <span>Version 2.0.4</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span>Engine Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Side: Preview Area */}
                <main className="flex-1 bg-black/20 relative flex items-center justify-center p-3 md:p-12 overflow-hidden overflow-y-auto custom-scrollbar">
                    {activeMainTab === 'preview' ? (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "bg-white shadow-2xl transition-all duration-700 mx-auto transform-gpu",
                                viewMode === 'desktop' ? "w-full max-w-5xl aspect-[4/3] sm:aspect-video rounded-xl sm:rounded-2xl" : "w-full max-w-[390px] h-full max-h-[844px] rounded-[3rem] border-[8px] border-gray-900 overflow-hidden"
                            )}
                        >
                            {/* Browser Bar Frame (only in desktop) */}
                            {viewMode === 'desktop' && (
                                <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4 rounded-t-2xl">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                    </div>
                                    <div className="bg-white/80 h-6 flex-1 rounded-md border border-gray-200 flex items-center px-3 gap-2 max-w-md mx-auto">
                                        <Globe className="w-3 h-3 text-gray-300" />
                                        <span className="text-[10px] font-bold text-gray-400 tracking-tight truncate">
                                            {subdomain ? `${subdomain}.rume.app` : `rume.app/portfolio/${resumeId.split('-')[0]}`}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className={cn("overflow-y-auto text-gray-900 relative", viewMode === 'desktop' ? "h-[calc(100%-40px)]" : "h-full")}>
                                {!isTemplateUnlocked(selectedTemplate) && (
                                    <div className="absolute inset-x-0 top-0 z-10 p-4 flex justify-center pointer-events-none">
                                        <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-white/20">
                                            <Lock className="w-3 h-3" />
                                            Locked Premium Template
                                        </div>
                                    </div>
                                )}
                                <TemplateComponent data={data} resumeId={resumeId} fileName={fileName} />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="w-full h-full max-w-6xl mx-auto py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {TEMPLATES.map((tmpl) => (
                                    <motion.div
                                        key={tmpl.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "group relative flex flex-col bg-white/[0.03] rounded-[2.5rem] border transition-all overflow-hidden backdrop-blur-3xl",
                                            selectedTemplate === tmpl.id ? "border-orange-500 shadow-2xl shadow-orange-500/10" : "border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn("aspect-[4/5] relative overflow-hidden bg-gradient-to-br",
                                            tmpl.id === 'template-1' ? "from-slate-900 to-slate-800" : "from-orange-600/20 to-amber-600/20"
                                        )}>
                                            {/* Browser Mockup Frame (Scaled down for editor) */}
                                            <div className="absolute inset-4 bottom-0 rounded-t-xl border-x border-t border-white/10 bg-white/5 shadow-2xl overflow-hidden">
                                                <div className="h-4 bg-white/10 border-b border-white/10 flex items-center px-2 gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-red-400" />
                                                    <div className="w-1 h-1 rounded-full bg-yellow-400" />
                                                    <div className="w-1 h-1 rounded-full bg-green-400" />
                                                </div>
                                                <div className="absolute inset-0 top-4 scale-[0.4] origin-top-left h-[250%] w-[250%] bg-white pointer-events-none overflow-hidden">
                                                    <div className="text-black transform-gpu p-8">
                                                        {tmpl.id === 'template-4' ? (
                                                            <Template4 data={data} />
                                                        ) : tmpl.id === 'template-3' ? (
                                                            <Template3 data={data} />
                                                        ) : tmpl.id === 'template-2' ? (
                                                            <Template2 data={data} />
                                                        ) : (
                                                            <Template1 data={data} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-[2px]">
                                                <Button
                                                    onClick={() => {
                                                        handleTemplateChange(tmpl.id);
                                                        setActiveMainTab('preview');
                                                    }}
                                                    className="rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] px-8 h-10 hover:scale-105 transition-transform"
                                                >
                                                    Select Design
                                                </Button>
                                                {selectedTemplate === tmpl.id && (
                                                    <span className="text-[10px] font-black uppercase text-white/70">Currently Active</span>
                                                )}
                                            </div>

                                            {!isTemplateUnlocked(tmpl.id) && (
                                                <div className="absolute top-4 right-4 z-30">
                                                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                        <Lock className="w-2.5 h-2.5 text-orange-500" />
                                                        <span className="text-[9px] font-black text-white uppercase tracking-wider">{tmpl.price}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 space-y-3 mt-auto bg-gradient-to-b from-transparent to-white/[0.02]">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-black text-foreground tracking-tight">{tmpl.name}</h3>
                                                {selectedTemplate === tmpl.id && <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></div>}
                                            </div>
                                            <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-2">{tmpl.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div >

            <style>{`
                .custom-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div >
    )
}
