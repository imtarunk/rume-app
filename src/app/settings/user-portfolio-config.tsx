
'use client'

import { useState, useEffect } from 'react'
import { Globe, Layout, Save, Check, Ban, ExternalLink, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateResumeSettings } from '@/app/actions'
import { cn } from '@/lib/utils'

interface UserPortfolioConfigProps {
    resume: any
    hasFullAccess: boolean
}

export function UserPortfolioConfig({ resume, hasFullAccess }: UserPortfolioConfigProps) {
    const [subdomain, setSubdomain] = useState(resume.content?.settings?.subdomain || '')
    const [isPublished, setIsPublished] = useState(resume.is_published)
    const [isSaving, setIsSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSave = async () => {
        setIsSaving(true)
        setStatus('idle')

        const result = await updateResumeSettings(resume.id, {
            subdomain,
            is_published: isPublished
        })

        if (result.success) {
            setStatus('success')
            setTimeout(() => setStatus('idle'), 3000)
        } else {
            setStatus('error')
        }
        setIsSaving(false)
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const liveUrl = mounted && isPublished
        ? `${window.location.origin}/portfolio/${resume.id}${subdomain ? `?s=${subdomain}` : ''}`
        : null

    return (
        <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Globe className="w-3 h-3 text-orange-500" />
                Live Portfolio Configuration
            </h4>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-10">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Subdomain Input */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-foreground flex items-center gap-2">
                            Personal Subdomain
                            <div className="group relative">
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 rounded-xl bg-foreground text-background text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    Your portfolio will be accessible via this unique alias.
                                </div>
                            </div>
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="your-unique-name"
                                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 pr-32 text-base font-bold text-foreground placeholder:text-muted-foreground/20 focus:bg-white/10 focus:border-orange-500/50 outline-none transition-all"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-widest pointer-events-none">
                                .rume.app
                            </div>
                        </div>
                    </div>

                    {/* Published Toggle */}
                    <div className="space-y-4">
                        <label className="text-sm font-black text-foreground">Visibility Status</label>
                        <div className="flex items-center gap-4 h-14">
                            <button
                                onClick={() => setIsPublished(!isPublished)}
                                className={cn(
                                    "flex-1 h-full rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all",
                                    isPublished
                                        ? "bg-green-500/10 border-green-500 text-green-500 shadow-lg shadow-green-500/10"
                                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                                )}
                            >
                                {isPublished ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                {isPublished ? 'Live on Web' : 'Private Draft'}
                            </button>

                            {liveUrl && (
                                <Button asChild variant="ghost" className="h-14 w-14 rounded-2xl border border-white/10 p-0">
                                    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-6">
                    <p className="text-xs font-medium text-muted-foreground max-w-md">
                        Changes to your subdomain or visibility are instant but may take a moment to propagate across global edge nodes.
                    </p>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "h-14 px-10 rounded-2xl font-black transition-all active:scale-95 group",
                            status === 'success' ? "bg-green-500 hover:bg-green-500" : "bg-foreground text-background"
                        )}
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">Updating...</span>
                        ) : status === 'success' ? (
                            <span className="flex items-center gap-2 animate-in zoom-in-95"><Check className="w-5 h-5" /> Saved!</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Save Configuration
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </section>
    )
}
