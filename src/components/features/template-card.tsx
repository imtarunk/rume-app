
'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TemplateCardProps {
    children: ReactNode
    className?: string
    id?: string
}

export function TemplateCard({ children, className, id }: TemplateCardProps) {
    const router = useRouter()

    const handleClick = (e: React.MouseEvent) => {
        // Prevent navigation if the user clicked something interactive inside (just in case)
        const target = e.target as HTMLElement
        if (target.closest('button') || target.closest('a')) {
            return
        }

        router.push('/?upgrade=true', { scroll: false })
    }

    return (
        <div
            onClick={handleClick}
            className={cn("cursor-pointer", className)}
        >
            {children}
        </div>
    )
}
