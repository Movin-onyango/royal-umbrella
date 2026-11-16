'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Car = {
  id: string
  name: string
  slug: string
  hero_image_url: string
  price_per_day: number
  categories: { name: string } | null
}

export default function MovingCars({ cars }: { cars: Car[] }) {
  if (!cars || cars.length === 0) return null
  
  // We duplicate the array to ensure there's enough content to fill the screen while scrolling
  const duplicatedCars = [...cars, ...cars, ...cars, ...cars]

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-[#1A1A1A] overflow-hidden w-full transition-colors">
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-2">The Collection</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#1B3B2F] dark:text-white">In Motion</h2>
      </div>

      <div className="relative w-full flex overflow-hidden">
        <motion.div 
          // Using pixels instead of percentages prevents the "spin/jump" bug
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          className="flex gap-4 md:gap-8 px-4 w-max"
        >
          {duplicatedCars.map((car, index) => (
            <Link 
              key={`${car.id}-${index}`} 
              href={`/cars/${car.slug}`}
              className="group relative w-[280px] md:w-[400px] shrink-0 aspect-[4/3] overflow-hidden bg-stone-200 rounded-lg"
            >
              <img
                src={car.hero_image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop'}
                alt={car.name}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-1">
                  {car.categories?.name}
                </p>
                <h3 className="font-serif text-xl md:text-2xl text-white mb-1">
                  {car.name}
                </h3>
                <p className="text-white/80 text-sm">
                  KSh {Number(car.price_per_day).toLocaleString()} / day
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}