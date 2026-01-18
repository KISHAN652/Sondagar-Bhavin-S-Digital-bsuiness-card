import './globals.css'
import type { Metadata, Viewport } from 'next'

import InstallPWA from '@/components/InstallPWA'

export const viewport: Viewport = {
    themeColor: '#8b5cf6',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

export const metadata: Metadata = {
    title: 'Digital Business Card',
    description: 'Premium digital business card with NFC support',
    manifest: '/manifest.json',
    icons: {
        icon: '/icon-192x192.png',
        apple: '/icon-192x192.png',
        shortcut: '/icon-192x192.png',
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Digital Card',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
            </head>
            <body>
                {/* Animated Gradient Background */}
                <div className="gradient-background" />
                <div className="noise-overlay" />
                <div className="glass-blur" />

                {/* Main Content */}
                {children}

                {/* PWA Install Prompt */}
                <InstallPWA />
            </body>
        </html>
    )
}
