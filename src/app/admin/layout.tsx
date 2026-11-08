'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      // If they are trying to access the login page, let them see it!
      if (pathname === '/admin/login') {
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/admin/login')
      } else {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [pathname, router, supabase])

  if (loading) {
    return <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center text-[#1B3B2F]">Loading Admin...</div>
  }

  // If on login page, show the form WITHOUT the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { name: 'Overview', href: '/admin' },
    { name: 'Manage Cars', href: '/admin/cars' },
    { name: 'Bookings', href: '/admin/bookings' },
    { name: 'Categories', href: '/admin/categories' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1B3B2F] text-[#F7F5F2] flex flex-col min-h-screen">
        <div className="p-6 border-b border-[#F7F5F2]/10">
          <Link href="/" className="font-serif text-2xl tracking-tight">Royal Umbrella</Link>
          <p className="text-[10px] uppercase tracking-widest text-[#9C6B4E] mt-1">Admin Console</p>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-3 text-sm rounded-sm transition ${
                pathname === item.href 
                  ? 'bg-[#9C6B4E] text-white' 
                  : 'text-[#F7F5F2]/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#F7F5F2]/10">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="w-full text-left px-4 py-2 text-sm text-[#F7F5F2]/70 hover:text-white transition"
          >
            ← Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}