
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, ExternalLink, LogOut, ChevronDown, Shield } from 'lucide-react'
import Link from 'next/link'

export function UserMenu({ user, resumeId, isPublished, isAdmin }: { user: any, resumeId?: string, isPublished?: boolean, isAdmin?: boolean }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const avatarUrl = user?.user_metadata?.avatar_url
    const email = user?.email || 'User'

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
        setIsLoading(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={email}
                        className="w-8 h-8 rounded-full border border-white/10"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs border border-orange-500/20">
                        {email[0].toUpperCase()}
                    </div>
                )}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl bg-background border border-white/10 shadow-2xl overflow-hidden z-[60] backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Account</p>
                            <p className="text-sm font-bold text-foreground truncate">{email}</p>
                        </div>

                        <div className="p-2">
                            {resumeId ? (
                                isPublished ? (
                                    <Link
                                        href={`/portfolio/${resumeId}`}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <ExternalLink className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                                        Live Portfolio
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-muted-foreground/40 cursor-not-allowed">
                                        <ExternalLink className="w-4 h-4" />
                                        Live Portfolio (Draft)
                                    </div>
                                )
                            ) : null}
                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                                Settings
                            </Link>

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-orange-500 hover:bg-orange-500/10 transition-all group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Shield className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}
                        </div>

                        <div className="p-2 border-t border-white/5">
                            <button
                                onClick={handleSignOut}
                                disabled={isLoading}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                {isLoading ? 'Logging out...' : 'Log out'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
