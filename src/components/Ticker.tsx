'use client'

import { motion } from 'framer-motion'

export default function Ticker({ categories }: { categories: { name: string }[] }) {
  // If no categories, show a default list
  const items = categories.length > 0 
    ? categories.map(c => c.name) 
    : ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret']
  
  // Duplicate items to make the infinite scroll seamless
  const tickerItems = [...items, ...items, ...items, ...items]

  return (
    <div className="bg-[#1B3B2F] text-[#F7F5F2] py-4 overflow-hidden flex whitespace-nowrap border-y border-[#9C6B4E]">
      <motion.div 
        animate={{ x: [0, -1000] }} 
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        className="flex gap-12 items-center"
      >
        {tickerItems.map((item, index) => (
          <div key={index} className="flex items-center gap-12">
            <span className="text-sm uppercase tracking-[0.2em]">{item}</span>
            <span className="text-[#9C6B4E] text-lg">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}