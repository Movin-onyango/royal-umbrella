'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Testimonial = {
  id: string
  client_name: string
  client_title: string
  quote: string
  rating: number
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [quote, setQuote] = useState('')

  useEffect(() => {
    async function loadTestimonials() {
      const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      if (data) setTestimonials(data)
      setLoading(false)
    }

    void loadTestimonials()
  }, [supabase])

  async function fetchTestimonials() {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data) setTestimonials(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('testimonials').insert({
      client_name: name,
      client_title: title,
      quote: quote,
      rating: 5
    })
    setName('')
    setTitle('')
    setQuote('')
    fetchTestimonials()
  }

  async function handleDelete(id: string) {
    if(!confirm('Delete this review?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  if (loading) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Manage Testimonials</h1>
      <p className="text-stone-500 mb-8">Add reviews that will appear on the About page.</p>
      
      <form onSubmit={handleAdd} className="bg-white p-6 border border-stone-200 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Client Name</label>
            <input type="text" placeholder="e.g., Angela" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Title / Role</label>
            <input type="text" placeholder="e.g., Airport Client · Kenya" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Review Quote</label>
          <textarea placeholder="The review text..." value={quote} onChange={e => setQuote(e.target.value)} required rows={3} className="w-full border p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"></textarea>
        </div>
        <button type="submit" className="bg-[#1B3B2F] text-white px-6 py-3 text-sm hover:bg-[#9C6B4E] transition">Add Testimonial</button>
      </form>

      <div className="bg-white border border-stone-200">
        {testimonials.map(t => (
          <div key={t.id} className="p-4 border-b border-stone-100 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-[#1B3B2F]">{t.client_name} <span className="text-xs text-stone-500 font-normal">({t.client_title})</span></p>
              <p className="text-sm text-stone-600 mt-1 italic">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-red-500 text-sm hover:underline shrink-0">Delete</button>
          </div>
        ))}
        {testimonials.length === 0 && <p className="p-6 text-stone-500 text-sm">No testimonials added yet.</p>}
      </div>
    </div>
  )
}