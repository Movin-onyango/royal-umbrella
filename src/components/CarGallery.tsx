'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, ChevronLeft, ChevronRight } from 'lucide-react'
import Car3DViewer from '@/components/Car3DViewer'

export default function CarGallery({
  heroImage,
  gallery,
  modelUrl,
  soundUrl,
  fallbackAlt,
}: {
  heroImage: string | null
  gallery: string[]
  modelUrl?: string
  soundUrl?: string
  fallbackAlt: string
}) {
  const allImages = Array.from(new Set([heroImage, ...gallery])).filter(
    (image): image is string => Boolean(image),
  )
  const [activeIndex, setActiveIndex] = useState(modelUrl ? -1 : 0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (allImages.length < 2 || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => current < 0 ? 0 : (current + 1) % allImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [allImages.length, isPaused])

  if (!allImages.length && !modelUrl) return null

  const activeImage = allImages[activeIndex]
  const showingModel = Boolean(modelUrl && activeIndex < 0)

  function showPrevious() {
    setActiveIndex((current) => {
      if (current < 0) return allImages.length - 1
      if (current === 0 && modelUrl) return -1
      return (current - 1 + allImages.length) % allImages.length
    })
  }

  function showNext() {
    setActiveIndex((current) => {
      if (current < 0) return 0
      if (current === allImages.length - 1 && modelUrl) return -1
      return (current + 1) % allImages.length
    })
  }

  return (
    <div className="w-full" onPointerEnter={() => setIsPaused(true)} onPointerLeave={() => setIsPaused(false)}>
      <div className="aspect-[4/3] bg-stone-200 dark:bg-[#1A1A1A] rounded-lg overflow-hidden relative">
        {showingModel && modelUrl ? (
          <Car3DViewer
            modelUrl={modelUrl}
            soundUrl={soundUrl}
            fallbackImageUrl={allImages[0] ?? null}
            fallbackAlt={fallbackAlt}
          />
        ) : activeImage ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={fallbackAlt}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">Image coming soon</div>
        )}

        {(allImages.length > 1 || modelUrl) && (
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-between px-3">
            <button type="button" onClick={showPrevious} aria-label="Previous gallery image" className="grid h-9 w-9 place-items-center rounded-full bg-black/65 text-white hover:bg-black/85">
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={showNext} aria-label="Next gallery image" className="grid h-9 w-9 place-items-center rounded-full bg-black/65 text-white hover:bg-black/85">
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {(allImages.length > 1 || modelUrl) && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {modelUrl && (
            <button
              type="button"
              onClick={() => setActiveIndex(-1)}
              aria-label="Show 3D model"
              aria-pressed={showingModel}
              className={`grid h-16 w-24 shrink-0 place-items-center rounded border-2 transition-all ${showingModel ? 'border-[#9C6B4E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Box size={22} aria-hidden="true" />
              <span className="text-xs">3D View</span>
            </button>
          )}
          {allImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show gallery image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative w-24 h-16 shrink-0 rounded overflow-hidden border-2 transition-all ${activeIndex === index ? 'border-[#9C6B4E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}