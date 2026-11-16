'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Discount = {
  id: string
  name: string
  type: 'long_rental' | 'early_bird'
  min_days: number
  min_days_in_advance: number
  percentage: number
  is_active: boolean
}

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Form state
  const [name, setName] = useState('')
  const [type, setType] = useState<'long_rental' | 'early_bird'>('long_rental')
  const [value, setValue] = useState('') // Days or days in advance
  const [percentage, setPercentage] = useState('')

  useEffect(() => {
    let active = true

    supabase.from('discounts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (!active) return
      if (data) setDiscounts(data)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [supabase])

  async function fetchDiscounts() {
    const { data } = await supabase.from('discounts').select('*').order('created_at', { ascending: false })
    if (data) setDiscounts(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    
    const newDiscount = {
      name,
      type,
      percentage: Number(percentage),
      min_days: type === 'long_rental' ? Number(value) : 0,
      min_days_in_advance: type === 'early_bird' ? Number(value) : 0,
    }

    const { error } = await supabase.from('discounts').insert(newDiscount)
    
    if (error) alert(error.message)
    else {
      setName(''); setValue(''); setPercentage('')
      fetchDiscounts()
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    await supabase.from('discounts').update({ is_active: !currentStatus }).eq('id', id)
    fetchDiscounts()
  }

  async function handleDelete(id: string) {
    if(!confirm('Delete this discount rule?')) return
    await supabase.from('discounts').delete().eq('id', id)
    fetchDiscounts()
  }

  if (loading) return <div className="p-10 text-stone-500">Loading discounts...</div>

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="font-serif text-4xl text-[#1B3B2F] dark:text-white mb-2">Manage Discounts</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Create automated rules to incentivize longer rentals or early bookings.</p>
      
      <form onSubmit={handleAdd} className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 p-6 mb-8 space-y-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Rule Name</label>
            <input type="text" placeholder="e.g., Summer Special" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Discount Type</label>
            <select value={type} onChange={e => setType(e.target.value === 'early_bird' ? 'early_bird' : 'long_rental')} className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent dark:bg-[#1A1A1A]">
              <option value="long_rental">Long Rental (e.g., Weekly)</option>
              <option value="early_bird">Early Bird (Book in Advance)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">
              {type === 'long_rental' ? 'Minimum Days Rented' : 'Minimum Days Booked in Advance'}
            </label>
            <input type="number" placeholder="e.g., 7" value={value} onChange={e => setValue(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Discount Percentage (%)</label>
            <input type="number" max="100" min="1" placeholder="e.g., 10" value={percentage} onChange={e => setPercentage(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
        </div>

        <button type="submit" className="bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] px-6 py-3 text-sm hover:bg-[#9C6B4E] transition rounded font-medium">Add Rule</button>
      </form>

      <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg">
        {discounts.map(d => (
          <div key={d.id} className="p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 flex justify-between items-center">
            <div>
              <p className="font-medium text-[#1B3B2F] dark:text-white flex items-center gap-3">
                {d.name}
                <span className={`text-xs px-2 py-1 rounded-full ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {d.is_active ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                {d.type === 'long_rental' 
                  ? `Applies ${d.percentage}% off for rentals of ${d.min_days}+ days.` 
                  : `Applies ${d.percentage}% off for bookings made ${d.min_days_in_advance}+ days in advance.`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleActive(d.id, d.is_active)} className="text-xs text-stone-500 hover:text-[#1B3B2F] dark:hover:text-white underline">
                {d.is_active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => handleDelete(d.id)} className="text-red-500 text-sm hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}