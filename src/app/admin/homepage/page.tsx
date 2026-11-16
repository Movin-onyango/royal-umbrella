'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Slider = { id: string; title: string; subtitle: string }
type Brand = { id: string; name: string }

export default function ManageHomepage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Form states for new slider
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data: sliderData } = await supabase.from('hero_sliders').select('*').order('display_order')
      const { data: brandData } = await supabase.from('brands').select('*').order('display_order')
      if (sliderData) setSliders(sliderData)
      if (brandData) setBrands(brandData)
      setLoading(false)
    }

    void loadData()
  }, [supabase])

  async function fetchData() {
    const { data: s } = await supabase.from('hero_sliders').select('*').order('display_order')
    const { data: b } = await supabase.from('brands').select('*').order('display_order')
    if (s) setSliders(s)
    if (b) setBrands(b)
    setLoading(false)
  }

  async function addSlider(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('hero_sliders').insert({ title, subtitle, image_url: imageUrl, display_order: sliders.length + 1 })
    setTitle(''); setSubtitle(''); setImageUrl('')
    fetchData()
  }

  async function deleteSlider(id: string) {
    if(!confirm('Delete this slide?')) return
    await supabase.from('hero_sliders').delete().eq('id', id)
    fetchData()
  }

  async function addBrand(e: React.FormEvent) {
    e.preventDefault()
    const brandName = (e.target as HTMLFormElement).brand.value
    if(!brandName) return
    await supabase.from('brands').insert({ name: brandName, display_order: brands.length + 1 })
    ;(e.target as HTMLFormElement).reset()
    fetchData()
  }

  async function deleteBrand(id: string) {
    await supabase.from('brands').delete().eq('id', id)
    fetchData()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl space-y-12 pb-24">
      
      {/* HERO SLIDERS */}
      <div>
        <h1 className="font-serif text-3xl text-[#1B3B2F] mb-6">Homepage Hero Sliders</h1>
        <form onSubmit={addSlider} className="bg-white p-6 border border-stone-200 mb-6 space-y-4">
          <input type="text" placeholder="Title (e.g. Luxury Chauffeur & Executive Car Hire)" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-3 text-sm" />
          <input type="text" placeholder="Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} required className="w-full border p-3 text-sm" />
          <input type="url" placeholder="Image URL (from Supabase Storage)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="w-full border p-3 text-sm" />
          <button type="submit" className="bg-[#1B3B2F] text-white px-6 py-3 text-sm">Add Slider</button>
        </form>

        <div className="space-y-4">
          {sliders.map(s => (
            <div key={s.id} className="bg-white p-4 border flex justify-between items-center">
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-stone-500">{s.subtitle}</p>
              </div>
              <button onClick={() => deleteSlider(s.id)} className="text-red-500 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div>
        <h2 className="font-serif text-3xl text-[#1B3B2F] mb-6">Trusted Brands</h2>
        <form onSubmit={addBrand} className="flex gap-4 mb-6">
          <input name="brand" type="text" placeholder="Brand Name (e.g. Toyota)" required className="flex-1 border p-3 text-sm" />
          <button type="submit" className="bg-[#1B3B2F] text-white px-6 py-3 text-sm">Add Brand</button>
        </form>

        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <div key={b.id} className="bg-white border px-4 py-2 flex items-center gap-3 text-sm">
              {b.name}
              <button onClick={() => deleteBrand(b.id)} className="text-red-500 font-bold">×</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}