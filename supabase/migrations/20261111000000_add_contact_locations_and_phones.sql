ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS contact_locations jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_phone_numbers jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.site_settings
SET contact_locations = '[{"label":"Main Office","address":"Teco Mall, Mombasa Road, Nairobi"}]'::jsonb
WHERE id = 1
  AND contact_locations = '[]'::jsonb;

UPDATE public.site_settings
SET contact_phone_numbers = jsonb_build_array(
  jsonb_build_object('label', 'WhatsApp', 'number', whatsapp_number, 'is_whatsapp', true)
)
WHERE id = 1
  AND contact_phone_numbers = '[]'::jsonb
  AND NULLIF(TRIM(whatsapp_number), '') IS NOT NULL;