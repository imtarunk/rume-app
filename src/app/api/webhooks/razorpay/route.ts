import { razorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') as string
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')

    if (expectedSignature !== signature) {
        console.error('Invalid Razorpay signature. Expected:', expectedSignature, 'Received:', signature)
        return new NextResponse('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === 'order.paid') {
        const order = event.payload.order.entity
        const { userId } = order.notes

        console.log('Processing payment for user:', userId)

        if (userId) {
            const { createAdminClient } = await import('@/lib/supabase/admin')
            const supabase = createAdminClient()

            // Record the purchase for full access
            const { error } = await supabase
                .from('premium_access')
                .upsert({
                    user_id: userId
                })

            if (error) {
                console.error('Error updating premium access:', error)
                return new NextResponse('Database Error', { status: 500 })
            }

            console.log('Successfully unlocked premium for user:', userId)
        }
    }

    return new NextResponse('Webhook Received', { status: 200 })
}
