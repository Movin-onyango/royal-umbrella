import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Don't let Google index the admin dashboard!
    },
    sitemap: 'https://royal-umbrella.movinoscar45.workers.dev/sitemap.xml',
  }
}