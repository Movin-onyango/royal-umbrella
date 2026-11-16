import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CarGallery from '@/components/CarGallery'
import EngineSound from '@/components/EngineSound'
import ReviewForm from '@/components/ReviewForm'
import BookingForm, { type Discount } from './BookingForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: car } = await supabase
    .from('cars')
    .select('name, description, county, price_per_day, hero_image_url')
    .eq('slug', slug)
    .eq('is_available', true)
    .maybeSingle()

  if (!car) return { title: 'Vehicle Not Found | Royal Umbrella' }

  const title = `${car.name} | Royal Umbrella`
  const description = (car.description || '').slice(0, 160)
  const shareDescription = `Rent the ${car.name} in ${car.county || 'Kenya'}. KSh ${Number(car.price_per_day).toLocaleString()} per day.`
  const image = car.hero_image_url ? [{ url: car.hero_image_url, width: 1200, height: 630, alt: car.name }] : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description: shareDescription,
      url: `/cars/${encodeURIComponent(slug)}`,
      type: 'website',
      images: image,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description: shareDescription,
      images: image?.map((item) => item.url),
    },
  }
}

export default async function CarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ start?: string; end?: string }>
}) {
  const { slug } = await params
  const { start, end } = await searchParams
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('slug', slug)
    .eq('is_available', true)
    .single()

  const { data: discounts } = await supabase
    .from('discounts')
    .select('id, name, type, min_days, min_days_in_advance, percentage')
    .eq('is_active', true)

  if (!car) notFound()

  const { data: reviews } = await supabase
    .from('car_reviews')
    .select('id, customer_name, rating, comment, created_at')
    .eq('car_id', car.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const rating = Math.max(0, Math.min(5, Math.round(car.rating || 5)))

  const specsList = [
    ...(car.brand ? [{ key: 'Brand', value: car.brand }] : []),
    ...(car.model ? [{ key: 'Model', value: car.model }] : []),
    ...(car.top_speed ? [{ key: 'Top Speed', value: car.top_speed }] : []),
    { key: 'Transmission', value: car.transmission },
    { key: 'Seats', value: car.seats },
    { key: 'Fuel Type', value: car.fuel_type },
    ...(car.specs || []),
  ].filter((spec) => spec.key && spec.value)

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] dark:bg-[#111111] min-h-screen pb-24 transition-colors duration-300">
        <EngineSound />
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <Link
            href={start || end ? `/fleet?${new URLSearchParams({ ...(start ? { start } : {}), ...(end ? { end } : {}) })}` : '/fleet'}
            className="text-sm text-stone-500 hover:text-[#1B3B2F] dark:hover:text-white transition mb-8 inline-block"
          >
            ← Back to Fleet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-3">
                {car.categories?.name}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#1B3B2F] dark:text-white mb-4">
                {car.name}
              </h1>

              <CarGallery
                key={car.id}
                heroImage={car.hero_image_url}
                gallery={car.gallery_urls || []}
                modelUrl={`/models/${car.slug}.glb`}
                soundUrl="/sounds/engine-rev.mp3.mp3"
                fallbackAlt={car.name}
              />

              <div className="mt-4 flex items-center justify-between bg-white dark:bg-[#1A1A1A] p-4 rounded-lg border border-stone-200 dark:border-stone-800">
                <div>
                  <p className="font-serif text-3xl text-[#1B3B2F] dark:text-white">
                    KSh {Number(car.price_per_day).toLocaleString()}
                  </p>
                  <p className="text-sm text-stone-500">per day</p>
                </div>
                <div className="text-right">
                  <div className="flex text-[#9C6B4E] text-lg justify-end" aria-label={`${rating} out of 5 stars`}>
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">{car.review_count || 0} reviews</p>
                </div>
              </div>

              {discounts && discounts.length > 0 && (
                <div className="mt-4 rounded-lg border border-[#9C6B4E]/30 bg-[#9C6B4E]/10 p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9C6B4E]">Available Savings</h3>
                  <ul className="space-y-1">
                    {discounts.map((discount) => (
                      <li key={discount.id} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
                        <span className="text-[#9C6B4E]" aria-hidden="true">✓</span>
                        {discount.type === 'long_rental'
                          ? `Rent for ${discount.min_days}+ days and save ${discount.percentage}% instantly.`
                          : `Book ${discount.min_days_in_advance}+ days in advance and save ${discount.percentage}%.`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8">
                <h2 className="font-serif text-xl text-[#1B3B2F] dark:text-white mb-3">About this vehicle</h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                  {car.description}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#1A1A1A] rounded-xl p-8 border border-stone-800 shadow-2xl">
                <h3 className="font-serif text-2xl text-white mb-6">Specifications</h3>

                <div className="space-y-4">
                  {specsList.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-stone-800 pb-4 last:border-0 last:pb-0"
                    >
                      <span className="text-stone-400 text-sm">{spec.key}</span>
                      <span className="text-white font-medium text-sm text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-8 border border-stone-200 dark:border-stone-800">
                <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white mb-2">
                  Reserve this vehicle
                </h2>
                <p className="text-xs text-stone-500 mb-6">Secure your dates. Pay via M-Pesa upon confirmation.</p>
                <BookingForm
                  carId={car.id}
                  pricePerDay={car.price_per_day}
                  discounts={(discounts ?? []) as Discount[]}
                  initialStart={start}
                  initialEnd={end}
                />
              </div>

              <section className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-800">
                <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {reviews?.map((review) => {
                    const reviewRating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)))
                    return (
                      <article key={review.id} className="bg-white dark:bg-[#1A1A1A] p-5 rounded-lg border border-stone-200 dark:border-stone-800">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-[#1B3B2F] dark:text-white">{review.customer_name}</p>
                          <div className="flex text-[#9C6B4E]" aria-label={`${reviewRating} out of 5 stars`}>
                            {'★'.repeat(reviewRating)}{'☆'.repeat(5 - reviewRating)}
                          </div>
                        </div>
                        <p className="text-sm text-stone-600 dark:text-stone-400">{review.comment}</p>
                        <p className="text-xs text-stone-400 mt-3">
                          {new Date(review.created_at).toLocaleDateString('en-GB')}
                        </p>
                      </article>
                    )
                  })}
                  {(!reviews || reviews.length === 0) && (
                    <p className="text-stone-500 text-sm">No reviews yet for this vehicle. Be the first to rent it!</p>
                  )}
                </div>
                <ReviewForm carId={car.id} />
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}