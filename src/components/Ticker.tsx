'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// We pass both categories and counties to the ticker
export default function Ticker({ categories }: { categories: { name: string, slug: string }[] }) {
  
  // If no categories, show default counties
  const items = categories.length > 0
    ? categories.map(c => ({ name: c.name, url: `/fleet?category=${c.slug}` }))
    : [
        { name: 'Nairobi', url: '/locations/nairobi' },
        { name: 'Mombasa', url: '/locations/mombasa' },
        { name: 'Kisumu', url: '/locations/kisumu' },
        { name: 'Nakuru', url: '/locations/nakuru' },
        { name: 'Eldoret', url: '/locations/eldoret' },
      ]

  // Duplicate items for seamless scrolling
  const tickerItems = [...items, ...items, ...items, ...items, ...items]

  return (
    <div className="bg-[#1B3B2F] text-[#F7F5F2] py-4 overflow-hidden w-full relative">
      <motion.div 
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex w-max shrink-0 gap-8 whitespace-nowrap"
      >
        {tickerItems.map((item, index) => (
          <div key={index} className="flex shrink-0 items-center gap-8">
            {/* Make it a Link */}
            <Link
              href={item.url}
              className="whitespace-nowrap text-sm uppercase tracking-[0.2em] hover:text-[#9C6B4E] transition-colors"
            >
              {item.name}
            </Link>
            <span className="text-[#9C6B4E] text-lg">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}