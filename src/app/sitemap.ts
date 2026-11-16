import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  // Get all cars
  const { data: cars } = await supabase
    .from('cars')
    .select('slug, created_at')
    .eq('is_available', true)
  
  // Base URL (Change this when you get a custom domain like royalumbrella.co.ke)
  const baseUrl = 'https://royal-umbrella.movinoscar45.workers.dev'

  const carUrls = cars?.map((car) => ({
    url: `${baseUrl}/cars/${encodeURIComponent(car.slug)}`,
    lastModified: car.created_at ? new Date(car.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/fleet`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    ...['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret'].map((county) => ({
      url: `${baseUrl}/locations/${county}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticUrls, ...carUrls]
}