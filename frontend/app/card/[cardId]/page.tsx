'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import api from '@/lib/api'
import { getDeviceType } from '@/lib/utils'
import CardView from '@/components/CardView'
import LoadingSpinner from '@/components/LoadingSpinner'

interface CardData {
    name: string
    title: string
    phone: string
    email: string
    website: string
    profileImage: string
    active: boolean
    connectEnabled: boolean
}

export default function CardPage() {
    const params = useParams()
    const cardId = params.cardId as string

    const [cardData, setCardData] = useState<CardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCard = async () => {
            try {
                setLoading(true)

                // Fetch card data from Firestore
                const cardRef = doc(db, 'cards', cardId)
                const cardSnap = await getDoc(cardRef)

                if (!cardSnap.exists()) {
                    setError('Card not found')
                    return
                }

                const data = cardSnap.data() as CardData

                // Check if card is active
                if (!data.active) {
                    setError('This card is currently inactive')
                    return
                }

                setCardData(data)

                // Track analytics
                await trackVisit()
            } catch (err) {
                console.error('Error fetching card:', err)
                setError('Failed to load card')
            } finally {
                setLoading(false)
            }
        }

        const trackVisit = async () => {
            try {
                const device = getDeviceType()
                await api.post('/api/analytics', {
                    cardId,
                    device,
                    timestamp: new Date().toISOString(),
                })
            } catch (err) {
                console.error('Error tracking analytics:', err)
            }
        }

        if (cardId) {
            fetchCard()
        }
    }, [cardId])

    if (loading) {
        return <LoadingSpinner />
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-3xl p-8 max-w-md w-full text-center"
                >
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {error || 'Card Not Found'}
                    </h2>
                    <p className="text-white/70">
                        This digital business card is not available.
                    </p>
                </motion.div>
            </div>
        )
    }

    return <CardView cardData={cardData} cardId={cardId} />
}
