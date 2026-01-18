'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'

interface QRModalProps {
    isOpen: boolean
    onClose: () => void
    cardUrl: string
}

export default function QRModal({ isOpen, onClose, cardUrl }: QRModalProps) {
    const [qrDataUrl, setQrDataUrl] = useState('')

    useEffect(() => {
        if (isOpen) {
            generateQR()
        }
    }, [isOpen, cardUrl])

    const generateQR = async () => {
        try {
            const dataUrl = await QRCode.toDataURL(cardUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            })
            setQrDataUrl(dataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    const downloadQR = () => {
        const link = document.createElement('a')
        link.href = qrDataUrl
        link.download = 'business-card-qr.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
                        className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card rounded-3xl p-8 max-w-sm w-full space-y-6"
                        >
                            {/* Title */}
                            <h3 className="text-2xl font-bold text-slate-900 text-center">
                                QR Code
                            </h3>

                            {/* QR Code */}
                            {qrDataUrl && (
                                <div className="bg-white rounded-2xl p-6 flex items-center justify-center border border-slate-200">
                                    <img
                                        src={qrDataUrl}
                                        alt="QR Code"
                                        className="w-full max-w-[250px]"
                                    />
                                </div>
                            )}

                            {/* Instructions & Link */}
                            <div className="space-y-2">
                                <p className="text-slate-500 text-sm text-center">
                                    Scan this QR code or use the link below:
                                </p>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 break-all text-xs font-mono text-slate-600 text-center select-all">
                                    {cardUrl}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={downloadQR}
                                    className="w-full glass-button-primary rounded-2xl py-4 px-6 text-white font-semibold flex items-center justify-center gap-3"
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Download QR Code
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="w-full glass-button-secondary rounded-2xl py-4 px-6 text-slate-700 font-semibold"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
