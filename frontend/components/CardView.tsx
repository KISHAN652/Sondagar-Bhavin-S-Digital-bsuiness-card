'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    saveContactNative,
    isNFCSupported,
    writeNFC
} from '@/lib/utils'
import ShareModal from './ShareModal'
import QRModal from './QRModal'

interface CardData {
    name: string
    title: string
    phone: string
    email: string
    website: string
    location?: string
    profileImage: string
    companyName?: string
    companyLogo?: string
    aboutMe?: string
    linkedin?: string
    instagram?: string
    facebook?: string
    connectEnabled: boolean
}

interface CardViewProps {
    cardData: CardData
    cardId: string
}

export default function CardView({ cardData, cardId }: CardViewProps) {
    const [showShareModal, setShowShareModal] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false)
    const [nfcState, setNfcState] = useState<'idle' | 'writing' | 'success' | 'error'>('idle')
    const [nfcMessage, setNfcMessage] = useState('')

    const cardUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/card/${cardId}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/card/${cardId}`

    // Handle Connect Button
    const handleConnect = async () => {
        try {
            await saveContactNative({
                name: "Sondagar Bhavin.A", // Explicitly required by user
                title: cardData.title,
                phone: cardData.phone,
                email: cardData.email,
                website: cardData.website
            })
        } catch (error) {
            console.error('Error in connect handler:', error)
            // Fallback to dialer if something goes wrong
            window.location.href = `tel:${cardData.phone}`
        }
    }

    // Handle Save Card (Download PDF)
    const handleSaveCard = async () => {
        try {
            // Dynamic import to avoid SSR/Type issues
            const html2canvas = (await import('html2canvas')).default
            const jsPDF = (await import('jspdf')).default

            const element = document.getElementById('card-container')
            if (!element) return

            const canvas = await html2canvas(element, {
                backgroundColor: '#0a0a0a', // Dark background
                scale: 3, // High quality
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: element.offsetWidth,
                height: element.offsetHeight,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    const style = clonedDoc.createElement('style')
                    style.innerHTML = `
                        * { 
                            user-select: none !important; 
                            -webkit-user-select: none !important;
                        }
                        /* Fix 1: Text Gradient Issue (White Box) */
                        h1 {
                            background: none !important;
                            -webkit-text-fill-color: #ffffff !important;
                            color: #ffffff !important;
                            text-shadow: 0 4px 10px rgba(0,0,0,0.5); 
                        }
                        /* Fix 2: Blue Blob/Artifacts from Blur */
                        .bg-orbs {
                            display: none !important;
                        }
                    `
                    clonedDoc.head.appendChild(style)
                }
            })

            // Generate PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height] // Set PDF size to match high-res canvas (scaled by 3)
            })

            pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height)
            pdf.save(`${cardData.name.replace(/\s+/g, '_')}_BusinessCard.pdf`)

        } catch (error) {
            console.error('Error saving card:', error)
            alert('Failed to save card PDF. Please try again.')
        }
    }

    // Handle NFC
    const handleNFC = async () => {
        if (!isNFCSupported()) {
            setNfcMessage('NFC not supported')
            setTimeout(() => setNfcMessage(''), 3000)
            return
        }

        try {
            setNfcState('writing')
            setNfcMessage('Hold near an NFC tag...')

            await writeNFC(cardUrl)

            setNfcState('success')
            setNfcMessage('Written successfully!')
            setTimeout(() => {
                setNfcState('idle')
                setNfcMessage('')
            }, 3000)
        } catch (error) {
            console.error('NFC error:', error)
            setNfcState('error')
            setNfcMessage('Failed to write')
            setTimeout(() => {
                setNfcState('idle')
                setNfcMessage('')
            }, 3000)
        }
    }

    return (
        <>
            <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-[#f8fafc]">
                <main id="card-container" className="w-full h-full sm:h-auto max-w-[430px] sm:rounded-[40px] overflow-hidden relative glass-card">

                    {/* Background Gradients/Orbs */}
                    <div className="bg-orbs absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[50%] bg-purple-400/30 blur-[100px] animate-pulse-glow" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[40%] bg-blue-400/30 blur-[80px]" />
                    </div>

                    {/* Content Scroll Container */}
                    <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar pb-8">

                        {/* HERO SECTION */}
                        <div className="relative w-full aspect-[4/5] sm:aspect-square">
                            {/* Pulse Animation Behind Image */}
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20 animate-pulse-glow z-0" />

                            {cardData.profileImage ? (
                                <Image
                                    src={cardData.profileImage}
                                    alt={cardData.name}
                                    fill
                                    className="object-cover z-10 transition-transform duration-700 hover:scale-105"
                                    priority
                                    unoptimized // Bypass Next.js optimization to rule out config issues
                                />
                            ) : (
                                <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                    <span className="text-6xl font-bold text-slate-400">
                                        {cardData.name?.charAt(0) || '?'}
                                    </span>
                                </div>
                            )}

                            {/* Inner Glow / Border */}
                            <div className="absolute inset-0 ring-1 ring-black/5 z-20 pointer-events-none" />
                            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(255,255,255,0.3)] z-20 pointer-events-none" />

                            {/* Overlay Gradient for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent z-30" />

                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 pb-8 flex flex-col items-start gap-1 z-40">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 tracking-tight drop-shadow-sm"
                                >
                                    {cardData.name}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-base sm:text-lg text-blue-600 font-bold tracking-wide"
                                >
                                    {cardData.title}
                                </motion.p>

                                {/* Company Info Block */}
                                {(cardData.companyName || cardData.companyLogo) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-2 mt-1"
                                    >
                                        {cardData.companyLogo && (
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 bg-white">
                                                <Image
                                                    src={cardData.companyLogo}
                                                    alt="Company"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        {cardData.companyName && (
                                            <span className="text-slate-800 text-base font-semibold tracking-wide">
                                                {cardData.companyName}
                                            </span>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* ACTIONS SECTION */}
                        <div className="px-6 -mt-4 relative z-50 space-y-4">

                            {/* Primary Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConnect}
                                className="w-full glass-button-primary h-14 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-lg tracking-wide uppercase shadow-lg shadow-purple-500/20"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Connect
                            </motion.button>

                            {/* Secondary Buttons Row */}
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSaveCard}
                                    className="flex-1 glass-button-secondary h-12 rounded-xl flex items-center justify-center gap-2 text-slate-700 font-semibold text-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Save Card
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.open('https://microsystem.net.in/stabilizer/', '_blank')}
                                    className="flex-1 glass-button-secondary h-12 rounded-xl flex items-center justify-center gap-2 text-slate-700 font-semibold text-xs"
                                >
                                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    View Company Products
                                </motion.button>
                            </div>

                        </div>

                        {/* INFO & SOCIALS (Secondary Content) */}
                        <div className="px-6 mt-8 space-y-8">

                            {/* About Me Section */}
                            {cardData.aboutMe && (
                                <div className="glass-panel p-5 rounded-2xl space-y-3">
                                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        About Me
                                    </h3>
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {cardData.aboutMe}
                                    </p>
                                </div>
                            )}

                            {/* Contact Links */}
                            <div className="space-y-3">
                                <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl glass-panel group hover:bg-slate-50 transition-colors w-full overflow-hidden">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <span className="text-slate-700 font-medium text-sm sm:text-base break-all">{cardData.phone}</span>
                                </a>

                                <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl glass-panel group hover:bg-slate-50 transition-colors w-full overflow-hidden">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <span className="text-slate-700 font-medium text-[13px] sm:text-base break-all leading-tight">{cardData.email}</span>
                                </a>

                                <a
                                    href={cardData.website.startsWith('http') ? cardData.website : `https://${cardData.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-2xl glass-panel group hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                    </div>
                                    <span className="text-slate-700 font-medium truncate">{cardData.website.replace(/^https?:\/\//, '')}</span>
                                </a>

                                {/* Location */}
                                {cardData.location && (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cardData.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-2xl glass-panel group hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className="text-slate-700 font-medium whitespace-pre-line text-sm">{cardData.location}</span>
                                    </a>
                                )}
                            </div>

                            {/* Social Media Section */}
                            <div className="pt-6 border-t border-slate-200 space-y-4">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Follow Me</h3>
                                <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
                                    {/* LinkedIn */}
                                    {cardData.linkedin && (
                                        <a href={cardData.linkedin} target="_blank" rel="noopener noreferrer">
                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 rounded-2xl glass-button-secondary flex items-center justify-center text-slate-700 group">
                                                <span className="sr-only">LinkedIn</span>
                                                <svg className="w-5 h-5 group-hover:text-[#0077b5] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                            </motion.button>
                                        </a>
                                    )}

                                    {/* Instagram */}
                                    {cardData.instagram && (
                                        <a href={cardData.instagram} target="_blank" rel="noopener noreferrer">
                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 rounded-2xl glass-button-secondary flex items-center justify-center text-slate-700 group">
                                                <span className="sr-only">Instagram</span>
                                                <svg className="w-5 h-5 group-hover:text-[#E1306C] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                            </motion.button>
                                        </a>
                                    )}

                                    {/* Facebook */}
                                    {cardData.facebook && (
                                        <a href={cardData.facebook} target="_blank" rel="noopener noreferrer">
                                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 rounded-2xl glass-button-secondary flex items-center justify-center text-slate-700 group">
                                                <span className="sr-only">Facebook</span>
                                                <svg className="w-5 h-5 group-hover:text-[#1877F2] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.79-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                            </motion.button>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Card Utilities Section */}
                            <div className="pt-6 border-t border-slate-200 space-y-4">
                                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Card Options</h3>
                                <div className="flex justify-center gap-6">
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShowQRModal(true)} className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                                        <div className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                        </div>
                                        <span className="text-[10px] font-medium uppercase tracking-wide">QR Code</span>
                                    </motion.button>

                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                                        <div className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                        </div>
                                        <span className="text-[10px] font-medium uppercase tracking-wide">Share</span>
                                    </motion.button>

                                    {/* NFC Button */}
                                    <div className="relative">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleNFC}
                                            disabled={nfcState === 'writing'}
                                            className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
                                        >
                                            <div className="w-12 h-12 rounded-full glass-button-secondary flex items-center justify-center">
                                                {nfcState === 'writing' ? (
                                                    <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium uppercase tracking-wide">NFC</span>
                                        </motion.button>
                                        <AnimatePresence>
                                            {nfcMessage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                                                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                                                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                                                    className="absolute bottom-[110%] left-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-md whitespace-nowrap pointer-events-none z-50"
                                                >
                                                    {nfcMessage}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Logo/Branding */}
                        <div className="py-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                Digital Card
                                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            </p>
                        </div>
                    </div >
                </main >
            </div >

            {/* Modals */}
            < ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)
                }
                cardUrl={cardUrl}
                cardName={cardData.name}
            />

            <QRModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                cardUrl={cardUrl}
            />
        </>
    )
}
