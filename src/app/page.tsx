
import { LoginButton } from '@/components/features/auth/login-button'
import { ResumeUploader } from '@/components/features/uploader'
import { Container } from '@/components/ui/container'
import { Icons } from '@/components/ui/icons'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from '@/components/features/auth/user-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TheInfiniteGrid } from '@/components/ui/the-infinite-grid'
import { ArrowRight, Sparkles, Zap, Shield, Globe, Upload, Layout, Lock } from 'lucide-react'
import { Template1 } from '@/components/templates/template-1'
import { Template2 } from '@/components/templates/template-2'
import { Template3 } from '@/components/templates/template-3'
import { cn } from '@/lib/utils'
import { PricingManager } from '@/components/features/pricing-manager'
import { TemplateCard } from '@/components/features/template-card'

export default async function Home(props: { searchParams: Promise<{ new?: string }> }) {
  const { new: isNew } = await props.searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const { data: purchase } = await supabase
      .from('premium_access')
      .select('id')
      .eq('user_id', user.id)
      .single()
    isPremium = !!purchase
  }

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

  const MOCK_DATA = {
    personalInfo: {
      fullName: "Tarun Saini",
      email: "tarun@codextarun.xyz",
      phone: "+91 999999999",
      location: "Chandigarh, India",
      summary: "Full-stack developer with a passion for building high-quality, user-centric applications. Expert in React, Node.js, and modern web technologies.",
      title: "Product Engineer",
      linkedinUrl: "https://linkedin.com/in/tarun",
      portfolioUrl: "https://codextarun.xyz",
    },
    workExperience: [
      {
        company: "Rume AI",
        position: "Lead Engineer",
        startDate: "2024-01",
        endDate: "Present",
        description: ["Leading development of AI-powered portfolio solutions.", "Implementing high-performance server-side rendering."],
        skills: ["React", "Next.js", "TypeScript"]
      }
    ],
    education: [
      {
        school: "Tech Institute",
        degree: "B.Tech",
        fieldOfStudy: "Computer Science",
        startDate: "2018-07",
        endDate: "2022-06"
      }
    ],
    skills: [
      {
        category: "Tech Stack",
        items: ["React", "TypeScript", "Next.js", "AI/ML", "UI Design"]
      }
    ],
    projects: [
      {
        name: "Portfolio Builder",
        description: "Automated resume-to-portfolio conversion with AI.",
        technologies: ["Next.js", "Tailwind", "Gemini"],
        link: "https://rume.app"
      }
    ]
  }

  const isPublished = (resumeData?.content as any)?.settings?.is_published || false;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-orange-500/30">
      <PricingManager userId={user?.id} isPremium={isPremium} />
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
        {/* Enhanced Templates Section */}
        <section id="templates" className="py-40 bg-background relative overflow-hidden">
          {/* Background Decorative Blobs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />

          <Container className="relative">
            <div className="max-w-4xl mx-auto text-center mb-32 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                World-Class Designs
              </div>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
                Hand-crafted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Portfolio Blueprints.</span>
              </h3>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Choose from a curated collection of templates designed for maximum impact and conversion.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { name: 'Executive', desc: 'Minimalist, powerful, and ultra-professional.', color: 'from-slate-900 to-slate-800', isFree: true, id: 'template-1', tag: 'Classic' },
                { name: 'Creative', desc: 'Bold gradients and high-impact layouts.', color: 'from-orange-600/20 to-amber-600/20', isFree: false, id: 'template-2', tag: 'Bold' },
                { name: 'Bento', desc: 'Sophisticated grid-based design.', color: 'from-orange-600/20 to-amber-600/20', isFree: false, id: 'template-3', tag: 'Modern' }
              ].map((tmpl, i) => (
                <TemplateCard key={i} className="group relative flex flex-col h-full active:scale-95 transition-all">
                  <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                  <div className="relative flex-1 bg-white/[0.03] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl hover:border-white/20 transition-all duration-700 flex flex-col shadow-2xl">
                    <div className={cn("aspect-[4/5] bg-gradient-to-br transition-all duration-700 relative overflow-hidden", tmpl.color)}>
                      {/* Browser Mockup Frame */}
                      <div className="absolute inset-6 bottom-0 rounded-t-[1.5rem] border-x border-t border-white/20 bg-white/5 shadow-2xl overflow-hidden">
                        <div className="h-6 bg-white/10 border-b border-white/10 flex items-center px-3 gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        </div>
                        <div className="absolute inset-0 top-6 scale-[0.4] origin-top-left h-[250%] w-[250%] bg-white group-hover:scale-[0.42] transition-all duration-1000 pointer-events-none overflow-hidden">
                          <div className="text-black transform-gpu p-10">
                            {tmpl.id === 'template-1' && <Template1 data={MOCK_DATA as any} />}
                            {tmpl.id === 'template-2' && <Template2 data={MOCK_DATA as any} />}
                            {tmpl.id === 'template-3' && <Template3 data={MOCK_DATA as any} />}
                          </div>
                        </div>
                      </div>

                      {/* Premium Label Overlay */}
                      {!tmpl.isFree && (
                        <div className="absolute top-8 right-8 z-10">
                          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                            <Lock className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Premium</span>
                          </div>
                        </div>
                      )}

                      {/* Floating Tag */}
                      <div className="absolute top-8 left-8 z-10">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase text-white/70 tracking-widest">
                          {tmpl.tag}
                        </span>
                      </div>
                    </div>
                    <div className="p-10 space-y-6 mt-auto bg-gradient-to-b from-transparent to-black/20">
                      <div className="space-y-2">
                        <h4 className="text-3xl font-black text-foreground tracking-tighter leading-none">{tmpl.name}</h4>
                        <p className="text-muted-foreground font-medium line-clamp-2 text-sm leading-relaxed">
                          {tmpl.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border",
                          tmpl.isFree ? "text-green-500 bg-green-500/5 border-green-500/20" : "text-orange-500 bg-orange-500/5 border-orange-500/20"
                        )}>
                          {tmpl.isFree ? 'Free To Start' : 'Premium Design'}
                        </div>
                        <div className="text-white hover:text-orange-500 transition-colors">
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </TemplateCard>
              ))}
            </div>

            <div className="mt-32 text-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24 bg-orange-500/20 blur-[80px] opacity-30 rounded-full" />
              <Button asChild size="lg" className="relative h-20 px-16 rounded-[2rem] font-black !bg-orange-500 hover:!bg-orange-600 text-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.5)] active:scale-95 transition-all group border-none text-lg">
                <Link href={user && resumeData ? `/preview/${resumeData.id}` : "/"} className="flex items-center gap-4">
                  {user ? "Personalize Your Portfolio" : "Start Building Your Brand"}
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button>
              <p className="mt-8 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-40">No Credit Card Required • Join 1000+ Professionals</p>
            </div>
          </Container>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="space-y-4">
              <Link href="/" className="flex items-center justify-center md:justify-start gap-2.5 group opacity-80 hover:opacity-100 transition-all">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-base shadow-lg shadow-orange-500/10 transition-transform group-hover:scale-105">R</div>
                <span className="text-lg font-bold tracking-tight text-foreground">Rume</span>
              </Link>
              <p className="text-xs font-medium text-muted-foreground max-w-[240px] leading-relaxed">
                Elevating professional identities with AI-driven portfolios.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex flex-col items-center md:items-end gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Contact & Support</span>
                <a
                  href="mailto:tarunshr145@gmail.com"
                  className="text-sm font-bold text-foreground hover:text-orange-500 transition-all border-b border-transparent hover:border-orange-500/30 pb-1"
                >
                  tarunshr145@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">
                  © {new Date().getFullYear()} RUME AI. ALL RIGHTS RESERVED.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
