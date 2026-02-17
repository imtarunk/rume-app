
'use client'

import { useState, useEffect } from 'react'
import { PricingPopup } from './pricing-popup'
import { useSearchParams, useRouter } from 'next/navigation'

interface PricingManagerProps {
    userId: string | undefined
    isPremium: boolean
}

export function PricingManager({ userId, isPremium }: PricingManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (!userId) return

        const isNew = searchParams.get('new') === 'true'
        const isUpgrade = searchParams.get('upgrade') === 'true'
        const hasShownThisSession = sessionStorage.getItem('pricing_popup_shown')

        if (isNew || isUpgrade || (!isPremium && !hasShownThisSession)) {
            setIsOpen(true)
            sessionStorage.setItem('pricing_popup_shown', 'true')

            if (isNew || isUpgrade) {
                // Clean up the URL after showing the popup
                const params = new URLSearchParams(searchParams.toString())
                params.delete('new')
                params.delete('upgrade')
                const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
                router.replace(newUrl)
            }
        }
    }, [searchParams, userId, router, isPremium])

    if (!userId) return null

    return (
        <PricingPopup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            userId={userId}
        />
    )
}
