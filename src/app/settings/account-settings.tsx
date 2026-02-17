
'use client'

import { User } from '@supabase/supabase-js'
import { Sparkles, Mail, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AccountSettings({ user, hasFullAccess }: { user: User, hasFullAccess: boolean }) {
    return (
        <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-orange-500" />
                Security & Account
            </h4>

            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground leading-none mb-2">Email Address</p>
                            <p className="text-lg font-bold text-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className={cn(
                        "inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all",
                        hasFullAccess
                            ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            : "bg-white/5 text-muted-foreground border border-white/10"
                    )}>
                        <Sparkles className={cn("w-4 h-4", hasFullAccess && "animate-pulse")} />
                        {hasFullAccess ? 'Premium Active' : 'Basic Plan'}
                    </div>
                </div>
            </div>
        </section>
    )
}
