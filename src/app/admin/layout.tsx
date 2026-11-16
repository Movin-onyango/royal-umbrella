'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import AdminNotificationBell from '@/components/AdminNotificationBell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: string } | null>(null)
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
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        router.push('/admin/login')
      } else {
        setUserRole(profile.role)
        setUserProfile({
          name: profile.full_name || user.email?.split('@')[0] || 'Admin User',
          email: user.email || '',
          role: profile.role,
        })
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
    { name: 'Homepage', href: '/admin/homepage' },
    { name: 'Manage Cars', href: '/admin/cars' },
    { name: 'Discounts', href: '/admin/discounts' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Reviews', href: '/admin/reviews' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Bookings', href: '/admin/bookings' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Features', href: '/admin/features' },
    { name: 'Testimonials', href: '/admin/testimonials' },
    { name: 'Settings', href: '/admin/settings' },
    ...(userRole === 'super_admin' ? [{ name: 'Manage Admins', href: '/admin/admins' }] : []),
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

        <div className="mt-auto border-t border-[#F7F5F2]/10 p-4">
          <p className="px-3 pb-3 text-[10px] uppercase tracking-[0.2em] text-[#F7F5F2]/40">
            Profile
          </p>
          <div className="flex min-w-0 items-center gap-3 px-3 pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9C6B4E] text-sm font-medium text-white">
              {userProfile?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {userProfile?.name || 'Admin User'}
              </p>
              <p className="truncate text-xs text-[#F7F5F2]/55">
                {userProfile?.email}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#C9A58E]">
                {userProfile?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="w-full rounded-sm px-3 py-2 text-left text-sm text-[#F7F5F2]/70 transition hover:bg-white/10 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="mb-8 flex items-center justify-end">
          <AdminNotificationBell />
        </div>
        {children}
      </main>
    </div>
  )
}