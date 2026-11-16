import { createClient } from '@/lib/supabase/server'
import SettingsForm from './SettingsForm'

export default async function AdminSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('whatsapp_number, contact_email, contact_locations, contact_phone_numbers')
    .eq('id', 1)
    .maybeSingle()

  return (
    <div className="max-w-4xl pb-24">
      <h1 className="mb-2 font-serif text-4xl text-[#1B3B2F] dark:text-white">Site Settings</h1>
      <p className="mb-8 text-stone-500 dark:text-stone-400">Manage contact details, office locations, and phone numbers shown on the public site.</p>
      {error || !data ? (
        <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">Could not load site settings. Check the `site_settings` row and your admin permissions.</p>
      ) : (
        <SettingsForm initialSettings={data} />
      )}
    </div>
  )
}