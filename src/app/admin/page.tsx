import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminOverview() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Fetch stats
  const { count: carCount } = await supabase.from('cars').select('*', { count: 'exact', head: true })
  const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
  
  const { data: bookings } = await supabase.from('bookings').select('total_price, status')
  
  // Calculate total revenue from confirmed/pending bookings
  const revenue = bookings?.reduce((sum, b) => b.status !== 'cancelled' ? sum + Number(b.total_price) : sum, 0) || 0

  const formattedRevenue = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(revenue)

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">Dashboard Overview</h1>
      <p className="text-stone-500 mb-10">Welcome back. Here is what is happening with Royal Umbrella.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat Cards */}
        <div className="bg-white p-8 border border-stone-200">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Total Vehicles</p>
          <p className="font-serif text-4xl text-[#1B3B2F]">{carCount || 0}</p>
        </div>
        <div className="bg-white p-8 border border-stone-200">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Total Bookings</p>
          <p className="font-serif text-4xl text-[#1B3B2F]">{bookingCount || 0}</p>
        </div>
        <div className="bg-[#1B3B2F] text-white p-8 border border-[#1B3B2F]">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Projected Revenue</p>
          <p className="font-serif text-4xl">{formattedRevenue}</p>
        </div>
      </div>
    </div>
  )
}