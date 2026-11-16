import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminOverview() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Fetch stats
  const { count: carCount } = await supabase.from('cars').select('*', { count: 'exact', head: true })
  const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
  const { data: cars } = await supabase.from('cars').select('rating, review_count').eq('is_available', true)
  
  const { data: bookings } = await supabase.from('bookings').select('total_price, status')
  const { data: partials } = await supabase
    .from('partial_bookings')
    .select('id, email, car_id, start_date, end_date, created_at, cars(name)')
    .order('created_at', { ascending: false })
    .limit(5)
  
  // Calculate total revenue from confirmed/pending bookings
  const revenue = bookings?.reduce((sum, b) => b.status !== 'cancelled' ? sum + Number(b.total_price) : sum, 0) || 0

  const formattedRevenue = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(revenue)
  const ratedCars = (cars ?? []).filter((car) => typeof car.rating === 'number')
  const averageRating = ratedCars.length
    ? (ratedCars.reduce((sum, car) => sum + car.rating, 0) / ratedCars.length).toFixed(1)
    : '0.0'
  const reviewCount = (cars ?? []).reduce((sum, car) => sum + (car.review_count ?? 0), 0)

  return (
    <div className="pb-24">
      <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Dashboard Overview</h1>
      <p className="text-stone-500 mb-10">Welcome back. Here is what is happening with Royal Umbrella.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {/* Stat Cards */}
        <div className="bg-white dark:bg-[#1A1A1A] p-8 border border-stone-200 dark:border-stone-800 rounded-lg">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Total Vehicles</p>
          <p className="font-serif text-4xl text-[#1B3B2F]">{carCount || 0}</p>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] p-8 border border-stone-200 dark:border-stone-800 rounded-lg">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Total Bookings</p>
          <p className="font-serif text-4xl text-[#1B3B2F]">{bookingCount || 0}</p>
        </div>
        <div className="bg-[#1B3B2F] text-white p-8 border border-[#1B3B2F] rounded-lg">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Projected Revenue</p>
          <p className="font-serif text-4xl">{formattedRevenue}</p>
        </div>
        <Link href="/admin/cars" className="bg-white dark:bg-[#1A1A1A] p-8 border border-stone-200 dark:border-stone-800 rounded-lg hover:border-[#9C6B4E] transition-colors">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Fleet Rating</p>
          <p className="font-serif text-4xl text-[#1B3B2F]">{averageRating} <span className="text-[#9C6B4E]">★</span></p>
          <p className="text-sm text-stone-500 mt-2">{reviewCount} reviews · Manage cars</p>
        </Link>
      </div>

      <section className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl text-[#1B3B2F] dark:text-white">Abandoned Bookings</h2>
          <p className="text-sm text-stone-500">Recent customers who entered their email but didn’t finish a reservation.</p>
        </div>

        {partials && partials.length > 0 ? (
          <div className="space-y-4">
            {partials.map((partial) => {
              const carName = partial.cars?.[0]?.name || 'a vehicle'
              const subject = encodeURIComponent('Your Royal Umbrella Booking')
              const body = encodeURIComponent(`Hi there,\n\nWe noticed you were looking at the ${carName} from ${partial.start_date} to ${partial.end_date}. It is still available. Let us know if you need help completing your booking.`)

              return (
                <div key={partial.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-md border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-[#111111]">
                  <div>
                    <p className="font-medium text-[#1B3B2F] dark:text-white">{partial.email}</p>
                    <p className="text-sm text-stone-500">
                      Interested in <span className="font-medium">{carName}</span> from {partial.start_date} to {partial.end_date}
                    </p>
                  </div>
                  <a
                    href={`mailto:${encodeURIComponent(partial.email)}?subject=${subject}&body=${body}`}
                    className="shrink-0 rounded bg-[#9C6B4E] px-4 py-2 text-xs text-white transition hover:bg-[#1B3B2F]"
                  >
                    Email Customer
                  </a>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No abandoned bookings yet.</p>
        )}
      </section>
    </div>
  )
}