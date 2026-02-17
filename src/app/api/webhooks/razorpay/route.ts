import { razorpay } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
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
        return new NextResponse('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === 'order.paid') {
        const order = event.payload.order.entity
        const { userId } = order.notes

        if (userId) {
            const supabase = await createClient()

            // Record the purchase for full access
            await supabase
                .from('premium_access')
                .upsert({
                    user_id: userId
                })
        }
    }

    return new NextResponse('Webhook Received', { status: 200 })
}
