'use server'

import { createAdminClient } from '@/lib/admin'

export async function uploadCarImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file || file.size > 5 * 1024 * 1024) {
    return { error: 'File too large (max 5MB)' }
  }
  if (!file.type.startsWith('image/')) {
    return { error: 'Only images allowed' }
  }

  const admin = createAdminClient()
  const fileName = `cars/${Date.now()}-${file.name}`

  const { error } = await admin.storage
    .from('car-images')
    .upload(fileName, file)

  if (error) return { error: error.message }

  const { data } = admin.storage.from('car-images').getPublicUrl(fileName)
  return { url: data.publicUrl }
}