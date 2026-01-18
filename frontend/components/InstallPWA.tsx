'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)
            setShowButton(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowButton(false)
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)

        if (outcome === 'accepted') {
            setDeferredPrompt(null)
            setShowButton(false)
        }
    }

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 z-[100]"
                >
                    <button
                        onClick={handleInstallClick}
                        className="glass-button-primary bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3.25-3.25M12 12.75l3.25-3.25M12 12.75V3"
                            />
                        </svg>
                        Install App
                    </button>
                    {/* Close X */}
                    <button
                        onClick={() => setShowButton(false)}
                        className="absolute -top-2 -right-2 bg-white text-slate-500 rounded-full p-1 shadow-md hover:bg-slate-100 w-6 h-6 flex items-center justify-center text-xs"
                    >
                        ✕
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
