import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { TheInfiniteGrid } from '@/components/ui/the-infinite-grid'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
            <header className="h-20 flex items-center px-6 border-b border-white/5 relative z-50">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-base group-hover:scale-105 transition-all shadow-lg shadow-orange-500/20">
                        R
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">Rume</span>
                </Link>
            </header>

            <main className="flex-1 relative">
                <TheInfiniteGrid className="h-full flex items-center justify-center">
                    <Container>
                        <div className="max-w-2xl mx-auto text-center space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="space-y-4">
                                <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    404
                                </h1>
                                <div className="relative pt-24">
                                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl mx-auto flex items-center justify-center border border-orange-500/20 mb-8 blur-sm animate-pulse" />
                                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl mx-auto flex items-center justify-center border border-orange-500/20 mb-8 absolute top-24 left-1/2 -translate-x-1/2">
                                        <span className="text-4xl font-black text-orange-500">?</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">Lost in the grid?</h2>
                                    <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
                                        The page you are looking for doesn&apos;t exist or has been moved to another dimension.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/10 active:scale-95 transition-all w-full sm:w-auto">
                                    <Link href="/" className="flex items-center gap-2">
                                        <Home className="w-4 h-4" />
                                        Back to Reality
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="h-14 px-8 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all w-full sm:w-auto">
                                    <Link href="javascript:history.back()" className="flex items-center gap-2">
                                        <ChevronLeft className="w-4 h-4" />
                                        Go Back
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Container>
                </TheInfiniteGrid>

                {/* Decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            </main>
        </div>
    )
}
