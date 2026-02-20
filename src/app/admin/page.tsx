
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { getAllUsers, verifyAdminSession } from '@/app/admin/actions'
import { PremiumUserTable } from '@/app/admin/premium-user-table'
import { ShieldAlert, Users, Sparkles } from 'lucide-react'

export default async function AdminPage() {
    const isAdmin = await verifyAdminSession()

    if (!isAdmin) {
        redirect('/admin/login')
    }

    const users = await getAllUsers()

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <Container>
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">
                                A
                            </div>
                            <div className="flex items-center gap-6">
                                <div>
                                    <h1 className="text-lg font-black tracking-tight">Admin Terminal</h1>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">System Control</p>
                                </div>
                                <form action={async () => {
                                    'use server'
                                    const { logoutAdmin } = await import('@/app/admin/actions')
                                    await logoutAdmin()
                                }}>
                                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-all">
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </header>

            <main className="pt-32 pb-20">
                <Container>
                    <div className="max-w-6xl mx-auto space-y-12">
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Premium Users', value: users.filter(u => u.isPremium).length, icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                { label: 'System Status', value: 'Active', icon: ShieldAlert, color: 'text-green-500', bg: 'bg-green-500/10' },
                            ].map((stat, i) => (
                                <div key={i} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-4">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                                        <p className="text-3xl font-black">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Users Table */}
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black tracking-tight">User Management</h2>
                                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Live Pulse
                                    </div>
                                </div>

                                <PremiumUserTable initialUsers={users} />
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}
