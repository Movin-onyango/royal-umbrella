'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  customer_name: string
  customer_email: string
  start_date: string
  end_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  cars: { name: string } | null
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      const { data } = await supabase
        .from('bookings')
        .select('*, cars(name)')
        .order('created_at', { ascending: false })
      
      if (data) setBookings(data as unknown as Booking[])
      setLoading(false)
    }
    fetchBookings()
  }, [supabase])

  async function updateStatus(id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      // Refresh the list by updating local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
    }
  }

  if (loading) return <div className="p-10 text-stone-500">Loading bookings...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Bookings</h1>
        <p className="text-stone-500">Review and manage customer reservations.</p>
      </div>

      <div className="bg-white border border-stone-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-stone-50 text-stone-500 uppercase tracking-widest text-xs border-b border-stone-200">
            <tr>
              <th className="p-4 font-normal">Customer</th>
              <th className="p-4 font-normal">Vehicle</th>
              <th className="p-4 font-normal">Dates</th>
              <th className="p-4 font-normal">Total (KSh)</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-stone-50">
                <td className="p-4">
                  <p className="font-medium text-[#1B3B2F]">{booking.customer_name}</p>
                  <a href={`mailto:${booking.customer_email}`} className="text-xs text-[#9C6B4E] hover:underline">
                    {booking.customer_email}
                  </a>
                </td>
                <td className="p-4 text-stone-600 font-serif">{booking.cars?.name || 'Deleted Car'}</td>
                <td className="p-4 text-stone-600">
                  {new Date(booking.start_date).toLocaleDateString('en-GB')} <br/>
                  <span className="text-stone-400 text-xs">to</span> <br/>
                  {new Date(booking.end_date).toLocaleDateString('en-GB')}
                </td>
                <td className="p-4 font-medium">{Number(booking.total_price).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full border ${
                    booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                    booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value as 'pending' | 'confirmed' | 'cancelled')}
                    className="border border-stone-300 p-2 text-xs rounded bg-white focus:outline-none focus:border-[#1B3B2F]"
                  >
                    <option value="pending">Set Pending</option>
                    <option value="confirmed">Confirm Booking</option>
                    <option value="cancelled">Cancel Booking</option>
                  </select>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">No bookings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}