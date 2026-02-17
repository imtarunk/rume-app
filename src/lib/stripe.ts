import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-11-preview' as any,
    appInfo: {
        name: 'Rume',
        version: '0.1.0',
    },
})
