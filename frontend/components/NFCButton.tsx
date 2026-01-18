'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { isNFCSupported, writeNFC } from '@/lib/utils'

interface NFCButtonProps {
    cardUrl: string
}

export default function NFCButton({ cardUrl }: NFCButtonProps) {
    const [isWriting, setIsWriting] = useState(false)
    const [message, setMessage] = useState('')

    const handleNFC = async () => {
        if (!isNFCSupported()) {
            setMessage('NFC not supported on this device')
            setTimeout(() => setMessage(''), 3000)
            return
        }

        try {
            setIsWriting(true)
            setMessage('Hold your device near an NFC tag...')

            await writeNFC(cardUrl)

            setMessage('✓ NFC tag written successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            console.error('NFC error:', error)
            setMessage('Failed to write NFC tag')
            setTimeout(() => setMessage(''), 3000)
        } finally {
            setIsWriting(false)
        }
    }

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNFC}
                disabled={isWriting}
                className="flex flex-col items-center gap-2 text-white disabled:opacity-50"
            >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    {isWriting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                            />
                        </svg>
                    )}
                </div>
                <span className="text-xs font-medium">NFC</span>
            </motion.button>

            {/* Message Tooltip */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap"
                >
                    {message}
                </motion.div>
            )}
        </div>
    )
}
