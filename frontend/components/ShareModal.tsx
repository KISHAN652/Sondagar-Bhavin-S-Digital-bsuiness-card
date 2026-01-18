'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { shareViaWhatsApp, isShareAPISupported, shareCard } from '@/lib/utils'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    cardUrl: string
    cardName: string
}

export default function ShareModal({
    isOpen,
    onClose,
    cardUrl,
    cardName,
}: ShareModalProps) {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')

    const handleWhatsAppShare = () => {
        if (!phoneNumber) {
            setError('Please enter a phone number')
            return
        }

        // Remove all non-numeric characters
        const cleanNumber = phoneNumber.replace(/\D/g, '')

        if (cleanNumber.length < 10) {
            setError('Please enter a valid phone number')
            return
        }

        const message = `Check out ${cardName}'s digital business card: \n\n${cardUrl}`
        shareViaWhatsApp(cleanNumber, message)
        onClose()
        setPhoneNumber('')
        setError('')
    }

    const handleNativeShare = async () => {
        if (isShareAPISupported()) {
            try {
                await shareCard(cardUrl, cardName)
                onClose()
            } catch (error) {
                console.error('Error sharing:', error)
            }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50"
                    >
                        <div className="bottom-sheet p-6 space-y-6 max-w-md mx-auto">
                            {/* Handle */}
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 text-center">
                                Share Card
                            </h3>

                            {/* Native Share (if supported) */}
                            {isShareAPISupported() && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleNativeShare}
                                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-3"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                        />
                                    </svg>
                                    Share via...
                                </motion.button>
                            )}

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">
                                        or share via WhatsApp
                                    </span>
                                </div>
                            </div>

                            {/* WhatsApp Share */}
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            setPhoneNumber(e.target.value)
                                            setError('')
                                        }}
                                        placeholder="+1 234 567 8900"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-600">{error}</p>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleWhatsAppShare}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-3 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    Send via WhatsApp
                                </motion.button>
                            </div>

                            {/* Cancel Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl py-4 px-6 font-semibold transition-colors"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
