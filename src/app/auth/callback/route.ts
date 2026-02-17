
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            let finalNext = next
            if (user) {
                const createdAt = new Date(user.created_at).getTime()
                const now = new Date().getTime()
                // If user was created in the last 30 seconds, it's a new signup
                if (now - createdAt < 30000) {
                    finalNext = next === '/' ? '/?new=true' : `${next}${next.includes('?') ? '&' : '?'}new=true`
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${request.nextUrl.origin}${finalNext}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${finalNext}`)
            } else {
                return NextResponse.redirect(`${request.nextUrl.origin}${finalNext}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/auth-code-error`)
}
