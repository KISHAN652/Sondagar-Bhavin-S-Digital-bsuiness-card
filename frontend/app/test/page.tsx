'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestPage() {
    const [backendStatus, setBackendStatus] = useState('Not tested')
    const [firebaseStatus, setFirebaseStatus] = useState('Not tested')
    const [backendUrl, setBackendUrl] = useState('')

    const testBackend = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            setBackendUrl(apiUrl)

            const response = await fetch(`${apiUrl}/health`)
            const data = await response.json()

            setBackendStatus(`✅ Connected! Status: ${data.status}`)
        } catch (error: any) {
            setBackendStatus(`❌ Failed: ${error.message}`)
        }
    }

    const testFirebase = async () => {
        try {
            const { auth } = await import('@/lib/firebase')
            setFirebaseStatus('✅ Firebase initialized successfully')
        } catch (error: any) {
            setFirebaseStatus(`❌ Failed: ${error.message}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 max-w-2xl w-full"
            >
                <h1 className="text-3xl font-bold text-white mb-6">
                    🔧 Connection Test
                </h1>

                <div className="space-y-6">
                    {/* Backend Test */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Backend API Test
                        </h2>
                        <p className="text-white/70 text-sm mb-4">
                            Testing connection to: {backendUrl || process.env.NEXT_PUBLIC_API_URL}
                        </p>
                        <button
                            onClick={testBackend}
                            className="glass-button rounded-xl px-6 py-3 text-white font-semibold mb-4"
                        >
                            Test Backend Connection
                        </button>
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-white font-mono text-sm">{backendStatus}</p>
                        </div>
                    </div>

                    {/* Firebase Test */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Firebase Test
                        </h2>
                        <button
                            onClick={testFirebase}
                            className="glass-button rounded-xl px-6 py-3 text-white font-semibold mb-4"
                        >
                            Test Firebase Connection
                        </button>
                        <div className="bg-black/30 rounded-xl p-4">
                            <p className="text-white font-mono text-sm">{firebaseStatus}</p>
                        </div>
                    </div>

                    {/* Environment Variables */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            Environment Variables
                        </h2>
                        <div className="bg-black/30 rounded-xl p-4 space-y-2">
                            <p className="text-white/70 text-sm">
                                <span className="font-bold">API URL:</span>{' '}
                                {process.env.NEXT_PUBLIC_API_URL || 'Not set'}
                            </p>
                            <p className="text-white/70 text-sm">
                                <span className="font-bold">App URL:</span>{' '}
                                {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}
                            </p>
                            <p className="text-white/70 text-sm">
                                <span className="font-bold">Firebase Project ID:</span>{' '}
                                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="glass-card rounded-2xl p-6 bg-blue-500/10">
                        <h3 className="text-lg font-bold text-white mb-3">
                            📝 Troubleshooting Steps:
                        </h3>
                        <ol className="text-white/80 text-sm space-y-2 list-decimal list-inside">
                            <li>Make sure backend is running: <code className="bg-black/30 px-2 py-1 rounded">npm run dev</code> in backend folder</li>
                            <li>Check if <code className="bg-black/30 px-2 py-1 rounded">frontend/.env.local</code> exists and has all values</li>
                            <li>Check if <code className="bg-black/30 px-2 py-1 rounded">backend/.env</code> exists and has Firebase credentials</li>
                            <li>Restart both servers after changing .env files</li>
                            <li>Check browser console for detailed errors</li>
                        </ol>
                    </div>

                    <div className="text-center">
                        <a
                            href="/admin"
                            className="text-purple-400 hover:text-purple-300 underline"
                        >
                            ← Back to Admin Login
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
