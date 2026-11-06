import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl text-[#1B3B2F] mb-3">
            Royal Umbrella
          </p>
          <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
            A curated fleet for those who travel with intention.
            Every vehicle is selected, not listed.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
            Explore
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            <li><Link href="/fleet" className="hover:text-[#1B3B2F]">The Fleet</Link></li>
            <li><Link href="/about" className="hover:text-[#1B3B2F]">About</Link></li>
            <li><Link href="/contact" className="hover:text-[#1B3B2F]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
            Reach Us
          </p>
          <ul className="space-y-2 text-sm text-stone-600">
            <li>hello@royalumbrella.com</li>
            <li>+1 (555) 000-0000</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-stone-400">
        © {new Date().getFullYear()} Royal Umbrella. All rights reserved.
      </div>
    </footer>
  )
}s