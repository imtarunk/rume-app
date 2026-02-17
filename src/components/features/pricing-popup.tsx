
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Zap, Sparkles, Rocket, Shield, Star, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createRazorpayOrder } from '@/app/actions'

interface PricingPopupProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}

export function PricingPopup({ isOpen, onClose, userId }: PricingPopupProps) {
    const [isLoading, setIsLoading] = useState(false)

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handleUpgrade = async () => {
        setIsLoading(true)
        try {
            // We use a dummy resumeId or a generic "premium" identifier if needed, 
            // but for now, let's use a generic template/resume ID pattern if available.
            // Since this popup is shown on Home, we might not have a resumeId yet.
            // If the user just signed up, they haven't uploaded a resume.
            // Let's create a specialized action for "Whole App Upgrade" or use dummy IDs.
            // For now, I'll assume we can pass 'premium-plan' as templateId.
            const response = await createRazorpayOrder('template-2', 'global-upgrade')

            const options = {
                key: response.key,
                amount: response.amount,
                currency: "INR",
                name: "Rume AI",
                description: "Premium Portfolio Plan",
                order_id: response.orderId,
                handler: function (response: any) {
                    // This should hit a verify endpoint. 
                    // For now, let's assume the user is redirected or we refresh.
                    window.location.reload()
                },
                prefill: {
                    name: response.user.name,
                    email: response.user.email,
                },
                theme: {
                    color: "#F97316",
                },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Payment failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />

                        <div className="relative p-6 md:p-10 flex flex-col items-center">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="text-center space-y-3 mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles className="w-3 h-3" />
                                    Limited Time Launch Offer
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                                    Ready to <span className="text-orange-500">Go Pro?</span>
                                </h2>
                                <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
                                    Unlock all premium templates and custom domain features. <br />
                                    Stand out from the crowd today.
                                </p>
                            </div>

                            {/* Pricing Cards */}
                            <div className="grid md:grid-cols-2 gap-8 w-full">
                                {/* Basic Plan */}
                                <div className="relative group">
                                    <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-6 md:p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl h-full flex flex-col">
                                        <div className="space-y-6 mb-8">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <Zap className="w-5 h-5 text-white/40" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white">Starter</h3>
                                                <p className="text-sm text-muted-foreground font-medium">Perfect for exploring.</p>
                                            </div>
                                            <div className="text-3xl font-black text-white">$0 <span className="text-xs font-medium text-muted-foreground">/forever</span></div>
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            {[
                                                '1 Classic Template',
                                                'AI Resume Parsing',
                                                'Subdomain Deployment',
                                                'Standard Performance'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/50">
                                                    <Check className="w-4 h-4 text-white/20" />
                                                    {feature}
                                                </div>
                                            ))}
                                            {[
                                                'Premium Templates',
                                                'Custom Domains',
                                                'No Rume Branding'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/20 line-through">
                                                    <X className="w-4 h-4" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            onClick={onClose}
                                            className="mt-8 w-full h-12 rounded-xl font-black uppercase text-[9px] tracking-widest border border-white/5 hover:bg-white/5"
                                        >
                                            Continue with Free
                                        </Button>
                                    </div>
                                </div>

                                {/* Premium Plan */}
                                <div className="relative group">
                                    {/* Animated Glow */}
                                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse" />
                                    <div className="relative p-6 md:p-8 rounded-[2rem] bg-white/[0.05] border border-orange-500/50 backdrop-blur-2xl h-full flex flex-col shadow-2xl">
                                        <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-xl transform rotate-12 animate-bounce">
                                            90% OFF
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                                <Rocket className="w-5 h-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                                                    Premium
                                                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Early Bird</span>
                                                </h3>
                                                <p className="text-sm text-white/60 font-medium">One-time payment for life.</p>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <div className="text-4xl font-black text-white">₹99</div>
                                                <div className="text-lg font-bold text-white/30 line-through decoration-orange-500/50">₹999</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            {[
                                                'All Premium Templates',
                                                'Custom Domain Support',
                                                'Priority AI Processing',
                                                'No "Built with Rume" badge',
                                                'Early Access to New Features',
                                                'Lifetime Updates'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                                                    <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-3.5 h-3.5 text-orange-500" />
                                                    </div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            onClick={handleUpgrade}
                                            disabled={isLoading}
                                            className="mt-8 w-full h-12 rounded-xl font-black uppercase text-[9px] tracking-widest bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all group"
                                        >
                                            {isLoading ? "Processing..." : (
                                                <span className="flex items-center gap-2">
                                                    Claim Offer Now
                                                    <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                                <Gift className="w-3 h-3" />
                                Join 140+ people who upgraded this week
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
