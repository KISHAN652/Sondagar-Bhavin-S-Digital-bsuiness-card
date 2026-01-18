'use client'

import { motion } from 'framer-motion'

export default function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
            >
                <div className="spinner mx-auto" />
                <p className="text-white/70 font-medium">Loading...</p>
            </motion.div>
        </div>
    )
}
