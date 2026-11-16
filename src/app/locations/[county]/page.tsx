import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const validCounties = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret']

export default async function LocationPage({ params }: { params: Promise<{ county: string }> }) {
  const { county } = await params
  
  // Validate the county to prevent random URLs
  if (!validCounties.includes(county.toLowerCase())) notFound()

  const countyName = county.charAt(0).toUpperCase() + county.slice(1)
  const supabase = await createClient()
  
  const { data: cars } = await supabase
    .from('cars')
    .select('*, categories(name)')
    .eq('county', county.toLowerCase())
    .eq('is_available', true)

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] dark:bg-[#111111] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24">
          
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4">Car Hire in {countyName}</p>
            <h1 className="font-serif text-5xl md:text-6xl text-[#1B3B2F] dark:text-white">
              Premium Fleet in {countyName}
            </h1>
            <p className="text-stone-600 dark:text-stone-400 mt-6 max-w-2xl text-lg">
              Whether you are arriving at the airport, heading to a corporate meeting, or exploring the sights of {countyName}, Royal Umbrella provides the perfect vehicle. Book directly online with instant confirmation.
            </p>
          </div>

          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cars.map((car) => (
                <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-stone-200 dark:bg-[#1A1A1A] overflow-hidden mb-4 rounded-lg">
                    <img
                      src={car.hero_image_url}
                      alt={car.name}
                      className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>
                  <h3 className="font-serif text-xl text-[#1B3B2F] dark:text-white">{car.name}</h3>
                  <p className="text-sm text-stone-500 mt-1">KSh {Number(car.price_per_day).toLocaleString()} / day</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white dark:bg-[#1A1A1A] rounded-lg border border-stone-200 dark:border-stone-800">
              <p className="text-stone-500 text-lg">No vehicles currently available in {countyName}.</p>
              <Link href="/fleet" className="text-[#9C6B4E] hover:underline mt-4 inline-block">View our entire fleet</Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}