import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomeHero from '@/components/HomeHero'
import Ticker from '@/components/Ticker'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch settings, categories, and featured cars
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single()
  const { data: categories } = await supabase.from('categories').select('*').order('display_order')
  const { data: featuredCars } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('is_available', true)
    .limit(3)

  // Fallbacks
  const heroTitle = settings?.hero_title || 'The drive is not the destination. It is the ritual.'
  const heroSubtitle = settings?.hero_subtitle || 'Royal Umbrella is a small, intentional fleet for people who believe a car should be chosen, not rented. Browse by character, then set out from Nairobi toward Naivasha, Nanyuki or the Coast.'
  const heroImageUrl = settings?.hero_image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop'

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2]">
        
        {/* NEW HERO SECTION (Client Component for Animations) */}
        <HomeHero 
          title={heroTitle} 
          subtitle={heroSubtitle} 
          imageUrl={heroImageUrl} 
        />

        {/* MOVING TICKER */}
        <Ticker categories={categories || []} />

        {/* CATEGORIES SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-3">
                Chapter I
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">
                Choose Your Character
              </h2>
            </div>
            <p className="text-stone-500 max-w-sm text-sm">
              Every car in the Royal Umbrella collection belongs to a category. Choose by the kind of drive you want to have.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories?.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/fleet?category=${cat.slug}`}
                className="group bg-white p-10 flex flex-col justify-between min-h-[300px] border border-stone-200 hover:border-[#1B3B2F] transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div>
                  <span className="text-xs text-stone-400 font-mono">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-3xl text-[#1B3B2F] mt-6 mb-3 group-hover:text-[#9C6B4E] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-widest text-[#1B3B2F] mt-8 group-hover:translate-x-2 transition-transform duration-300 inline-block font-medium">
                  Explore Fleet →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED FLEET */}
        <section className="bg-white border-y border-stone-200">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex justify-between items-end mb-16">
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
                className="text-sm font-medium text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:border-[#9C6B4E] hover:text-[#9C6B4E] transition"
              >
                View the full fleet →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars?.map((car) => (
                <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-6 relative">
                    {car.hero_image_url && (
                      <img
                        src={car.hero_image_url}
                        alt={car.name}
                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-[#1B3B2F] text-white px-4 py-2 text-xs uppercase tracking-widest">
                      {car.county}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-2">
                      {car.categories?.name}
                    </p>
                    <h3 className="font-serif text-2xl text-[#1B3B2F] mb-1">
                      {car.name}
                    </h3>
                    <p className="text-lg text-stone-600 font-medium">
                      KSh {Number(car.price_per_day).toLocaleString()} <span className="text-sm text-stone-400 font-normal">/ day</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PHILOSOPHY STRIP */}
        <section className="bg-[#1B3B2F] text-[#F7F5F2]">
          <div className="max-w-6xl mx-auto px-6 py-32 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">
              The Royal Umbrella Promise
            </p>
            <h2 className="font-serif text-4xl md:text-6xl leading-tight max-w-4xl mx-auto">
              We do not have the largest fleet.
              <br />
              <span className="italic text-[#9C6B4E]">We have the right one.</span>
            </h2>
            <Link
              href="/fleet"
              className="inline-block mt-12 bg-[#F7F5F2] text-[#1B3B2F] px-10 py-5 rounded-full text-sm font-medium hover:bg-[#9C6B4E] hover:text-white transition-colors duration-300"
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