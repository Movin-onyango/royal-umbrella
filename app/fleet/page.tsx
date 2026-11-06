import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')

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
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data: cars } = await query

  return (
    <main className="bg-[#F7F5F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-serif text-5xl text-[#1B3B2F] mb-4">The Fleet</h1>
        <p className="text-stone-500 mb-12">
          Every vehicle in the Royal Umbrella collection.
        </p>

        {/* Category filter */}
        <div className="flex gap-3 mb-12 flex-wrap">
          <Link
            href="/fleet"
            className={`px-5 py-2 rounded-full border text-sm transition ${
              !category
                ? 'bg-[#1B3B2F] text-white border-[#1B3B2F]'
                : 'border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
            }`}
          >
            All
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/fleet?category=${cat.slug}`}
              className={`px-5 py-2 rounded-full border text-sm transition ${
                category === cat.slug
                  ? 'bg-[#1B3B2F] text-white border-[#1B3B2F]'
                  : 'border-stone-300 text-stone-600 hover:border-[#1B3B2F]'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Car grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars?.map((car) => (
            <Link key={car.id} href={`/cars/${car.slug}`} className="group">
              <div className="aspect-[4/3] bg-stone-200 mb-4 overflow-hidden">
                {car.hero_image_url && (
                  <img
                    src={car.hero_image_url}
                    alt={car.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                  />
                )}
              </div>
              <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-1">
                {car.categories?.name}
              </p>
              <h3 className="font-serif text-xl text-[#1B3B2F]">{car.name}</h3>
              <p className="text-sm text-stone-500">
                {car.transmission} · {car.seats} seats · From ${car.price_per_day}/day
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}