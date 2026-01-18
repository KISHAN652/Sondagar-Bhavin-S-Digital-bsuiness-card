import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Digital Card Admin | Dashboard',
    description: 'Manage your premium digital business cards',
    manifest: '/manifest-admin.json',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
