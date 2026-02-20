
'use client'

import { useState } from 'react'
import { togglePremiumAccess } from '@/app/admin/actions'
import { Sparkles, Shield, Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface User {
    id: string
    email: string | undefined
    createdAt: string
    isPremium: boolean
}

export function PremiumUserTable({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleToggle = async (userId: string, currentStatus: boolean) => {
        setLoadingId(userId)
        try {
            await togglePremiumAccess(userId, !currentStatus)
            setUsers(users.map(u => u.id === userId ? { ...u, isPremium: !currentStatus } : u))
        } catch (error) {
            console.error('Failed to toggle access:', error)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5">
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">User</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Joined</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Plan Status</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                        <tr key={user.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <span className="font-bold text-sm">{user.email || 'No email'}</span>
                                </div>
                            </td>
                            <td className="py-6">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </td>
                            <td className="py-6 text-center">
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    user.isPremium
                                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                        : "bg-white/5 text-muted-foreground border-white/10"
                                )}>
                                    {user.isPremium ? <Sparkles className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                    {user.isPremium ? 'Premium' : 'Basic'}
                                </div>
                            </td>
                            <td className="py-6 text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggle(user.id, user.isPremium)}
                                    disabled={loadingId === user.id}
                                    className={cn(
                                        "h-8 rounded-lg px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                                        user.isPremium
                                            ? "hover:bg-red-500/10 hover:text-red-500"
                                            : "hover:bg-orange-500/10 hover:text-orange-500"
                                    )}
                                >
                                    {loadingId === user.id ? 'Processing...' : (user.isPremium ? 'Revoke Access' : 'Grant Premium')}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
