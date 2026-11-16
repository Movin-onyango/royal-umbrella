'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Feature = {
  id: string
  title: string
  description: string
  icon: string
}

export default function AdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('shield') // Default icon

  const fetchFeatures = useCallback(async () => {
    const { data } = await supabase.from('features').select('*').order('display_order')
    if (data) setFeatures(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    let active = true

    supabase.from('features').select('*').order('display_order').then(({ data }) => {
      if (!active) return
      if (data) setFeatures(data)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [supabase])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const nextOrder = features.length + 1
    await supabase.from('features').insert({ title, description, icon, display_order: nextOrder })
    setTitle('')
    setDescription('')
    fetchFeatures()
  }

  async function handleDelete(id: string) {
    if(!confirm('Delete this feature?')) return
    await supabase.from('features').delete().eq('id', id)
    fetchFeatures()
  }

  if (loading) return <div className="p-10 text-stone-500">Loading features...</div>

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl text-[#1B3B2F] dark:text-white mb-2">Manage Features</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">These appear in the &quot;What Makes Us Different&quot; section.</p>
      
      <form onSubmit={handleAdd} className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 p-6 mb-8 space-y-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Feature Title</label>
            <input type="text" placeholder="e.g., 24/7 Support" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Icon Keyword (e.g., shield, star, key, gps)</label>
            <input type="text" placeholder="e.g., shield" value={icon} onChange={e => setIcon(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Short Description</label>
          <textarea placeholder="e.g., Round-the-clock assistance for every trip." value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent"></textarea>
        </div>
        <button type="submit" className="bg-[#1B3B2F] text-white px-6 py-3 text-sm hover:bg-[#9C6B4E] transition">Add Feature</button>
      </form>

      <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg">
        {features.map(f => (
          <div key={f.id} className="p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-[#1B3B2F] dark:text-white">{f.title}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{f.description}</p>
            </div>
            <button onClick={() => handleDelete(f.id)} className="text-red-500 text-sm hover:underline shrink-0">Delete</button>
          </div>
        ))}
        {features.length === 0 && <p className="p-6 text-stone-500 text-sm">No features added yet.</p>}
      </div>
    </div>
  )
}