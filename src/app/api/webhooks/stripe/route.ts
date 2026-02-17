import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any
        const userId = session.metadata.userId

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
