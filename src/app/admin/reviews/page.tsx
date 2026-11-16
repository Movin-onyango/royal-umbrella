'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Review = {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
  is_approved: boolean
  cars: { name: string } | null
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    let active = true

    supabase
      .from('car_reviews')
      .select('id, customer_name, rating, comment, created_at, is_approved, cars(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setErrorMessage('Could not load reviews. Please refresh and try again.')
        if (data) setReviews(data as unknown as Review[])
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [supabase])

  async function toggleApproval(review: Review) {
    setBusyId(review.id)
    setErrorMessage('')
    const isApproved = !review.is_approved
    const { error } = await supabase
      .from('car_reviews')
      .update({ is_approved: isApproved })
      .eq('id', review.id)

    if (error) {
      setErrorMessage('Could not update this review. Please try again.')
    } else {
      setReviews((current) => current.map((item) =>
        item.id === review.id ? { ...item, is_approved: isApproved } : item,
      ))
    }
    setBusyId(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return
    setBusyId(id)
    setErrorMessage('')
    const { error } = await supabase.from('car_reviews').delete().eq('id', id)

    if (error) {
      setErrorMessage('Could not delete this review. Please try again.')
    } else {
      setReviews((current) => current.filter((review) => review.id !== id))
    }
    setBusyId(null)
  }

  if (loading) return <div className="p-10 text-stone-500">Loading reviews...</div>

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="font-serif text-4xl text-[#1B3B2F] dark:text-white mb-2">Customer Reviews</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Approve reviews before they appear on vehicle pages.</p>
      {errorMessage && <p role="alert" className="mb-4 text-sm text-red-600">{errorMessage}</p>}

      <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg">
        {reviews.map((review) => {
          const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)))
          return (
            <article key={review.id} className="flex justify-between items-start gap-4 border-b border-stone-100 p-6 last:border-0 dark:border-stone-800">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <p className="font-medium text-[#1B3B2F] dark:text-white">{review.customer_name}</p>
                  <div className="flex text-[#9C6B4E] text-sm" aria-label={`${rating} out of 5 stars`}>
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'}`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                  <span className="text-xs text-stone-400">on {review.cars?.name || 'Unknown vehicle'}</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400">{review.comment}</p>
                <p className="text-xs text-stone-400 mt-2">{new Date(review.created_at).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row">
                <button type="button" onClick={() => toggleApproval(review)} disabled={busyId === review.id} className="text-sm text-[#1B3B2F] underline hover:text-[#9C6B4E] disabled:opacity-50 dark:text-[#E5C38A]">
                  {review.is_approved ? 'Unpublish' : 'Approve'}
                </button>
                <button type="button" onClick={() => handleDelete(review.id)} disabled={busyId === review.id} className="text-sm text-red-600 underline hover:text-red-800 disabled:opacity-50">
                  Delete
                </button>
              </div>
            </article>
          )
        })}
        {reviews.length === 0 && <p className="p-8 text-stone-500 text-sm text-center">No reviews yet.</p>}
      </div>
    </div>
  )
}