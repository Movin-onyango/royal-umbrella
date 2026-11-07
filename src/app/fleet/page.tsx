import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'


export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  // 1. Fetch all categories for the filter buttons
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

  // 2. Fetch cars (filtered by category if one is selected in the URL)
  let query = supabase
    .from('cars')
    .select('*, categories(name, slug)')
    .eq('is_available', true)

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

  const { data: cars } = await query

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen pb-24">
        <div className="max-w-6xl mx-auto px-6 pt-20">
          
          {/* Header */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4">
              The Inventory
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[#1B3B2F]">
              The Fleet
            </h1>
          </div>

          {/* Dynamic Category Filter */}
          <div className="flex gap-3 mb-12 flex-wrap border-b border-stone-200 pb-8">
            <Link
              href="/fleet"
              className={`px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                !category
                  ? 'bg-[#1B3B2F] text-white border border-[#1B3B2F]'
                  : 'border border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
              }`}
            >
              All Vehicles
            </Link>
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/fleet?category=${cat.slug}`}
                className={`px-6 py-2 rounded-full text-sm transition-colors duration-300 ${
                  category === cat.slug
                    ? 'bg-[#1B3B2F] text-white border border-[#1B3B2F]'
                    : 'border border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Car Grid */}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {cars.map((car) => (
                <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
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
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-2">
                        {car.categories?.name}
                      </p>
                      <h3 className="font-serif text-xl text-[#1B3B2F] group-hover:text-[#9C6B4E] transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        {car.transmission} · {car.seats} seats
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
          ) : (
            <div className="py-24 text-center">
              <p className="text-stone-500 font-serif text-2xl">No vehicles found in this category.</p>
              <Link href="/fleet" className="text-[#9C6B4E] mt-4 inline-block border-b border-[#9C6B4E]">
                View all vehicles
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}