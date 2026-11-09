'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Category = { id: string; name: string; slug: string; description: string; display_order: number }

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      const { data } = await supabase.from('categories').select('*').order('display_order')
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [supabase])

  async function refreshCategories() {
    const { data } = await supabase.from('categories').select('*').order('display_order')
    if (data) setCategories(data)
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.display_order)) + 1 : 1

    const { error } = await supabase.from('categories').insert({
      name,
      slug,
      description,
      display_order: nextOrder
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setName('')
      setDescription('')
      refreshCategories()
    }
    setIsAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? Cars in this category will become uncategorized.')) return
    
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert(error.message)
    else refreshCategories()
  }

  if (loading) return <div className="p-10 text-stone-500">Loading categories...</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Categories</h1>
        {/* Fixed the unescaped quotes here */}
        <p className="text-stone-500">Manage the &quot;Character&quot; groupings for your fleet.</p>
      </div>

      <form onSubmit={handleAddCategory} className="bg-white p-6 border border-stone-200 mb-8 space-y-4">
        <h2 className="font-serif text-xl text-[#1B3B2F]">Add New Category</h2>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Executive SUVs" className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-stone-500">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Commanding presence for business travel." className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
        </div>
        <button type="submit" disabled={isAdding} className="bg-[#1B3B2F] text-white px-6 py-3 text-sm hover:bg-[#9C6B4E] transition">
          {isAdding ? 'Saving...' : 'Add Category'}
        </button>
      </form>

      <div className="bg-white border border-stone-200">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-4 border-b border-stone-100 last:border-0">
            <div>
              <p className="font-serif text-lg text-[#1B3B2F]">{cat.name}</p>
              <p className="text-xs text-stone-500">{cat.description}</p>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-red-500 text-sm hover:underline">
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && <p className="p-6 text-stone-500 text-sm">No categories yet.</p>}
      </div>
    </div>
  )
}