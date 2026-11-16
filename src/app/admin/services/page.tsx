'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Service = {
  id: string
  title: string
  description: string
  icon: string
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('briefcase')

  useEffect(() => {
    let active = true

    supabase.from('services').select('*').order('display_order').then(({ data }) => {
      if (!active) return
      if (data) setServices(data)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [supabase])

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('display_order')
    if (data) setServices(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const nextOrder = services.length + 1
    
    const { error } = await supabase.from('services').insert({
      title,
      description,
      icon,
      display_order: nextOrder
    })

    if (error) {
      alert(error.message)
    } else {
      setTitle('')
      setDescription('')
      fetchServices()
    }
  }

  async function handleDelete(id: string) {
    if(!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    fetchServices()
  }

  if (loading) return <div className="p-10 text-stone-500">Loading services...</div>

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="font-serif text-4xl text-[#1B3B2F] dark:text-white mb-2">Manage Services</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Add, edit, or remove the services shown on the public website.</p>
      
      <form onSubmit={handleAdd} className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 p-6 mb-8 space-y-4 rounded-lg">
        <h2 className="font-serif text-xl text-[#1B3B2F] dark:text-white mb-4">Add New Service</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wider text-stone-500">Service Title</label>
            <input type="text" placeholder="e.g., Airport Transfers" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Icon Type</label>
            <select value={icon} onChange={e => setIcon(e.target.value)} className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent dark:bg-[#1A1A1A]">
              <option value="plane">Plane (Airport)</option>
              <option value="briefcase">Briefcase (Business)</option>
              <option value="sparkles">Sparkles (Weddings)</option>
              <option value="map">Map (Safari/Trips)</option>
              <option value="key">Key (Self-Drive)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Description</label>
          <textarea placeholder="Describe the service..." value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full border p-3 mt-1 text-sm focus:outline-none bg-transparent"></textarea>
        </div>

        <button type="submit" className="bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] px-6 py-3 text-sm hover:bg-[#9C6B4E] transition rounded font-medium">
          Add Service
        </button>
      </form>

      <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg">
        {services.map((s, i) => (
          <div key={s.id} className="p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 flex justify-between items-start gap-4">
            <div>
              <p className="font-medium text-[#1B3B2F] dark:text-white flex items-center gap-2">
                <span className="text-xs font-mono text-[#9C6B4E]">0{i + 1}</span>
                {s.title}
                <span className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500 capitalize">{s.icon}</span>
              </p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">{s.description}</p>
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm hover:underline shrink-0">Delete</button>
          </div>
        ))}
        {services.length === 0 && <p className="p-6 text-stone-500 text-sm">No services added yet.</p>}
      </div>
    </div>
  )
}