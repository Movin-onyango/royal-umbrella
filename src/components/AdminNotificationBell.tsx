'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Bell } from 'lucide-react'

type BookingNotification = {
  id: string
  customer_name: string | null
  booking_ref: string | null
  cars: { name: string | null } | { name: string | null }[] | null
}

export default function AdminNotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentBookings, setRecentBookings] = useState<BookingNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchLatest() {
      // Get bookings from the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data } = await supabase
        .from('bookings')
        .select('*, cars(name)')
        .gte('created_at', yesterday)
        .order('created_at', { ascending: false })

      if (data) {
        setRecentBookings(data as unknown as BookingNotification[])
        setUnreadCount(data.length)
      }
    }

    fetchLatest()

    // Set up real-time subscription for new bookings
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
        // New booking came in!
        setUnreadCount(prev => prev + 1)
        setRecentBookings(prev => [payload.new as unknown as BookingNotification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
        aria-label={`Recent bookings${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        className="relative p-2 text-stone-500 hover:text-[#1B3B2F] dark:text-stone-400 dark:hover:text-white transition"
      >
        <Bell className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-xl rounded-lg overflow-hidden z-50">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-[#111111]">
            <h3 className="font-medium text-[#1B3B2F] dark:text-white text-sm">Recent Bookings (24h)</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {recentBookings.length > 0 ? recentBookings.map((booking) => {
              const carName = Array.isArray(booking.cars) ? booking.cars[0]?.name : booking.cars?.name
              return (
              <Link href="/admin/bookings" key={booking.id} className="block p-4 border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-[#222222] transition">
                <p className="text-sm font-medium text-[#1B3B2F] dark:text-white">{booking.customer_name}</p>
                <p className="text-xs text-stone-500 mt-1">Booked <span className="font-medium">{carName}</span></p>
                <p className="text-xs text-[#9C6B4E] mt-1">Ref: {booking.booking_ref || 'N/A'}</p>
              </Link>
              )
            }) : (
              <p className="p-4 text-sm text-stone-500 text-center">No new bookings today.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}