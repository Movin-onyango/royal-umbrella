import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminAnalytics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Fetch all cars and all bookings to calculate stats
  const { data: cars } = await supabase.from('cars').select('id, name, price_per_day')
  const { data: bookings } = await supabase.from('bookings').select('car_id, total_price, status')

  // Calculate Revenue and Booking counts per car
  const carStats = cars?.map(car => {
    const carBookings = bookings?.filter(b => b.car_id === car.id && b.status !== 'cancelled') || []
    const totalRevenue = carBookings.reduce((sum, b) => sum + Number(b.total_price), 0)
    const totalBookings = carBookings.length
    
    return {
      ...car,
      revenue: totalRevenue,
      bookings: totalBookings,
    }
  }).sort((a, b) => b.revenue - a.revenue) // Sort by highest revenue

  // Overall Stats
  const totalRevenue = carStats?.reduce((sum, c) => sum + c.revenue, 0) || 0
  const topCar = carStats?.[0]

  return (
    <div className="max-w-5xl pb-24">
      <h1 className="font-serif text-4xl text-[#1B3B2F] dark:text-white mb-2">Fleet Analytics</h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Business intelligence to see which vehicles are driving your revenue.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white dark:bg-[#1A1A1A] p-8 border border-stone-200 dark:border-stone-800 rounded-lg">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Total Realized Revenue</p>
          <p className="font-serif text-4xl text-[#1B3B2F] dark:text-white">
            KSh {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1B3B2F] text-white p-8 border border-[#1B3B2F] rounded-lg">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Top Performing Vehicle</p>
          <p className="font-serif text-3xl">{topCar?.name || 'N/A'}</p>
          <p className="text-[#E5C38A] mt-2">KSh {topCar?.revenue.toLocaleString()} earned</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 dark:bg-[#111111] text-stone-500 uppercase tracking-widest text-xs border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="p-4 font-normal">Vehicle</th>
              <th className="p-4 font-normal">Daily Rate</th>
              <th className="p-4 font-normal">Total Bookings</th>
              <th className="p-4 font-normal">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {carStats?.map((car) => (
              <tr key={car.id} className="hover:bg-stone-50 dark:hover:bg-stone-900">
                <td className="p-4 font-medium text-[#1B3B2F] dark:text-white">{car.name}</td>
                <td className="p-4 text-stone-600 dark:text-stone-400">KSh {Number(car.price_per_day).toLocaleString()}</td>
                <td className="p-4 text-stone-600 dark:text-stone-400">{car.bookings}</td>
                <td className="p-4 font-medium text-[#9C6B4E]">KSh {car.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}