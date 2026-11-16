'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Slider = { id: string; title: string; subtitle: string; image_url: string }

export default function HeroSlider({ sliders }: { sliders: Slider[] }) {
  const [current, setCurrent] = useState(0)

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (sliders.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [sliders.length])

  if (!sliders || sliders.length === 0) {
    return <div className="h-[80vh] bg-[#1B3B2F]"></div> // Fallback
  }

  const active = sliders[current]

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img src={active.image_url} alt={active.title} className="w-full h-full object-cover opacity-70" />
          {/* Dark Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B3B2F] via-black/40 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-24">
        <motion.div 
          key={`text-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="text-[#9C6B4E]">★★★★★</span>
            <span className="text-white text-xs tracking-wider font-medium">4.9/5 · Trusted Service</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
            {active.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl">
            {active.subtitle}
          </p>
          
          <div className="flex gap-4">
            <Link href="/fleet" className="bg-[#9C6B4E] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white hover:text-[#1B3B2F] transition">
              Book Your Ride
            </Link>
            <Link href="/fleet" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/20 transition">
              Explore Fleet
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}