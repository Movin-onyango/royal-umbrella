import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch the user's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, cars(name, hero_image_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="font-serif text-4xl text-[#1B3B2F] mb-2">My Account</h1>
            <p className="text-stone-500">Welcome back, {user.user_metadata?.full_name || user.email}</p>
          </div>

          <h2 className="font-serif text-2xl text-[#1B3B2F] mb-6">My Bookings</h2>
          
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-stone-200 p-6 flex flex-col md:flex-row items-center gap-6">
                  {booking.cars?.hero_image_url && (
                    <img src={booking.cars.hero_image_url} alt={booking.cars.name} className="w-full md:w-48 h-32 object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-[#9C6B4E] mb-1">
                      {booking.status}
                    </p>
                    <h3 className="font-serif text-xl text-[#1B3B2F]">{booking.cars?.name}</h3>
                    <p className="text-sm text-stone-500 mt-2">
                      {new Date(booking.start_date).toLocaleDateString('en-GB')} to {new Date(booking.end_date).toLocaleDateString('en-GB')}
                    </p>
                    <p className="font-medium mt-2">KSh {Number(booking.total_price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 p-12 text-center">
              <p className="text-stone-500 mb-6">You have no bookings yet.</p>
              <Link href="/fleet" className="bg-[#1B3B2F] text-white px-6 py-3 rounded-full text-sm hover:bg-[#9C6B4E] transition">
                Explore the Fleet
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}