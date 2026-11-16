'use client'

import { motion } from 'framer-motion'

export default function BrandTicker({ brands }: { brands: { name: string }[] }) {
  if (!brands || brands.length === 0) return null

  // Duplicate the list for infinite scrolling
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands]

  return (
    <section className="bg-[#E5C38A] py-8 overflow-hidden w-full border-y border-[#D4B37A]">
      <div className="max-w-6xl mx-auto px-6 mb-4">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-[#1B3B2F]/60 font-semibold">Trusted Brands</p>
      </div>
      <motion.div 
        animate={{ x: ["0%", "-50%"] }} 
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        className="flex gap-12 items-center w-max"
      >
        {duplicatedBrands.map((brand, index) => (
          <span key={index} className="text-2xl md:text-3xl font-serif text-[#1B3B2F] opacity-80 whitespace-nowrap">
            {brand.name}
          </span>
        ))}
      </motion.div>
    </section>
  )
}