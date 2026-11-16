import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: features } = await supabase.from('features').select('*').order('display_order')
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('display_order')

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen">
        
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">About Us</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1B3B2F] leading-tight">
            Trusted by Families & Travelers.
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mt-6">
            Every journey is an opportunity to deliver exceptional comfort, reliability, and personalized chauffeur service.
          </p>
        </section>

        {/* Features Grid (The dark section) */}
        <section className="bg-[#111111] text-white py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-center mb-16">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features?.map((feature) => (
                <div key={feature.id} className="bg-[#1A1A1A] border border-stone-800 p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#9C6B4E]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#9C6B4E] capitalize">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
                    <p className="text-sm text-stone-400 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl text-[#1B3B2F] text-center mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((t) => (
              <div key={t.id} className="bg-white p-8 border border-stone-200 shadow-sm relative">
                <div className="flex items-center gap-4 mb-6">
                  {t.image_url ? (
                    <img src={t.image_url} alt={t.client_name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1B3B2F] text-white flex items-center justify-center font-serif text-xl">
                      {t.client_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif text-xl text-[#1B3B2F]">{t.client_name}</h4>
                    <p className="text-xs text-stone-500">{t.client_title}</p>
                  </div>
                </div>
                <div className="flex text-[#9C6B4E] mb-4">
                  {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-stone-600 italic">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
            {(!testimonials || testimonials.length === 0) && (
              <p className="col-span-3 text-center text-stone-500">No testimonials added yet. Add them in the Admin Dashboard.</p>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}