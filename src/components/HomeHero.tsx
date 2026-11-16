'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomeHero({ title, subtitle, imageUrl }: { title: string, subtitle: string, imageUrl: string }) {
  return (
    <section className="relative w-full min-h-[85vh] min-h-[85svh] overflow-hidden bg-[#F7F5F2]">
      
      {/* Background Image Container - strictly absolute and overflow hidden */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={imageUrl} 
          alt="Royal Umbrella Hero" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F2]/95 via-[#F7F5F2]/80 to-[#F7F5F2]/95 md:bg-gradient-to-r md:from-[#F7F5F2] md:via-[#F7F5F2]/80 md:to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full h-full flex flex-col justify-center pt-24 pb-12 md:pt-32">
        <div className="max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4 font-medium"
          >
            Curated Car Hire · Nairobi · Mombasa
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl md:text-6xl leading-[1.1] text-[#1B3B2F] font-bold"
          >
            {title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-stone-800 mt-6 leading-relaxed max-w-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/fleet"
              className="w-full sm:w-auto bg-[#1B3B2F] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#9C6B4E] transition-colors duration-300 shadow-lg"
            >
              Explore the Fleet
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto text-center text-sm font-medium text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:border-[#9C6B4E] hover:text-[#9C6B4E] transition"
            >
              Our philosophy →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}