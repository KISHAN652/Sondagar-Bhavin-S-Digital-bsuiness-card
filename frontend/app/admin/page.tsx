'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'
import AdminDashboard from '@/components/AdminDashboard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                await api.get('/api/admin/verify')
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Auth verification failed:', error)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                setIsAuthenticated(false)
            }
        }
        setLoading(false)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoggingIn(true)

        try {
            console.log('🔐 Starting login process...')

            // Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            console.log('✅ Firebase login successful')

            // Get ID token
            const idToken = await userCredential.user.getIdToken()

            console.log('🎫 Got Firebase ID token, calling backend...')

            // Authenticate with backend
            const response = await api.post('/api/auth/login', {
                idToken,
            })

            const { accessToken, refreshToken } = response.data

            console.log('✅ Backend token received')

            // Store tokens
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

            console.log('💾 Tokens saved to localStorage')

            // Set authenticated state
            setIsAuthenticated(true)

            console.log('✅ Login successful! Showing dashboard...')
        } catch (error: any) {
            console.error('❌ Login error:', error)

            if (error.code) {
                // Firebase error
                if (error.code === 'auth/invalid-credential') {
                    setError('Invalid email or password. Please check your credentials.')
                } else if (error.code === 'auth/user-not-found') {
                    setError('User not found. Please contact administrator.')
                } else if (error.code === 'auth/wrong-password') {
                    setError('Incorrect password. Please try again.')
                } else {
                    setError(`Firebase error: ${error.message}`)
                }
            } else if (error.response) {
                // Backend error
                console.error('Backend error response:', error.response.data)
                setError(error.response?.data?.message || 'Authentication failed')
            } else if (error.request) {
                // Network error
                console.error('Network error - no response from server')
                setError('Cannot connect to server. Please check if backend is running on port 5000.')
            } else {
                setError('Login failed. Please try again.')
            }
        } finally {
            setLoggingIn(false)
        }
    }

    const handleLogout = () => {
        console.log('🚪 Logging out...')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        auth.signOut()
        setIsAuthenticated(false)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-8 max-w-md w-full"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Admin Panel
                        </h1>
                        <p className="text-slate-500">
                            Sign in to manage your digital business cards
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="your-email@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loggingIn}
                            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl py-4 px-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                        >
                            {loggingIn ? 'Signing in...' : 'Sign In'}
                        </motion.button>
                    </form>

                    {/* Debug Info */}
                    <div className="mt-6 p-4 bg-slate-100 rounded-xl">
                        <p className="text-slate-500 text-xs text-center">
                            Check browser console (F12) for detailed logs
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    }

    return <AdminDashboard onLogout={handleLogout} />
}
