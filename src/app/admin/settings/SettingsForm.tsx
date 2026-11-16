'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ContactLocation = { label: string; address: string }
type PhoneContact = { label: string; number: string; is_whatsapp: boolean }
type SiteSettings = {
  whatsapp_number: string | null
  contact_email: string | null
  contact_locations: ContactLocation[] | null
  contact_phone_numbers: PhoneContact[] | null
}

const fieldClass = 'mt-1 w-full border border-stone-300 bg-transparent p-3 text-sm focus:outline-none focus:border-[#1B3B2F] dark:border-stone-700 dark:text-white'
const labelClass = 'text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400'

export default function SettingsForm({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings?.whatsapp_number || '')
  const [contactEmail, setContactEmail] = useState(initialSettings?.contact_email || '')
  const [locations, setLocations] = useState<ContactLocation[]>(initialSettings?.contact_locations || [])
  const [phoneContacts, setPhoneContacts] = useState<PhoneContact[]>(initialSettings?.contact_phone_numbers || [])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  function updateLocation(index: number, field: keyof ContactLocation, value: string) {
    setLocations((current) => current.map((location, itemIndex) =>
      itemIndex === index ? { ...location, [field]: value } : location,
    ))
  }

  function updatePhone(index: number, field: keyof PhoneContact, value: string | boolean) {
    const currentContact = phoneContacts[index]
    setPhoneContacts((current) => current.map((contact, itemIndex) => {
      if (itemIndex === index) return { ...contact, [field]: value }
      if (field === 'is_whatsapp' && value) return { ...contact, is_whatsapp: false }
      return contact
    }))

    if (field === 'number' && currentContact?.is_whatsapp && typeof value === 'string') {
      setWhatsappNumber(value)
    }
    if (field === 'is_whatsapp' && typeof value === 'boolean' && currentContact) {
      setWhatsappNumber(value ? currentContact.number : '')
    }
  }

  function removePhone(index: number) {
    if (phoneContacts[index]?.is_whatsapp) setWhatsappNumber('')
    setPhoneContacts((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    const savedLocations = locations
      .map((location) => ({ label: location.label.trim(), address: location.address.trim() }))
      .filter((location) => location.label || location.address)
    const savedPhones = phoneContacts
      .map((contact) => ({ label: contact.label.trim(), number: contact.number.trim(), is_whatsapp: contact.is_whatsapp }))
      .filter((contact) => contact.label || contact.number)
    const whatsappIndex = savedPhones.findIndex((contact) => contact.is_whatsapp)

    if (whatsappNumber.trim()) {
      if (whatsappIndex >= 0) savedPhones[whatsappIndex].number = whatsappNumber.trim()
      else savedPhones.push({ label: 'WhatsApp', number: whatsappNumber.trim(), is_whatsapp: true })
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update({
        whatsapp_number: whatsappNumber.trim(),
        contact_email: contactEmail.trim(),
        contact_locations: savedLocations,
        contact_phone_numbers: savedPhones,
      })
      .eq('id', 1)
      .select('id')
      .maybeSingle()

    if (error) setMessage(`Could not save settings: ${error.message}`)
    else if (!data) setMessage('Settings were not saved. Check that your admin account has permission to edit them.')
    else setMessage('Settings saved.')
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <section className="space-y-5 border-b border-stone-200 pb-8 dark:border-stone-800">
        <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white">Contact Details</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className={labelClass}>
            WhatsApp Number
            <input type="tel" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} className={fieldClass} placeholder="254700000000" />
          </label>
          <label className={labelClass}>
            Contact Email
            <input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className={fieldClass} placeholder="hello@example.com" />
          </label>
        </div>
      </section>

      <section className="space-y-5 border-b border-stone-200 pb-8 dark:border-stone-800">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white">Office Locations</h2>
          <button type="button" onClick={() => setLocations((current) => [...current, { label: '', address: '' }])} className="border border-stone-300 px-3 py-2 text-sm text-[#1B3B2F] hover:border-[#9C6B4E] dark:border-stone-700 dark:text-white">Add Location</button>
        </div>
        {locations.map((location, index) => (
          <div key={index} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_2fr_auto]">
            <label className={labelClass}>Label<input value={location.label} onChange={(event) => updateLocation(index, 'label', event.target.value)} className={fieldClass} placeholder="Main Office" /></label>
            <label className={labelClass}>Address<input value={location.address} onChange={(event) => updateLocation(index, 'address', event.target.value)} className={fieldClass} placeholder="Street, city" /></label>
            <button type="button" onClick={() => setLocations((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove location ${index + 1}`} className="px-3 py-3 text-sm text-red-600">Remove</button>
          </div>
        ))}
        {locations.length === 0 && <p className="text-sm text-stone-500">No office locations added.</p>}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white">Phone Numbers</h2>
          <button type="button" onClick={() => setPhoneContacts((current) => [...current, { label: '', number: '', is_whatsapp: false }])} className="border border-stone-300 px-3 py-2 text-sm text-[#1B3B2F] hover:border-[#9C6B4E] dark:border-stone-700 dark:text-white">Add Phone</button>
        </div>
        {phoneContacts.map((contact, index) => (
          <div key={index} className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <label className={labelClass}>Label<input value={contact.label} onChange={(event) => updatePhone(index, 'label', event.target.value)} className={fieldClass} placeholder="Reservations" /></label>
            <label className={labelClass}>Number<input type="tel" value={contact.number} onChange={(event) => updatePhone(index, 'number', event.target.value)} className={fieldClass} placeholder="+254..." /></label>
            <label className="flex items-center gap-2 pb-3 text-sm text-stone-600 dark:text-stone-300"><input type="checkbox" checked={contact.is_whatsapp} onChange={(event) => updatePhone(index, 'is_whatsapp', event.target.checked)} />WhatsApp</label>
            <button type="button" onClick={() => removePhone(index)} aria-label={`Remove phone ${index + 1}`} className="px-3 py-3 text-sm text-red-600">Remove</button>
          </div>
        ))}
        {phoneContacts.length === 0 && <p className="text-sm text-stone-500">No phone numbers added.</p>}
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-stone-200 pt-6 dark:border-stone-800">
        <button type="submit" disabled={saving} className="bg-[#1B3B2F] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#9C6B4E] disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {message && <p role="status" className={`text-sm ${message.startsWith('Could not') || message.startsWith('Settings were not') ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
      </div>
    </form>
  )
}