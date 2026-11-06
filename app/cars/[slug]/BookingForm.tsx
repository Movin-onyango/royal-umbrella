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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const supabase = createClient()

    // Check for overlapping bookings
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
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage('Reservation received. We will confirm within 24 hours.')
      setName('')
      setEmail('')
      setStart('')
      setEnd('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Pickup</label>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          className="w-full border border-stone-300 p-3 mt-1 text-sm"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Return</label>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          min={start}
          className="w-full border border-stone-300 p-3 mt-1 text-sm"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-stone-300 p-3 mt-1 text-sm"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-stone-300 p-3 mt-1 text-sm"
        />
      </div>

      {days > 0 && (
        <div className="border-t border-stone-200 pt-4 flex justify-between">
          <span className="text-sm text-stone-500">
            {days} day{days > 1 ? 's' : ''}
          </span>
          <span className="font-serif text-2xl text-[#1B3B2F]">${total}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || days === 0}
        className="w-full bg-[#1B3B2F] text-white py-4 rounded-full hover:bg-[#9C6B4E] transition disabled:opacity-40"
      >
        {loading ? 'Reserving...' : 'Reserve This Vehicle'}
      </button>

      {message && (
        <p className="text-sm text-center text-stone-600">{message}</p>
      )}
    </form>
  )
}