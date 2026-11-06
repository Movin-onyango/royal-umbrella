import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F2]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl text-[#1B3B2F] tracking-tight">
          Royal Umbrella
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/fleet" className="text-stone-600 hover:text-[#1B3B2F] transition">
            The Fleet
          </Link>
          <Link href="/about" className="text-stone-600 hover:text-[#1B3B2F] transition">
            About
          </Link>
          <Link href="/contact" className="text-stone-600 hover:text-[#1B3B2F] transition">
            Contact
          </Link>
        </nav>

        <Link
          href="/fleet"
          className="hidden md:inline-block text-sm text-[#1B3B2F] border border-[#1B3B2F] px-5 py-2 rounded-full hover:bg-[#1B3B2F] hover:text-white transition"
        >
          Reserve
        </Link>
      </div>
    </header>
  )
}