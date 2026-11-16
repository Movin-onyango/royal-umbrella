'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ReviewForm({ carId }: { carId: string }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    
    const { error } = await supabase.from('car_reviews').insert({
      car_id: carId,
      customer_name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
    })

    if (!error) {
      setSuccess(true)
      setName(''); setComment('')
      setTimeout(() => setSuccess(false), 5000)
    } else {
      setErrorMessage('Your review could not be submitted. Please try again.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-stone-50 dark:bg-[#111111] p-6 rounded-lg mt-6 border border-stone-200 dark:border-stone-800">
      <h3 className="font-serif text-lg text-[#1B3B2F] dark:text-white mb-4">Leave a Review</h3>
      {success && <p className="text-green-600 text-sm mb-4">Thank you. Your review was submitted and will appear after moderation.</p>}
      {errorMessage && <p role="alert" className="text-red-600 text-sm mb-4">{errorMessage}</p>}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} className="border p-2 text-sm rounded bg-transparent dark:border-stone-700" />
        <select value={rating} onChange={e => setRating(e.target.value)} className="border p-2 text-sm rounded bg-transparent dark:border-stone-700 dark:bg-[#111111]">
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <textarea placeholder="How was your experience with this car?" required value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full border p-2 text-sm rounded mb-4 bg-transparent dark:border-stone-700"></textarea>
      <button type="submit" disabled={loading} className="bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-black px-6 py-2 text-sm rounded transition disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}