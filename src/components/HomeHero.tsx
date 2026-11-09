'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomeHero({ title, subtitle, imageUrl }: { title: string, subtitle: string, imageUrl: string }) {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-[#F7F5F2] overflow-hidden">
      
      {/* Background Image with Animation */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={imageUrl} 
          alt="Royal Umbrella Hero" 
          className="w-full h-full object-cover opacity-90"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F2] via-[#F7F5F2]/80 to-transparent"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-20">
        <div className="max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6 font-medium"
          >
            Curated Car Hire · Nairobi · Mombasa · Kisumu
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#1B3B2F]"
          >
            {title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-stone-700 mt-8 leading-relaxed max-w-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex items-center gap-6"
          >
            <Link
              href="/fleet"
              className="bg-[#1B3B2F] text-white px-10 py-5 rounded-full text-sm font-medium hover:bg-[#9C6B4E] transition-colors duration-300 shadow-xl shadow-[#1B3B2F]/20"
            >
              Explore the Fleet
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:border-[#9C6B4E] hover:text-[#9C6B4E] transition"
            >
              Our philosophy →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}