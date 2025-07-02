'use client'

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Home, Users, Package } from 'lucide-react'

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" />},
    { name: 'Usuarios', path: '/usuarios', icon: <Users className="w-5 h-5" />},
    { name: 'Productos', path: '/productos', icon: <Package className="w-5 h-5" />},
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-60 bg-zinc-800 text-white p-4 space-y-4 hidden md:block">
            <h2 className="text-xl font-bold mb-6">Admin</h2>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-2 rounded transition hover:bg-zinc-700 ${pathname === item.path ? 'bg-zinc-700' : ''}`}>{item.icon}{item.name}</Link>
                ))}
            </nav>
        </aside>
    )
}