
'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function SettingsHeader() {
    const router = useRouter()

    return (
        <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
            <Container>
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                            className="rounded-xl hover:bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-base group-hover:scale-105 transition-all shadow-lg shadow-orange-500/20">
                                R
                            </div>
                            <span className="text-lg font-bold tracking-tight text-foreground">Rume</span>
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    )
}
