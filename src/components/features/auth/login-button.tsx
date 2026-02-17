
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons' // Need to create icons
import { useState } from 'react'

export function LoginButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <Button
            variant="ghost"
            type="button"
            disabled={isLoading}
            onClick={handleLogin}
            className="h-11 px-6 rounded-xl font-bold text-foreground bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all transition-all active:scale-95"
        >
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icons.google className="mr-2 h-4 w-4" />
            )}
            Sign in
        </Button>
    )
}
