'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [aboutTitle, setAboutTitle] = useState('')
  const [aboutText, setAboutText] = useState('')
  
  // New Hero States
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
      if (data) {
        setWhatsapp(data.whatsapp_number || '')
        setEmail(data.contact_email || '')
        setAboutTitle(data.about_title || '')
        setAboutText(data.about_text || '')
        setHeroTitle(data.hero_title || '')
        setHeroSubtitle(data.hero_subtitle || '')
        setHeroImageUrl(data.hero_image_url || '')
      }
      setLoading(false)
    }
    fetchSettings()
  }, [supabase])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const { error } = await supabase.from('site_settings').update({
      whatsapp_number: whatsapp,
      contact_email: email,
      about_title: aboutTitle,
      about_text: aboutText,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      hero_image_url: heroImageUrl
    }).eq('id', 1)

    if (error) {
      alert('Error saving settings: ' + error.message)
    } else {
      alert('Settings saved successfully!')
    }
    setSaving(false)
  }

  if (loading) return <div className="p-10 text-stone-500">Loading settings...</div>

  return (
    <div className="max-w-3xl pb-24">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Website Settings</h1>
        <p className="text-stone-500">Manage your homepage content and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 border border-stone-200 space-y-8">
        
        {/* HOMEPAGE HERO SECTION */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1B3B2F] border-b border-stone-100 pb-2">Homepage Hero</h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Hero Title</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Hero Subtitle</label>
            <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} required rows={3} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"></textarea>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Hero Image URL</label>
            <p className="text-xs text-stone-400 mb-1">Upload your image to Supabase Storage, then paste the public URL here.</p>
            <input type="url" value={heroImageUrl} onChange={e => setHeroImageUrl(e.target.value)} required className="w-full border border-stone-300 p-3 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1B3B2F] border-b border-stone-100 pb-2">Contact Details</h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">WhatsApp Number</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">Contact Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-[#1B3B2F] border-b border-stone-100 pb-2">About Page</h2>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">About Title</label>
            <input type="text" value={aboutTitle} onChange={e => setAboutTitle(e.target.value)} required className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-stone-500">About Story</label>
            <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} required rows={4} className="w-full border border-stone-300 p-3 mt-1 text-sm focus:outline-none focus:border-[#1B3B2F]"></textarea>
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-[#1B3B2F] text-white px-8 py-4 w-full text-sm hover:bg-[#9C6B4E] transition disabled:opacity-50 font-medium">
          {saving ? 'Saving Changes...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  )
}