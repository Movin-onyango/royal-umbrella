import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-stone-200 bg-[#F7F5F2] text-stone-700 transition-colors duration-300 dark:border-stone-800 dark:bg-[#111111] dark:text-stone-300">
      <div className="mx-auto max-w-6xl px-6 pt-10 md:pt-14">
        <section className="relative isolate overflow-hidden border border-[#345646] bg-[#1B3B2F] px-6 py-10 text-white md:px-12 md:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 z-0 size-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-20 z-0 size-56 rounded-full border border-white/10"
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#E5C38A]">
                <span aria-hidden="true" className="h-px w-8 bg-[#E5C38A]" />
                Discover a different world
              </p>
              <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                The right drive changes everything.
              </h2>
            </div>
            <Link
              href="/fleet"
              className="group inline-flex shrink-0 items-center gap-3 bg-[#E5C38A] px-6 py-3 text-sm font-medium text-[#17231D] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5C38A]"
            >
              Explore the fleet
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-4 md:gap-12 md:py-16">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-full border border-[#9C6B4E]/40 font-serif text-lg text-[#9C6B4E]">
                RU
              </span>
              <p className="font-serif text-2xl tracking-tight text-[#1B3B2F] dark:text-white">
                Royal Umbrella
              </p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              A curated fleet for those who travel with intention.
              Every vehicle is selected, not listed.
            </p>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              Explore
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/fleet" className="transition-colors hover:text-[#9C6B4E]">The Fleet</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-[#9C6B4E]">About</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[#9C6B4E]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
              Reach Us
            </p>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:hello@royalumbrella.com" className="transition-colors hover:text-[#9C6B4E]">hello@royalumbrella.com</a></li>
              <li className="text-stone-600 dark:text-stone-400">+1 (555) 000-0000</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-200 py-6 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Royal Umbrella. All rights reserved.</p>
          <Link href="/admin/login" className="transition-colors hover:text-[#9C6B4E]">
            Staff Login
          </Link>
        </div>
      </div>
    </footer>
  )
}