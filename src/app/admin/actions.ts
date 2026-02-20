'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function loginAdmin(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const envEmail = process.env.ADMIN_EMAIL
    const envPassword = process.env.ADMIN_PASSWORD

    if (email === envEmail && password === envPassword) {
        const cookieStore = await cookies()
        // Simple session cookie - in a real production app we'd use a signed JWT
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        })
        return { success: true }
    }

    return { error: 'Invalid credentials' }
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    revalidatePath('/admin')
}

export async function verifyAdminSession() {
    const cookieStore = await cookies()
    return cookieStore.get('admin_session')?.value === 'true'
}

export async function getAllUsers() {
    const supabase = createAdminClient()

    // Fetch all users from auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
        console.error('Error fetching users:', authError)
        return []
    }

    // Fetch all premium access records
    const { data: premiumUsers, error: premiumError } = await supabase
        .from('premium_access')
        .select('user_id')

    if (premiumError) {
        console.error('Error fetching premium users:', premiumError)
        return []
    }

    const premiumUserIds = new Set(premiumUsers.map(p => p.user_id))

    return users.map(user => ({
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        isPremium: premiumUserIds.has(user.id)
    }))
}

export async function togglePremiumAccess(userId: string, shouldHaveAccess: boolean) {
    const supabase = createAdminClient()

    if (shouldHaveAccess) {
        const { error } = await supabase
            .from('premium_access')
            .upsert({ user_id: userId })

        if (error) throw error
    } else {
        const { error } = await supabase
            .from('premium_access')
            .delete()
            .eq('user_id', userId)

        if (error) throw error
    }

    revalidatePath('/admin')
    return { success: true }
}
