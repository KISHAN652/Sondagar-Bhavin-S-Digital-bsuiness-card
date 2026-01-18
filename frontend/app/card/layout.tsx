import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Digital Business Card',
    description: 'Your professional digital business card',
    manifest: '/manifest-card.json',
}

export default function CardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
