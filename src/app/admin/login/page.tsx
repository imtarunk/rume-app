
'use client'

import { useState } from 'react'
import { loginAdmin } from '../actions'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await loginAdmin(formData)

        if (result.success) {
            router.push('/admin')
            router.refresh()
        } else {
            setError(result.error || 'Login failed')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <Container className="relative z-10 max-w-md">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="inline-flex w-16 h-16 bg-orange-500 rounded-2xl items-center justify-center text-white shadow-2xl shadow-orange-500/20 mb-4 animate-in zoom-in duration-500">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">System Access</h1>
                        <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Internal ID</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="admin@internal.rume"
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Access Key</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all group"
                        >
                            {isLoading ? 'Decrypting...' : (
                                <span className="flex items-center gap-2">
                                    Initiate Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                        Rume AI • Administrative Portal
                    </p>
                </div>
            </Container>
        </div>
    )
}
