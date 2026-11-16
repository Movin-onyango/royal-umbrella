import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuickSearchClient from '@/components/QuickSearchClient'

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; county?: string; start?: string; end?: string }>
}) {
  // Await the search params for Next.js 15
  const { category, county, start, end } = await searchParams
  let days = 0
  if (start && end) {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    if (Number.isFinite(startTime) && Number.isFinite(endTime)) {
      days = Math.max(0, Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)))
    }
  }
  const supabase = await createClient()

  // 1. Fetch categories for the top filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  const { data: activeDiscounts } = await supabase
    .from('discounts')
    .select('id, percentage')
    .eq('is_active', true)

  // 2. Start building the car query
  let query = supabase
    .from('cars')
    .select('*, categories(name, slug)')
    .eq('is_available', true)

  // 3. Apply Category Filter if present
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  // 4. Apply County Filter if present
  if (county && county !== 'all') {
    query = query.eq('county', county)
  }

  // Execute the final query
  const { data: cars } = await query

  // Formatting helper for the header text
  const activeCountyName = county && county !== 'all'
    ? county.charAt(0).toUpperCase() + county.slice(1) 
    : null

  function buildFleetUrl(filters: { category?: string; county?: string }) {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.county && filters.county !== 'all') params.set('county', filters.county)
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    const queryString = params.toString()
    return queryString ? `/fleet?${queryString}` : '/fleet'
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen pb-24">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4">
              {activeCountyName ? `Available in ${activeCountyName}` : 'The Inventory'}
            </p>
            <div className="mb-8">
              <h1 className="font-serif text-5xl md:text-6xl text-[#1B3B2F] dark:text-white mb-4">
                The Fleet
              </h1>
              {activeDiscounts && activeDiscounts.length > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-[#9C6B4E]/10 px-4 py-2 text-sm font-medium text-[#9C6B4E]">
                  <span className="text-xs uppercase tracking-wider">Savings</span>
                  <span>Save up to {Math.max(...activeDiscounts.map((discount) => Number(discount.percentage)))}% with our long-rental and early-bird offers.</span>
                </div>
              )}
            </div>
            <QuickSearchClient initialStart={start} initialEnd={end} initialCounty={county} />
          </div>

          {/* Dynamic Category Filter (Hidden if searching a specific county to reduce clutter) */}
          <div className="flex gap-3 mb-12 flex-wrap border-b border-stone-200 pb-8 items-center">
            <span className="text-xs uppercase tracking-wider text-stone-400 mr-2">Filter by Character:</span>
            <Link
              href={buildFleetUrl({ county })}
              className={`px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                !category
                  ? 'bg-[#1B3B2F] text-white border border-[#1B3B2F]'
                  : 'border border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
              }`}
            >
              All
            </Link>
            {categories?.map((cat) => {
              // Preserve the county filter when switching categories
              const href = buildFleetUrl({ county, category: cat.slug })
                
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                    category === cat.slug
                      ? 'bg-[#1B3B2F] text-white border border-[#1B3B2F]'
                      : 'border border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}

            {/* Show "Clear Location" button if a county is active */}
            {county && (
              <Link 
                href={buildFleetUrl({ category })}
                className="ml-auto text-xs text-[#9C6B4E] border-b border-[#9C6B4E] pb-0.5 hover:text-[#1B3B2F] hover:border-[#1B3B2F] transition"
              >
                Clear Location (View All Kenya)
              </Link>
            )}
          </div>

          {/* Car Grid */}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {cars.map((car) => {
                const carParams = new URLSearchParams()
                if (start) carParams.set('start', start)
                if (end) carParams.set('end', end)
                const carQuery = carParams.toString()
                const dailyRate = Number(String(car.price_per_day).replace(/,/g, '')) || 0

                return (
                <Link key={car.id} href={`/cars/${encodeURIComponent(car.slug)}${carQuery ? `?${carQuery}` : ''}`} className="group block">
                  <div className="aspect-[4/3] bg-stone-200 overflow-hidden mb-5 relative">
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
                    {/* County Badge on the image */}
                    {car.county && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs uppercase tracking-wider text-[#1B3B2F]">
                        {car.county}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-2">
                        {car.categories?.name}
                      </p>
                      <h3 className="font-serif text-xl text-[#1B3B2F] group-hover:text-[#9C6B4E] transition-colors">
                        {car.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1" aria-label={`${car.rating || 5} out of 5 stars`}>
                        <div className="flex text-[#9C6B4E] text-sm" aria-hidden="true">
                          {'★'.repeat(Math.max(0, Math.min(5, Math.round(car.rating || 5))))}
                          {'☆'.repeat(5 - Math.max(0, Math.min(5, Math.round(car.rating || 5))))}
                        </div>
                        <span className="text-xs text-stone-400">({car.review_count || 0})</span>
                      </div>
                      <p className="text-sm text-stone-500 mt-1">
                        {car.transmission} · {car.seats} seats
                      </p>
                      {car.top_speed && (
                        <p className="text-sm text-stone-500 mt-1">Top speed: {car.top_speed}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {days > 0 ? (
                        <>
                          <p className="font-serif text-lg text-[#1B3B2F] dark:text-white">
                            KSh {(dailyRate * days).toLocaleString()}
                          </p>
                          <p className="text-xs text-stone-400">total for {days} days</p>
                        </>
                      ) : (
                        <>
                          <p className="font-serif text-lg text-[#1B3B2F] dark:text-white">
                            KSh {dailyRate.toLocaleString()}
                          </p>
                          <p className="text-xs text-stone-400">/ day</p>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          ) : (
            <div className="py-24 text-center border border-stone-200 bg-white">
              <p className="text-stone-500 font-serif text-2xl mb-4">
                No vehicles found {county ? `in ${activeCountyName}` : 'in this category'}.
              </p>
              <Link href="/fleet" className="text-[#9C6B4E] border-b border-[#9C6B4E] pb-1 hover:text-[#1B3B2F] hover:border-[#1B3B2F] transition">
                View all vehicles across Kenya
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}