import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()

  // Fallbacks in case the database is empty
  const title = data?.about_title || 'The drive is not the destination. It is the ritual.'
  const text = data?.about_text || 'Royal Umbrella is a small, intentional fleet for people who believe a car should be chosen, not rented. We do not have the largest fleet. We have the right one. Every vehicle is inspected, every booking confirmed by a person, and every drive supported from pickup to return.'

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">Our Philosophy</p>
          <h1 className="font-serif text-4xl md:text-6xl text-[#1B3B2F] leading-[1.1] mb-12">
            {title}
          </h1>
          <div className="prose prose-stone max-w-none text-lg text-stone-600 leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
          
          <div className="mt-20 border-t border-stone-200 pt-12">
            <h2 className="font-serif text-3xl text-[#1B3B2F] mb-6">Where we operate</h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              We currently serve customers across five major counties in Kenya. Whether you are landing at JKIA in Nairobi, taking a coastal drive in Mombasa, or heading to the highlands in Nakuru, we deliver your vehicle to you.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'].map(county => (
                <span key={county} className="px-4 py-2 border border-stone-300 text-sm text-[#1B3B2F] uppercase tracking-wider">
                  {county}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}