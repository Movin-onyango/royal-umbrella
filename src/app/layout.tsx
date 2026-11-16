import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { ThemeProvider } from '@/components/ThemeProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://royal-umbrella.movinoscar45.workers.dev'),
  title: 'Royal Umbrella | Premium Car Hire in Kenya',
  description: 'Discover a different world. Hire premium, curated vehicles in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('whatsapp_number')
    .eq('id', 1)
    .single()

  const whatsappNumber = settings?.whatsapp_number || '254700000000'

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[#F7F5F2] text-stone-800 antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingWhatsApp phoneNumber={whatsappNumber} />
        </ThemeProvider>
      </body>
    </html>
  )
}