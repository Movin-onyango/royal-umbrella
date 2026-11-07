import Link from 'next/link'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'
import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: car } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_available', true)
    .single()

  if (!car) notFound()

  return (
    <main className="min-h-screen bg-[#F7F5F2]">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <Link
          href="/fleet"
          className="text-sm text-stone-500 hover:text-[#1B3B2F] transition"
        >
          ← The Fleet
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <div className="aspect-[4/3] bg-stone-200 overflow-hidden">
            {car.hero_image_url ? (
              <img
                src={car.hero_image_url}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                Image coming soon
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-3">
              {car.categories?.name}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">
              {car.name}
            </h1>
            <p className="mt-4 text-stone-600 leading-relaxed">
              {car.description}
            </p>

            <div className="grid grid-cols-2 gap-4 border-y border-stone-200 py-6 mt-8 text-sm">
              <p className="text-stone-600">{car.transmission}</p>
              <p className="text-stone-600">{car.seats} seats</p>
              <p className="text-stone-600">{car.fuel_type}</p>
              <p className="text-stone-600">${car.price_per_day} / day</p>
            </div>

            <h2 className="font-serif text-2xl text-[#1B3B2F] mt-8">
              Reserve this vehicle
            </h2>
            <BookingForm carId={car.id} pricePerDay={car.price_per_day} />
          </div>
        </div>
      </div>
    </main>
  )
}