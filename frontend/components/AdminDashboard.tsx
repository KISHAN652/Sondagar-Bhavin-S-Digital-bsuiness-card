'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import api from '@/lib/api'

interface Card {
    id: string
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
    active: boolean
    connectEnabled: boolean
}

interface Analytics {
    totalVisits: number
    mobileVisits: number
    desktopVisits: number
    tabletVisits: number
}

interface AdminDashboardProps {
    onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const [cards, setCards] = useState<Card[]>([])
    const [selectedCard, setSelectedCard] = useState<Card | null>(null)
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'cards' | 'analytics'>('cards')
    const [uploading, setUploading] = useState(false)

    const handleCompanyLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedCard) return

        if (file.size > 200 * 1024) { // Smaller limit for logo ~200KB
            alert('Logo file too large! Please use an image smaller than 200KB.')
            return
        }

        try {
            setUploading(true)
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = async () => {
                const base64String = reader.result as string
                try {
                    const cardRef = doc(db, 'cards', selectedCard.id)
                    await updateDoc(cardRef, {
                        companyLogo: base64String,
                        updatedAt: new Date(),
                    })
                    const updatedCard = { ...selectedCard, companyLogo: base64String }
                    setSelectedCard(updatedCard)
                    setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c))
                    alert('Company logo updated successfully!')
                } catch (dbError) {
                    console.error('Error saving to DB:', dbError)
                    alert('Failed to save to database.')
                } finally {
                    setUploading(false)
                }
            }
        } catch (error) {
            console.error('Error handling file:', error)
            setUploading(false)
            alert('Error reading file')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedCard) return

        // 1. Check File Size (Firestore Limit is 1MB for the whole doc)
        if (file.size > 700 * 1024) { // Limit to ~700KB to be safe
            alert('File too large! Since we are saving to database directly, please use an image smaller than 700KB.')
            return
        }

        try {
            setUploading(true)

            // 2. Convert to Base64 (No Storage needed)
            const reader = new FileReader()
            reader.readAsDataURL(file)

            reader.onloadend = async () => {
                const base64String = reader.result as string

                // 3. Save directly to Firestore
                try {
                    const cardRef = doc(db, 'cards', selectedCard.id)
                    await updateDoc(cardRef, {
                        profileImage: base64String,
                        updatedAt: new Date(),
                    })

                    // 4. Update Local State
                    const updatedCard = { ...selectedCard, profileImage: base64String }
                    setSelectedCard(updatedCard)
                    setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c))

                    alert('Profile photo updated successfully!')
                } catch (dbError) {
                    console.error('Error saving to DB:', dbError)
                    alert('Failed to save to database.')
                } finally {
                    setUploading(false)
                }
            }

        } catch (error) {
            console.error('Error handling file:', error)
            setUploading(false)
            alert('Error reading file')
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    useEffect(() => {
        if (selectedCard && activeTab === 'analytics') {
            fetchAnalytics(selectedCard.id)
        }
    }, [selectedCard, activeTab])

    const fetchCards = async () => {
        try {
            setLoading(true)
            const cardsRef = collection(db, 'cards')
            const snapshot = await getDocs(cardsRef)
            const cardsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Card[]
            setCards(cardsData)
            if (cardsData.length > 0) {
                setSelectedCard(cardsData[0])
            }
        } catch (error) {
            console.error('Error fetching cards:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAnalytics = async (cardId: string) => {
        try {
            const response = await api.get(`/api/admin/analytics/${cardId}`)
            setAnalytics(response.data)
        } catch (error) {
            console.error('Error fetching analytics:', error)
        }
    }

    const handleUpdateCard = async () => {
        if (!selectedCard) return

        try {
            setSaving(true)
            const cardRef = doc(db, 'cards', selectedCard.id)
            await updateDoc(cardRef, {
                name: selectedCard.name,
                title: selectedCard.title,
                aboutMe: selectedCard.aboutMe || '',
                companyName: selectedCard.companyName || '',
                companyLogo: selectedCard.companyLogo || '',
                linkedin: selectedCard.linkedin || '',
                instagram: selectedCard.instagram || '',
                facebook: selectedCard.facebook || '',
                phone: selectedCard.phone,
                email: selectedCard.email,
                website: selectedCard.website,
                location: selectedCard.location || '',
                profileImage: selectedCard.profileImage,
                active: selectedCard.active,
                connectEnabled: selectedCard.connectEnabled,
                updatedAt: new Date(),
            })

            // Update local state
            setCards(
                cards.map((card) =>
                    card.id === selectedCard.id ? selectedCard : card
                )
            )

            alert('Card updated successfully!')
        } catch (error) {
            console.error('Error updating card:', error)
            alert('Failed to update card')
        } finally {
            setSaving(false)
        }
    }

    const handleToggleActive = async () => {
        if (!selectedCard) return

        const newActiveState = !selectedCard.active
        setSelectedCard({ ...selectedCard, active: newActiveState })

        try {
            const cardRef = doc(db, 'cards', selectedCard.id)
            await updateDoc(cardRef, {
                active: newActiveState,
                updatedAt: new Date(),
            })

            setCards(
                cards.map((card) =>
                    card.id === selectedCard.id
                        ? { ...card, active: newActiveState }
                        : card
                )
            )
        } catch (error) {
            console.error('Error toggling active state:', error)
            setSelectedCard({ ...selectedCard, active: !newActiveState })
        }
    }

    const handleToggleConnect = async () => {
        if (!selectedCard) return

        const newConnectState = !selectedCard.connectEnabled
        setSelectedCard({ ...selectedCard, connectEnabled: newConnectState })

        try {
            const cardRef = doc(db, 'cards', selectedCard.id)
            await updateDoc(cardRef, {
                connectEnabled: newConnectState,
                updatedAt: new Date(),
            })

            setCards(
                cards.map((card) =>
                    card.id === selectedCard.id
                        ? { ...card, connectEnabled: newConnectState }
                        : card
                )
            )
        } catch (error) {
            console.error('Error toggling connect state:', error)
            setSelectedCard({ ...selectedCard, connectEnabled: !newConnectState })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-6 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-500">
                            Manage your digital business cards
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="glass-button rounded-xl px-6 py-3 text-slate-700 font-semibold"
                    >
                        Logout
                    </motion.button>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cards List */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-3xl p-6"
                    >
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Your Cards</h2>
                        <div className="space-y-3">
                            {cards.map((card) => (
                                <motion.button
                                    key={card.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedCard(card)}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedCard?.id === card.id
                                        ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                                        : 'bg-white border-2 border-transparent hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                            {card.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-800 font-semibold">{card.name}</p>
                                            <p className="text-slate-500 text-sm">{card.title}</p>
                                        </div>
                                        <div
                                            className={`w-3 h-3 rounded-full ${card.active ? 'bg-green-500' : 'bg-red-500'
                                                }`}
                                        />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Card Editor / Analytics */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 glass-card rounded-3xl p-6"
                    >
                        {selectedCard ? (
                            <>
                                {/* Tabs */}
                                <div className="flex gap-4 mb-6 border-b border-slate-200">
                                    <button
                                        onClick={() => setActiveTab('cards')}
                                        className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'cards'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        Edit Card
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('analytics')}
                                        className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'analytics'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        Analytics
                                    </button>
                                </div>

                                {activeTab === 'cards' ? (
                                    <div className="space-y-6">
                                        {/* Toggle Controls */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="glass-card rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-700 font-medium">
                                                        Card Active
                                                    </span>
                                                    <button
                                                        onClick={handleToggleActive}
                                                        className={`relative w-14 h-8 rounded-full transition-colors ${selectedCard.active
                                                            ? 'bg-green-500'
                                                            : 'bg-slate-300'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${selectedCard.active
                                                                ? 'transform translate-x-6'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="glass-card rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-700 font-medium">
                                                        Connect Button
                                                    </span>
                                                    <button
                                                        onClick={handleToggleConnect}
                                                        className={`relative w-14 h-8 rounded-full transition-colors ${selectedCard.connectEnabled
                                                            ? 'bg-green-500'
                                                            : 'bg-slate-300'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${selectedCard.connectEnabled
                                                                ? 'transform translate-x-6'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.name}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.title}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            title: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            {/* About Me Input */}
                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    About Me
                                                </label>
                                                <textarea
                                                    value={selectedCard.aboutMe || ''}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            aboutMe: e.target.value,
                                                        })
                                                    }
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                                    placeholder="Brief introduction..."
                                                />
                                            </div>



                                            {/* Social Media Links */}
                                            <div className="space-y-3 pt-4 border-t border-slate-200">
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Social Media Links
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="url"
                                                        value={selectedCard.linkedin || ''}
                                                        onChange={(e) => setSelectedCard({ ...selectedCard, linkedin: e.target.value })}
                                                        placeholder="LinkedIn URL"
                                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={selectedCard.instagram || ''}
                                                        onChange={(e) => setSelectedCard({ ...selectedCard, instagram: e.target.value })}
                                                        placeholder="Instagram URL"
                                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                    />
                                                    <input
                                                        type="url"
                                                        value={selectedCard.facebook || ''}
                                                        onChange={(e) => setSelectedCard({ ...selectedCard, facebook: e.target.value })}
                                                        placeholder="Facebook URL"
                                                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                    />
                                                </div>
                                            </div>

                                            {/* Company Name Input */}
                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedCard.companyName || ''}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            companyName: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Micro System"
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            {/* Company Logo Upload */}
                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Company Logo
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    {selectedCard.companyLogo && (
                                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-300">
                                                            <img
                                                                src={selectedCard.companyLogo}
                                                                alt="Company Logo"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleCompanyLogoUpload}
                                                        disabled={uploading}
                                                        className="flex-1 block w-full text-sm text-slate-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded-full file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-purple-500/10 file:text-purple-600
                                                            hover:file:bg-purple-500/20
                                                            cursor-pointer"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={selectedCard.phone}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            phone: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={selectedCard.email}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            email: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    value={selectedCard.website}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            website: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Address / Location
                                                </label>
                                                <textarea
                                                    value={selectedCard.location || ''}
                                                    onChange={(e) =>
                                                        setSelectedCard({
                                                            ...selectedCard,
                                                            location: e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                                                    placeholder="123 Business Park, Tech City..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-700 font-medium mb-2">
                                                    Profile Image
                                                </label>
                                                <div className="flex gap-4 items-center">
                                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300">
                                                        {selectedCard.profileImage ? (
                                                            <img
                                                                src={selectedCard.profileImage}
                                                                alt="Profile"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            disabled={uploading}
                                                            className="w-full text-sm text-slate-500
                                                              file:mr-4 file:py-2 file:px-4
                                                              file:rounded-full file:border-0
                                                              file:text-sm file:font-semibold
                                                              file:bg-slate-100 file:text-slate-700
                                                              hover:file:bg-slate-200
                                                              cursor-pointer"
                                                        />
                                                        {uploading && (
                                                            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                                <div
                                                                    className="bg-purple-500 h-full transition-all duration-300"
                                                                    style={{ width: '100%' }} // You could add progress here
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Fallback & Debug URL Input */}
                                                <div className="mt-4 space-y-2">
                                                    <p className="text-slate-400 text-xs">Image URL (Debug):</p>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={selectedCard.profileImage || ''}
                                                            className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono outline-none"
                                                            onClick={(e) => (e.target as HTMLInputElement).select()}
                                                        />
                                                        {selectedCard.profileImage && (
                                                            <a
                                                                href={selectedCard.profileImage}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors text-xs flex items-center"
                                                            >
                                                                Test Link
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleUpdateCard}
                                            disabled={saving}
                                            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl py-4 px-6 font-semibold disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </motion.button>

                                        {/* Card URL */}
                                        <div className="glass-card rounded-xl p-4">
                                            <p className="text-slate-500 text-sm mb-2">Card URL:</p>
                                            <p className="text-slate-700 font-mono text-sm break-all">
                                                {`${process.env.NEXT_PUBLIC_APP_URL}/card/${selectedCard.id}`}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {analytics ? (
                                            <>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="glass-card rounded-xl p-4 text-center">
                                                        <p className="text-slate-500 text-sm mb-1">
                                                            Total Visits
                                                        </p>
                                                        <p className="text-3xl font-bold text-slate-900">
                                                            {analytics.totalVisits}
                                                        </p>
                                                    </div>
                                                    <div className="glass-card rounded-xl p-4 text-center">
                                                        <p className="text-slate-500 text-sm mb-1">
                                                            Mobile
                                                        </p>
                                                        <p className="text-3xl font-bold text-slate-900">
                                                            {analytics.mobileVisits}
                                                        </p>
                                                    </div>
                                                    <div className="glass-card rounded-xl p-4 text-center">
                                                        <p className="text-slate-500 text-sm mb-1">
                                                            Desktop
                                                        </p>
                                                        <p className="text-3xl font-bold text-slate-900">
                                                            {analytics.desktopVisits}
                                                        </p>
                                                    </div>
                                                    <div className="glass-card rounded-xl p-4 text-center">
                                                        <p className="text-slate-500 text-sm mb-1">
                                                            Tablet
                                                        </p>
                                                        <p className="text-3xl font-bold text-slate-900">
                                                            {analytics.tabletVisits}
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="spinner mx-auto mb-4" />
                                                <p className="text-slate-500">Loading analytics...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500">No card selected</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div >
    )
}
