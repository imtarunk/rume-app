
import { LoginButton } from '@/components/features/auth/login-button'
import { ResumeUploader } from '@/components/features/uploader'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/features/auth/user-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TheInfiniteGrid } from '@/components/ui/the-infinite-grid'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function Home(props: { searchParams: Promise<{ new?: string }> }) {
  const { new: isNew } = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let resumeData = null
  if (user && isNew !== 'true') {
    const { data: resumes } = await supabase
      .from('resumes')
      .select('id, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (resumes && resumes.length > 0) {
      resumeData = resumes[0]
    }
  }

  const isPublished = (resumeData?.content as any)?.settings?.is_published || false;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-orange-500/30">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl transition-all">
        <Container>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg group-hover:scale-105 transition-all shadow-lg shadow-orange-500/20">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Rume</span>
            </Link>

            <nav className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-8">
                <Link href="#how-it-works" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">How it works</Link>
                <Link href="#templates" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Templates</Link>
              </div>
              <div className="flex items-center gap-4">
                {user ? (
                  <UserMenu user={user} resumeId={resumeData?.id} isPublished={isPublished} />
                ) : (
                  <LoginButton />
                )}
              </div>
            </nav>
          </div>
        </Container>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <TheInfiniteGrid className="min-h-screen flex items-center pt-20">
          <Container className="py-24">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">

              {resumeData ? (
                <div className="space-y-10 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase border border-orange-500/20 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Session Active
                  </div>
                  <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] drop-shadow-2xl">
                      Welcome back, <br />
                      <span className="text-orange-500">
                        {(resumeData.content as any)?.personalInfo?.fullName?.split(' ')[0] || 'User'}
                      </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
                      Your AI-powered portfolio is live. Reach out to new opportunities with your optimized profile.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                    <Button asChild size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl text-base font-black !bg-white !text-black hover:!bg-white/90 transition-all shadow-2xl active:scale-95 group border-none">
                      <Link href={`/preview/${resumeData.id}`} className="flex items-center justify-center gap-3">
                        Manage Portfolio <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl font-black !text-white !bg-white/10 border border-white/20 hover:!bg-white/20 transition-all active:scale-95">
                      <Link href="/?new=true" className="flex items-center justify-center">
                        Re-upload Resume
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase border border-orange-500/20">
                    <Zap className="w-3.5 h-3.5" />
                    Built for YC W26
                  </div>

                  <div className="space-y-8">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-foreground leading-[0.85] drop-shadow-2xl">
                      Resume <br />
                      To <span className="text-orange-500 italic">Impact.</span>
                    </h1>
                    <p className="text-xl md:text-3xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
                      Rume parses your experience using AI to build a world-class portfolio in seconds.
                    </p>
                  </div>

                  <div className="w-full max-w-xl mx-auto pt-4 relative">
                    <div className="absolute -inset-10 bg-orange-500/20 rounded-[80px] blur-[100px] opacity-20" />
                    <div className="relative">
                      <ResumeUploader />
                    </div>
                  </div>

                  <div className="pt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl mx-auto opacity-40 hover:opacity-100 transition-all duration-700 contrast-125">
                    {[
                      { icon: Zap, label: 'AI Powered', color: 'text-orange-500' },
                      { icon: Globe, label: 'Custom Domain', color: 'text-blue-500' },
                      { icon: Shield, label: 'Edge Secure', color: 'text-green-500' },
                      { icon: Sparkles, label: 'Premium Designs', color: 'text-purple-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 group cursor-default">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-lg">
                          <item.icon className={cn("w-7 h-7", item.color)} />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </TheInfiniteGrid>

        {/* Enhanced Feature Section */}
        {!resumeData && (
          <section id="how-it-works" className="py-40 bg-background relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <Container className="relative">
              <div className="max-w-3xl mx-auto text-center mb-24 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-orange-500">How it works</h2>
                <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Build your brand in three steps.</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Upload',
                    desc: 'Drop your PDF or DOCX. AI extracts every project and achievement.',
                    icon: Upload,
                    color: 'text-orange-500',
                    bg: 'bg-orange-500/10'
                  },
                  {
                    step: '02',
                    title: 'Personalize',
                    desc: 'Choose from designer templates optimized for conversion and clarity.',
                    icon: Shield,
                    color: 'text-blue-500',
                    bg: 'bg-blue-500/10'
                  },
                  {
                    step: '03',
                    title: 'Launch',
                    desc: 'Get a custom link. Connect a domain. Start landing interviews.',
                    icon: Globe,
                    color: 'text-green-500',
                    bg: 'bg-green-500/10'
                  }
                ].map((item, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute -inset-px rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-500">
                      <div className="flex flex-col h-full space-y-8">
                        <div className="flex items-center justify-between">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl transition-all duration-500 group-hover:scale-110", item.bg)}>
                            <item.icon className={cn("w-7 h-7", item.color)} />
                          </div>
                          <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500">{item.step}</span>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-2xl font-black text-foreground tracking-tight">{item.title}</h4>
                          <p className="text-muted-foreground leading-relaxed font-medium">
                            {item.desc}
                          </p>
                        </div>

                        <div className="pt-4 mt-auto">
                          <div className="w-10 h-px bg-white/10 group-hover:w-full transition-all duration-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>

      {/* Footer Removed for Minimal Aesthetic */}
    </div>
  )
}
