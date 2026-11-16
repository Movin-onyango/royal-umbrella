'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createInstantBooking } from '@/app/actions/book'

export type Discount = {
  id: string
  name: string
  type: 'long_rental' | 'early_bird'
  min_days: number
  min_days_in_advance: number
  percentage: number
}

export default function BookingForm({
  carId,
  pricePerDay,
  discounts,
  initialStart,
  initialEnd,
}: {
  carId: string
  pricePerDay: number
  discounts: Discount[]
  initialStart?: string
  initialEnd?: string
}) {
  const [start, setStart] = useState(initialStart || '')
  const [end, setEnd] = useState(initialEnd || '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [successRef, setSuccessRef] = useState('')
  const lastPartialBooking = useRef<string | null>(null)
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  const safePricePerDay = Number(String(pricePerDay).replace(/,/g, '')) || 0

  const days =
    start && end
      ? Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)))
      : 0

  const baseTotal = days * safePricePerDay

  // Calculate Discounts
  let appliedDiscount = null
  let discountAmount = 0

  if (days > 0) {
    // 1. Check Long Rental Discounts (Find the best one)
    const longRentalDiscounts = discounts.filter(d => d.type === 'long_rental' && days >= d.min_days)
    if (longRentalDiscounts.length > 0) {
      // Sort by highest percentage to give the customer the best deal
      const bestDiscount = longRentalDiscounts.sort((a, b) => b.percentage - a.percentage)[0]
      appliedDiscount = bestDiscount
      discountAmount = (baseTotal * bestDiscount.percentage) / 100
    }

    // 2. Check Early Bird Discounts
    if (!appliedDiscount) {
      const daysInAdvance = Math.ceil((new Date(start).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      const earlyBirdDiscounts = discounts.filter(d => d.type === 'early_bird' && daysInAdvance >= d.min_days_in_advance)
      if (earlyBirdDiscounts.length > 0) {
        const bestDiscount = earlyBirdDiscounts.sort((a, b) => b.percentage - a.percentage)[0]
        appliedDiscount = bestDiscount
        discountAmount = (baseTotal * bestDiscount.percentage) / 100
      }
    }
  }

  const finalTotal = baseTotal - discountAmount

  const formattedTotal = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(finalTotal)

  async function handleEmailBlur() {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail.includes('@') || !start || !end || new Date(end) <= new Date(start)) return

    const partialKey = `${normalizedEmail}|${carId}|${start}|${end}`
    if (lastPartialBooking.current === partialKey) return

    const { error } = await supabase.from('partial_bookings').upsert({
      email: normalizedEmail,
      car_id: carId,
      start_date: start,
      end_date: end,
    }, {
      onConflict: 'email,car_id,start_date,end_date',
      ignoreDuplicates: true,
    })

    if (error) {
      setMessage('Your details could not be saved for later, but you can still submit your booking.')
      return
    }

    lastPartialBooking.current = partialKey
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await createInstantBooking({
      carId,
      customerName: name,
      customerEmail: email,
      start,
      end,
    })

    if (result.error) setMessage(result.error)
    else if (result.success) setSuccessRef(result.ref)
    setLoading(false)
  }

  if (successRef) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/20">
        <svg className="mx-auto mb-3 h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mb-2 font-serif text-2xl text-green-800 dark:text-green-400">Booking Confirmed</h3>
        <p className="mb-4 text-green-700 dark:text-green-300">Keep this reference for pickup:</p>
        <p className="rounded border border-green-200 bg-white py-3 font-mono text-3xl font-bold tracking-widest text-[#1B3B2F] dark:border-green-800 dark:bg-[#111111] dark:text-white">
          {successRef}
        </p>
        <p className="mt-4 text-xs text-green-700 dark:text-green-400">Our team will contact you to confirm the details.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Pickup Date</label>
          <input type="date" value={start} min={today} onChange={(e) => setStart(e.target.value)} required className="w-full border border-stone-300 dark:border-stone-700 dark:bg-transparent p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Return Date</label>
          <input type="date" value={end} min={start || today} onChange={(e) => setEnd(e.target.value)} required className="w-full border border-stone-300 dark:border-stone-700 dark:bg-transparent p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]" />
        </div>
      </div>

      {discounts.length > 0 && (
        <div className="mt-2 space-y-1 rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-500 dark:border-stone-800 dark:bg-[#111111] dark:text-stone-400">
          <p className="mb-1 font-medium text-stone-700 dark:text-stone-300">Ways to save on this vehicle</p>
          {discounts.map((discount) => (
            <p key={discount.id}>
              {discount.type === 'long_rental'
                ? `Rent for ${discount.min_days}+ days to get ${discount.percentage}% off.`
                : `Book at least ${discount.min_days_in_advance} days in advance for ${discount.percentage}% off.`}
            </p>
          ))}
        </div>
      )}
      
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. John Kamau" className="w-full border border-stone-300 dark:border-stone-700 dark:bg-transparent p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]" />
      </div>
      
      <div>
        <label className="text-xs uppercase tracking-wider text-stone-500">Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} required placeholder="john@example.com" className="w-full border border-stone-300 dark:border-stone-700 dark:bg-transparent p-3 mt-1 text-sm rounded-sm focus:outline-none focus:border-[#1B3B2F]" />
      </div>

      {/* Price Breakdown */}
      {days > 0 && (
        <div className="rounded-md bg-stone-50 p-4 space-y-2 dark:bg-[#111111]">
          <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
            <span>Base Rate ({days} days × KSh {safePricePerDay.toLocaleString()})</span>
            <span>KSh {baseTotal.toLocaleString()}</span>
          </div>
          
          {appliedDiscount && (
            <div className="-mx-2 flex justify-between rounded bg-[#9C6B4E]/10 p-2 text-sm font-medium text-[#9C6B4E]">
              <span>{appliedDiscount.name} ({appliedDiscount.percentage}% off)</span>
              <span>- KSh {discountAmount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-end border-t border-stone-200 pt-2 dark:border-stone-700">
            <span className="text-sm font-medium text-stone-700 dark:text-white">Total</span>
            <span className="font-serif text-3xl text-[#1B3B2F] dark:text-white">{formattedTotal}</span>
          </div>
        </div>
      )}

      <button type="submit" disabled={loading || days === 0} className="w-full bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] py-4 rounded-full text-sm hover:bg-[#9C6B4E] transition disabled:opacity-40 disabled:cursor-not-allowed font-medium">
        {loading ? 'Processing Request...' : 'Request Reservation'}
      </button>

      {message && (
        <div className={`p-4 text-sm text-center rounded-sm ${message.includes('Error') || message.includes('reserved') || message.includes('could not be saved') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}
    </form>
  )
}