
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Settings, Share2, ChevronLeft, ExternalLink, Layout, FileText,
    Save, Check, Globe, Monitor, Smartphone, History, Zap, ArrowUpRight, Lock
} from 'lucide-react'

import { ResumeData } from '@/lib/gemini'
import { Template1 } from '@/components/templates/template-1'
import { Template2 } from '@/components/templates/template-2'
import { Button } from '@/components/ui/button'
import { updateResumeTemplate, updateResumeSettings, updateResumeData, createRazorpayOrder } from '@/app/actions'
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
    { id: 'template-2', name: 'Creative', description: 'Bold, modern, and high-energy', color: 'bg-orange-600', isFree: false, price: '₹99' }
]

export function PortfolioPreview({ data: initialData, resumeId, initialTemplate, fileName, hasFullAccess = false }: PortfolioPreviewProps) {
    const router = useRouter()
    const [data, setData] = useState(initialData)
    const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || 'template-1')
    const [isPublishing, setIsPublishing] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [activeTab, setActiveTab] = useState<'design' | 'content'>('design')
    const [subdomain, setSubdomain] = useState(data.settings?.subdomain || '')
    const [isPublished, setIsPublished] = useState(data.settings?.is_published || false)
    const [isSaving, setIsSaving] = useState(false)
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

    const [isPremium, setIsPremium] = useState(hasFullAccess)

    const [editSummary, setEditSummary] = useState(data.personalInfo.summary)

    const publishedUrl = isPublished
        ? `${window.location.origin}/portfolio/${resumeId}${subdomain ? `?s=${subdomain}` : ''}`
        : null

    const isTemplateUnlocked = (templateId: string) => {
        const template = TEMPLATES.find(t => t.id === templateId)
        if (template?.isFree) return true
        return isPremium
    }

    const handleTemplateChange = async (templateId: string) => {
        if (!isTemplateUnlocked(templateId)) {
            // Trigger Razorpay Payment
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
                        // After successful payment, update the state and template
                        setIsPremium(true)
                        setSelectedTemplate(templateId)
                        await updateResumeTemplate(resumeId, templateId)

                        // Note: Webhook will handle terminal database update for reliability
                        alert("Payment successful! Template unlocked.")
                    },
                    prefill: {
                        name: orderData.user.name,
                        email: orderData.user.email,
                    },
                    theme: {
                        color: "#f97316",
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            } catch (error) {
                console.error("Payment error:", error)
                alert("Failed to initiate payment. Please try again.")
            }
            return
        }

        setSelectedTemplate(templateId)
        await updateResumeTemplate(resumeId, templateId)
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        const newStatus = !isPublished
        await updateResumeSettings(resumeId, { is_published: newStatus, subdomain })
        setIsPublished(newStatus)
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

    const TemplateComponent = selectedTemplate === 'template-2' ? Template2 : Template1

    return (
        <div className="flex flex-col h-screen bg-background font-sans overflow-hidden text-foreground">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {/* Top Bar */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 z-50 bg-background/80 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-xl hover:bg-white/5">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1" />
                    <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight text-foreground leading-none">Portfolio Editor</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">ID: {resumeId.split('-')[0]}</span>
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

                <div className="flex items-center gap-3">
                    {isPublished && publishedUrl && (
                        <Button variant="ghost" asChild className="hidden sm:flex rounded-xl font-bold text-muted-foreground hover:text-orange-500 transition-colors">
                            <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Live Site
                            </a>
                        </Button>
                    )}
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={cn(
                            "rounded-xl font-black px-6 transition-all",
                            isPublished
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95"
                        )}
                    >
                        {isPublishing ? 'Updating...' : isPublished ? 'Unpublish' : 'Go Live'}
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Sidebar/Settings Drawer */}
                <aside className={cn(
                    "fixed md:relative left-0 top-16 bottom-0 w-80 bg-background border-r border-white/5 transform transition-transform duration-500 ease-in-out z-40",
                    !showSettings && "translate-x-full md:translate-x-0 md:w-0"
                )}>
                    <div className="h-full flex flex-col p-6 w-80">
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
                                                    <button
                                                        key={tmpl.id}
                                                        onClick={() => handleTemplateChange(tmpl.id)}
                                                        className={cn(
                                                            "w-full p-4 rounded-2xl border-2 text-left transition-all group",
                                                            selectedTemplate === tmpl.id
                                                                ? "border-orange-500 bg-orange-500/10"
                                                                : "border-white/5 hover:border-white/10 hover:bg-white/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={cn("text-base font-black tracking-tight transition-colors flex items-center gap-2", selectedTemplate === tmpl.id ? "text-orange-500" : "text-foreground")}>
                                                                {tmpl.name}
                                                                {!isTemplateUnlocked(tmpl.id) && (
                                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                                                                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                                                                        <span className="text-[9px] font-black text-muted-foreground/80">{tmpl.price}</span>
                                                                    </div>
                                                                )}
                                                            </span>
                                                            {selectedTemplate === tmpl.id && <Check className="w-4 h-4 text-orange-500" />}
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">{tmpl.description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-white/5" />

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Site Config</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-foreground">Subdomain</label>
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
                                                </div>
                                                <Button
                                                    onClick={handleSaveSettings}
                                                    disabled={isSaving}
                                                    className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold transition-all"
                                                >
                                                    {isSaving ? 'Updating...' : 'Save Settings'}
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
                                                    Update Content
                                                </Button>
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
                <main className="flex-1 bg-black/20 relative flex items-center justify-center p-4 md:p-12 overflow-hidden overflow-y-auto">
                    <motion.div
                        layout
                        className={cn(
                            "bg-white shadow-2xl transition-all duration-700 mx-auto transform-gpu",
                            viewMode === 'desktop' ? "w-full max-w-5xl aspect-video rounded-2xl" : "w-[390px] h-[844px] rounded-[3rem] border-[8px] border-gray-900 overflow-hidden"
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
                        <div className={cn("overflow-y-auto text-gray-900", viewMode === 'desktop' ? "h-[calc(100%-40px)]" : "h-full")}>
                            <TemplateComponent data={data} />
                        </div>
                    </motion.div>
                </main>
            </div >

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div >
    )
}
