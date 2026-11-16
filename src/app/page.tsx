import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import QuickSearch from '@/components/QuickSearch'
import MovingCars from '@/components/MovingCars'
import BrandTicker from '@/components/BrandTicker'
import Ticker from '@/components/Ticker'
import ServiceIcon from '@/components/ServiceIcon'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: sliders } = await supabase.from('hero_sliders').select('*').order('display_order')
  const { data: categories } = await supabase.from('categories').select('*').order('display_order')
  const { data: carsWithBrands } = await supabase.from('cars').select('brand').not('brand', 'is', null)
  const uniqueBrands = [...new Set((carsWithBrands ?? [])
    .map((car) => car.brand)
    .filter((brand): brand is string => typeof brand === 'string' && brand.trim() !== ''))]
    .map((name) => ({ name }))
  
  // Fetch features for the "Why Choose Us" section
  const { data: features } = await supabase.from('features').select('*').order('display_order').limit(4)
  
  // Fetch services for the new Services section
  const { data: services } = await supabase
    .from('services')
    .select('id, title, description, icon, display_order')
    .order('display_order')
    .limit(4)

  const { data: allCars } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2]">
        
        {/* 1. HERO SLIDER */}
        <HeroSlider sliders={sliders || []} />

        {/* QUICK SEARCH */}
        <QuickSearch />

        {/* 2. MOVING CATEGORIES TICKER */}
        <Ticker categories={categories || []} />

        {/* 3. FEATURED VEHICLES (Moved up for instant gratification) */}
        <MovingCars cars={allCars || []} />

        {/* 4. SERVICES GRID */}
        <section className="bg-[#F7F5F2] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-2">What We Offer</p>
                <h2 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">Services built around you</h2>
              </div>
              <Link href="/services" className="text-sm font-medium text-[#1B3B2F] border-b border-[#1B3B2F] pb-1 hover:text-[#9C6B4E] hover:border-[#9C6B4E] transition">
                View all services →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services?.map((service, i) => (
                <div key={service.id} className="border-t border-stone-300 pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-sm font-mono text-[#9C6B4E]">0{i + 1}</span>
                    <ServiceIcon name={service.icon} className="h-5 w-5 text-[#9C6B4E]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#1B3B2F] mb-3">{service.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. WHY CHOOSE US (Dark Section) */}
        <section className="bg-[#1B3B2F] text-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4">Our Features</p>
              <h2 className="font-serif text-4xl md:text-5xl">What Makes Us Different</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features?.map((feature) => (
                <div key={feature.id} className="bg-white/5 border border-white/10 p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9C6B4E]/20 flex items-center justify-center shrink-0 text-[#9C6B4E]">
                    {/* Placeholder icon */}
                    <span className="capitalize font-serif">{feature.icon.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">{feature.title}</h3>
                    <p className="text-sm text-white/60 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. BRANDS SCROLLER */}
        <BrandTicker brands={uniqueBrands} />

        {/* 7. BOTTOM CTA */}
        <section className="bg-[#F7F5F2] py-24 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-5xl md:text-6xl text-[#1B3B2F] mb-6">Ready to Ride?</h2>
            <Link href="/fleet" className="inline-block bg-[#9C6B4E] text-white px-10 py-5 rounded-full text-sm font-medium hover:bg-[#1B3B2F] transition-colors duration-300 shadow-xl">
              Reserve Your Vehicle
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}