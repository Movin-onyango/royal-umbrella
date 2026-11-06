import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const heroCategory = categories?.[0]

  return (
    <>
      <Navbar />
      <main>
        {/* ─── HERO ─── */}
        <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <div className="animate-fade-up">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">
              Curated Car Hire · Est. 2026
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#1B3B2F] max-w-4xl">
              The drive is not
              <br />
              the destination.
              <br />
              <span className="italic text-[#9C6B4E]">It is the ritual.</span>
            </h1>
            <p className="text-lg text-stone-600 max-w-lg mt-8 leading-relaxed">
              Royal Umbrella is a small, intentional fleet for people who
              believe a car should be chosen, not rented. Browse by character,
              not by price.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/fleet"
                className="bg-[#1B3B2F] text-white px-8 py-4 rounded-full text-sm hover:bg-[#9C6B4E] transition-colors duration-300"
              >
                Explore the Fleet
              </Link>
              <Link
                href="/about"
                className="text-sm text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:border-[#9C6B4E] hover:text-[#9C6B4E] transition"
              >
                Our philosophy →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES AS CHAPTERS ─── */}
        <section className="border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-3">
                  Chapter I
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">
                  By Character
                </h2>
              </div>
              <p className="hidden md:block text-sm text-stone-500 max-w-xs text-right leading-relaxed">
                Every car in the Royal Umbrella collection belongs to a
                category. Choose by the kind of drive you want to have.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200">
              {categories?.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/fleet?category=${cat.slug}`}
                  className="group bg-[#F7F5F2] p-10 md:p-12 flex flex-col justify-between min-h-[280px] hover:bg-white transition-colors duration-500"
                >
                  <div>
                    <span className="text-xs text-stone-400 font-mono">
                      0{i + 1}
                    </span>
                    <h3 className="font-serif text-2xl text-[#1B3B2F] mt-4 mb-3 group-hover:text-[#9C6B4E] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-[#1B3B2F] mt-8 group-hover:translate-x-2 transition-transform duration-300 inline-block">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED FLEET ─── */}
        <section className="border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-3">
                  Chapter II
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">
                  Selected for You
                </h2>
              </div>
              <Link
                href="/fleet"
                className="text-sm text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:border-[#9C6B4E] hover:text-[#9C6B4E] transition"
              >
                The full fleet →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {featuredCars?.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-stone-200 overflow-hidden mb-5">
                    {car.hero_image_url ? (
                      <img
                        src={car.hero_image_url}
                        alt={car.name}
                        className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">
                        Image coming soon
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-2">
                        {car.categories?.name}
                      </p>
                      <h3 className="font-serif text-xl text-[#1B3B2F]">
                        {car.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {car.transmission} · {car.seats} seats · {car.fuel_type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-lg text-[#1B3B2F]">
                        ${car.price_per_day}
                      </p>
                      <p className="text-xs text-stone-400">/ day</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHILOSOPHY STRIP ─── */}
        <section className="bg-[#1B3B2F] text-[#F7F5F2]">
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">
              The Royal Umbrella Promise
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight max-w-3xl mx-auto">
              We do not have the largest fleet.
              <br />
              <span className="italic">We have the right one.</span>
            </h2>
            <p className="text-[#F7F5F2]/70 max-w-md mx-auto mt-8 leading-relaxed text-sm">
              Every vehicle is inspected, every booking confirmed by a person,
              and every drive supported from pickup to return.
            </p>
            <Link
              href="/fleet"
              className="inline-block mt-10 bg-[#F7F5F2] text-[#1B3B2F] px-8 py-4 rounded-full text-sm hover:bg-[#9C6B4E] hover:text-white transition-colors"
            >
              Begin Your Reservation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}