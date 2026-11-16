'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInstantBooking(data: {
  carId: string
  customerName: string
  customerEmail: string
  start: string
  end: string
}) {
  const supabase = await createClient()

  const customerName = data.customerName.trim()
  const customerEmail = data.customerEmail.trim().toLowerCase()
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  const startTime = Date.parse(`${data.start}T00:00:00Z`)
  const endTime = Date.parse(`${data.end}T00:00:00Z`)

  if (!customerName || customerName.length > 120 || !customerEmail.includes('@')) {
    return { error: 'Enter a valid name and email address.' }
  }
  if (!datePattern.test(data.start) || !datePattern.test(data.end) || !Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    return { error: 'Choose valid pickup and return dates.' }
  }

  const today = new Date().toISOString().slice(0, 10)
  if (data.start < today) return { error: 'Pickup date cannot be in the past.' }

  const { data: car, error: carError } = await supabase
    .from('cars')
    .select('price_per_day, is_available')
    .eq('id', data.carId)
    .maybeSingle()

  if (carError || !car?.is_available) return { error: 'This vehicle is no longer available.' }

  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id')
    .eq('car_id', data.carId)
    .neq('status', 'cancelled')
    .lt('start_date', data.end)
    .gt('end_date', data.start)
    .limit(1)

  if (conflictError) return { error: 'Could not verify availability. Please try again.' }
  if (conflicts?.length) return { error: 'This vehicle is already reserved for those dates.' }

  const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24))
  const dailyRate = Number(String(car.price_per_day).replace(/,/g, ''))
  if (!Number.isFinite(dailyRate) || dailyRate <= 0) return { error: 'This vehicle has an invalid daily rate.' }

  const baseTotal = days * dailyRate
  const { data: discounts } = await supabase
    .from('discounts')
    .select('type, min_days, min_days_in_advance, percentage')
    .eq('is_active', true)

  const longRental = (discounts ?? [])
    .filter((discount) => discount.type === 'long_rental' && days >= discount.min_days)
    .sort((a, b) => b.percentage - a.percentage)[0]
  const daysInAdvance = Math.ceil((startTime - Date.now()) / (1000 * 60 * 60 * 24))
  const earlyBird = (discounts ?? [])
    .filter((discount) => discount.type === 'early_bird' && daysInAdvance >= discount.min_days_in_advance)
    .sort((a, b) => b.percentage - a.percentage)[0]
  const percentage = longRental?.percentage ?? earlyBird?.percentage ?? 0
  const totalPrice = Number((baseTotal * (1 - percentage / 100)).toFixed(2))

  const { data: { user } } = await supabase.auth.getUser()
  let bookingRef = ''

  for (let attempt = 0; attempt < 5; attempt++) {
    const randomValue = new Uint32Array(1)
    crypto.getRandomValues(randomValue)
    bookingRef = `RU-${10000 + (randomValue[0] % 90000)}`
    const { error } = await supabase.from('bookings').insert({
      car_id: data.carId,
      customer_name: customerName,
      customer_email: customerEmail,
      start_date: data.start,
      end_date: data.end,
      total_price: totalPrice,
      status: 'confirmed',
      booking_ref: bookingRef,
      user_id: user?.id ?? null,
    })

    if (!error) break
    if (error.code !== '23505') return { error: error.message }
    bookingRef = ''
  }

  if (!bookingRef) return { error: 'Could not generate a booking reference. Please try again.' }

  revalidatePath('/admin')
  revalidatePath('/admin/bookings')

  return { success: true, ref: bookingRef }
}