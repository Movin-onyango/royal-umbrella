import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceIcon from '@/components/ServiceIcon'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('id, title, description, icon, display_order')
    .order('display_order')

  return (
    <>
      <Navbar />
      <main className="bg-[#111111] text-white min-h-screen">
        
        {/* Header */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-4">What We Offer</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white">Services built around you</h1>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services?.map((service, i) => (
              <div key={service.id} className="border-t border-stone-800 pt-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-sm font-mono text-[#9C6B4E]">0{i + 1}</span>
                  <ServiceIcon name={service.icon} className="h-5 w-5 text-[#9C6B4E]" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-4">{service.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
            {(!services || services.length === 0) && (
              <p className="col-span-4 text-stone-500">Services are being updated. Please check back later.</p>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}