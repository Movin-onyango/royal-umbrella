import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

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
  title: 'Royal Umbrella | Premium Car Hire in Kenya',
  description: 'Discover a different world. Hire premium, curated vehicles in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#F7F5F2] text-stone-800 antialiased">
        {children}
      </body>
    </html>
  )
}