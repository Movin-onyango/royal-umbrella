'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BookingForm({
  carId,
  pricePerDay,
}: {
  carId: string
  pricePerDay: number
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Get today's date in YYYY-MM-DD format to prevent past bookings
  const today = new Date().toISOString().split('T')[0]

  const days =
    start && end
      ? Math.max(
          0,
          Math.ceil(
            (new Date(end).getTime() - new Date(start).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const total = days * pricePerDay
  
  // Format to KSh
  const formattedTotal = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(total)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()

    // 1. Check for overlapping bookings (Double-booking prevention)
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .neq('status', 'cancelled')
      .lt('start_date', end)
      .gt('end_date', start)

    if (conflicts && conflicts.length > 0) {
      setMessage('This vehicle is already reserved for those dates. Please choose different dates.')
      setLoading(false)
      return
    }

    // 2. Insert the booking
    const { error } = await supabase.from('bookings').insert({
      car_id: carId,
      customer_name: name,
      customer_email: email,
      start_date: start,
      end_date: end,
      total_price: total,
      status: 'pending',
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Reservation received. Our concierge will contact you shortly to confirm.')
      setName('')
      setEmail('')
      setStart('')
      setEnd('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Pickup Date</label>
          <input
            type="date"
            value={start}
            min={today}
            onChange={(e) => setStart(e.target.value)}
            required
            className="w-full border border-stone-300 p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Return Date</label>
          <input
            type="date"
            value={end}
            min={start || today}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="w-full border border-stone-300 p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]"
          />
        </div>
      </div>
      
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. John Kamau"
          className="w-full border border-stone-300 p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]"
        />
      </div>
      
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="john@example.com"
          className="w-full border border-stone-300 p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]"
        />
      </div>

      {days > 0 && (
        <div className="border-t border-stone-200 pt-4 flex justify-between items-end">
          <span className="text-sm text-stone-500">
            {days} day{days > 1 ? 's' : ''} total
          </span>
          <span className="font-serif text-2xl text-[#1B3B2F]">{formattedTotal}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || days === 0}
        className="w-full bg-[#1B3B2F] text-white py-4 rounded-full text-sm hover:bg-[#C87A4A] transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing Request...' : 'Request Reservation'}
      </button>

      <p className="flex items-center justify-center gap-2 text-xs text-stone-500">
        <span className="rounded-sm bg-[#00A859] px-2 py-1 font-bold tracking-tight text-white">
          M-PESA
        </span>
        Pay securely via M-Pesa or card.
      </p>

      {message && (
        <div className={`p-4 text-sm text-center rounded-sm ${message.includes('Error') || message.includes('reserved') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}
    </form>
  )
}