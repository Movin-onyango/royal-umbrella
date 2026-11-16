'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F2]/95 dark:bg-[#111111]/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 w-full transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group z-50">
          <div className="w-10 h-10 relative overflow-hidden rounded-full border border-stone-200 dark:border-stone-700">
            <Image src="/logo.png" alt="Royal Umbrella Logo" fill className="object-cover scale-110" />
          </div>
          <span className="font-serif text-xl md:text-2xl text-[#1B3B2F] dark:text-white tracking-tight font-semibold">
            Royal Umbrella
          </span>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/fleet" className="text-stone-600 dark:text-stone-300 hover:text-[#1B3B2F] dark:hover:text-white transition">The Fleet</Link>
          <Link href="/about" className="text-stone-600 dark:text-stone-300 hover:text-[#1B3B2F] dark:hover:text-white transition">About</Link>
          <Link href="/services" className="text-stone-600 dark:text-stone-300 hover:text-[#1B3B2F] dark:hover:text-white transition">Services</Link>
          <Link href="/contact" className="text-stone-600 dark:text-stone-300 hover:text-[#1B3B2F] dark:hover:text-white transition">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-[#1B3B2F] dark:text-stone-300 border border-[#1B3B2F] dark:border-stone-600 px-5 py-2 rounded-full hover:bg-[#1B3B2F] dark:hover:bg-stone-800 hover:text-white transition">
            Sign In
          </Link>
          <Link href="/fleet" className="text-sm bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] px-5 py-2 rounded-full hover:bg-[#9C6B4E] dark:hover:bg-[#D4B37A] transition font-medium">
            Book Now
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!resolvedTheme}
            aria-label={resolvedTheme ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Theme toggle'}
            title={resolvedTheme ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Theme toggle'}
            className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition disabled:opacity-0"
          >
            {resolvedTheme && (isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!resolvedTheme}
            aria-label={resolvedTheme ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Theme toggle'}
            title={resolvedTheme ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Theme toggle'}
            className="p-2 text-[#1B3B2F] dark:text-white disabled:opacity-0"
          >
            {resolvedTheme && (isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'} className="z-50 p-2 text-[#1B3B2F] dark:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU FULL SCREEN */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-[#F7F5F2] dark:bg-[#111111] z-40 md:hidden flex flex-col p-6 overflow-y-auto w-full">
          <nav className="flex flex-col gap-4 text-lg font-serif">
            <Link href="/fleet" onClick={() => setIsOpen(false)} className="text-[#1B3B2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4">The Fleet</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-[#1B3B2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4">About</Link>
            <Link href="/services" onClick={() => setIsOpen(false)} className="text-[#1B3B2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4">Services</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-[#1B3B2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4">Contact</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="text-[#1B3B2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4">Sign In</Link>
          </nav>
          <Link href="/fleet" onClick={() => setIsOpen(false)} className="mt-8 bg-[#1B3B2F] dark:bg-[#E5C38A] text-white dark:text-[#111111] text-center py-4 rounded-full text-sm w-full block font-medium">
            Book Now
          </Link>
        </div>
      )}
    </header>
  )
}