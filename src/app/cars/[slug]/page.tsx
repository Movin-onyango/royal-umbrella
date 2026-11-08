import Link from 'next/link'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

  // Format the price into Kenyan Shillings (e.g., 15000 -> 15,000)
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(car.price_per_day)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F5F2] pb-24">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/fleet"
            className="text-sm text-stone-500 hover:text-[#1B3B2F] transition"
          >
            ← Back to Fleet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            {/* Car Image */}
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

            {/* Car Details & Booking */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C87A4A] mb-3">
                {car.categories?.name}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#1B3B2F]">
                {car.name}
              </h1>
              <p className="mt-4 text-stone-600 leading-relaxed text-lg">
                {car.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-y border-stone-200 py-6 mt-8">
                <div>
                  <p className="text-xs uppercase text-stone-400 mb-1">Year</p>
                  <p className="text-[#1B3B2F] font-medium">{car.year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-400 mb-1">Transmission</p>
                  <p className="text-[#1B3B2F] font-medium">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-400 mb-1">Seats</p>
                  <p className="text-[#1B3B2F] font-medium">{car.seats}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-400 mb-1">Fuel</p>
                  <p className="text-[#1B3B2F] font-medium">{car.fuel_type}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-stone-400 mb-1">Location</p>
                  <p className="text-[#1B3B2F] font-medium">
                    {car.location || 'Confirm on booking'}
                  </p>
                </div>
              </div>

              {/* Price & Booking Form */}
              <div className="mt-8 bg-white p-6 border border-stone-200">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-sm text-stone-500">Rate per day</p>
                    <p className="font-serif text-3xl text-[#1B3B2F]">
                      {formattedPrice}
                    </p>
                  </div>
                  <p className="text-xs text-stone-400 text-right max-w-[150px]">
                    Pay securely via M-Pesa or Card upon confirmation.
                  </p>
                </div>
                
                <BookingForm carId={car.id} pricePerDay={car.price_per_day} />
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}