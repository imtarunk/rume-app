
import { POST } from '@/app/api/webhooks/razorpay/route'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Mock dependencies
jest.mock('@/lib/supabase/server')
jest.mock('@/lib/razorpay', () => ({
    razorpay: {
        orders: {
            create: jest.fn()
        }
    }
}))

const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
}

    ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)

describe('Razorpay Webhook & Integration', () => {
    const webhookSecret = 'test_secret'
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret

    beforeEach(() => {
        jest.clearAllMocks()
    })

    const createWebhookRequest = (payload: any) => {
        const body = JSON.stringify(payload)
        const signature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex')

        return new Request('http://localhost:3000/api/webhooks/razorpay', {
            method: 'POST',
            headers: {
                'x-razorpay-signature': signature,
                'Content-Type': 'application/json',
            },
            body,
        })
    }

    it('should successfully unlock premium templates on order.paid', async () => {
        const payload = {
            event: 'order.paid',
            payload: {
                order: {
                    entity: {
                        notes: {
                            userId: 'user-123'
                        }
                    }
                }
            }
        }

        const req = createWebhookRequest(payload)
        const response = await POST(req)

        expect(response.status).toBe(200)
        expect(mockSupabase.from).toHaveBeenCalledWith('premium_access')
        expect(mockSupabase.upsert).toHaveBeenCalledWith({ user_id: 'user-123' })
    })

    it('should reject requests with invalid signature', async () => {
        const payload = { event: 'order.paid' }
        const req = new Request('http://localhost:3000/api/webhooks/razorpay', {
            method: 'POST',
            headers: {
                'x-razorpay-signature': 'invalid_sig',
            },
            body: JSON.stringify(payload),
        })

        const response = await POST(req)
        expect(response.status).toBe(400)
        const text = await response.text()
        expect(text).toBe('Invalid signature')
    })

    it('should ignore other events', async () => {
        const payload = { event: 'payment.captured' }
        const req = createWebhookRequest(payload)
        const response = await POST(req)

        expect(response.status).toBe(200)
        expect(mockSupabase.upsert).not.toHaveBeenCalled()
    })

    it('should prevent duplicate purchase logic via database constraint (mock check)', async () => {
        // The database schema enforces uniqueness, but we verify the webhook handles the call correctly
        const payload = {
            event: 'order.paid',
            payload: { order: { entity: { notes: { userId: 'user-123' } } } }
        }

        const req = createWebhookRequest(payload)
        await POST(req)

        // Ensure it's using upsert which is the safe way to handle potential duplicates in a webhook
        expect(mockSupabase.upsert).toHaveBeenCalled()
    })
})
