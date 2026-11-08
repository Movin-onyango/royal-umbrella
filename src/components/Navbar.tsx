import Link from 'next/link'

const counties = [
  { name: 'Nairobi', slug: 'nairobi' },
  { name: 'Mombasa', slug: 'mombasa' },
  { name: 'Kisumu', slug: 'kisumu' },
  { name: 'Nakuru', slug: 'nakuru' },
  { name: 'Eldoret', slug: 'eldoret' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F2]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl text-[#1B3B2F] tracking-tight">
          Royal Umbrella
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/fleet" className="text-stone-600 hover:text-[#1B3B2F] transition">
            The Fleet
          </Link>
          
          {/* Counties Dropdown */}
          <div className="relative group py-6">
            <button className="text-stone-600 group-hover:text-[#1B3B2F] transition flex items-center gap-1">
              Locations
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-48 bg-white border border-stone-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <ul className="py-2">
                {counties.map((county) => (
                  <li key={county.slug}>
                    <Link
                      href={`/fleet?county=${county.slug}`}
                      className="block px-6 py-2.5 text-stone-600 hover:text-[#1B3B2F] hover:bg-stone-50 transition"
                    >
                      {county.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

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