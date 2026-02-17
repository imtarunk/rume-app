
import { Container } from '@/components/ui/container'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsHeader } from './settings-header'
import { AccountSettings } from './account-settings'
import { UserPortfolioConfig } from './user-portfolio-config'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Fetch the most recent resume
    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

    const resume = resumes?.[0] || null

    // Fetch premium status
    const { data: premium } = await supabase
        .from('premium_access')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const hasFullAccess = !!premium

    return (
        <div className="min-h-screen bg-background pb-20">
            <SettingsHeader />

            <Container className="pt-32">
                <div className="max-w-4xl mx-auto space-y-12">
                    <header className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Global Settings</h1>
                        <p className="text-lg text-muted-foreground font-medium">Manage your account and portfolio configurations.</p>
                    </header>

                    <div className="grid gap-12">
                        {resume ? (
                            <UserPortfolioConfig
                                resume={resume}
                                hasFullAccess={hasFullAccess}
                            />
                        ) : (
                            <div className="p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-center space-y-4">
                                <p className="text-muted-foreground">You haven&apos;t created any resumes yet.</p>
                            </div>
                        )}

                        <AccountSettings user={user} hasFullAccess={hasFullAccess} />
                    </div>
                </div>
            </Container>
        </div>
    )
}
