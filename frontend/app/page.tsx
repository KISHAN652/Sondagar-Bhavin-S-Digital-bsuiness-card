import { redirect } from 'next/navigation'

export default function Home() {
    // Redirect to admin panel or a default card
    redirect('/admin')
}
