import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function ContactPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()

  const whatsappNumber = data?.whatsapp_number || '254700000000'
  const email = data?.contact_email || 'hello@royalumbrella.com'
  
  // Create the WhatsApp link with a pre-filled message
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20Royal%20Umbrella,%20I%20would%20like%20to%20inquire%20about%20a%20car%20hire.`

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F5F2] min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9C6B4E] mb-6">Get in Touch</p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#1B3B2F] mb-8">
            We are here.
          </h1>
          <p className="text-lg text-stone-600 max-w-lg mx-auto mb-12">
            Have a question about a vehicle, or need help with a booking? Our concierge is ready to assist you.
          </p>

          <div className="bg-white border border-stone-200 p-10 md:p-16 max-w-2xl mx-auto shadow-sm">
            <h2 className="font-serif text-2xl text-[#1B3B2F] mb-4">Chat with us on WhatsApp</h2>
            <p className="text-sm text-stone-500 mb-8">Click the button below to start a conversation. We usually reply within minutes.</p>
            
            {/* THE WHATSAPP BUTTON */}
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-[#25D366] text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-[#1EBE5D] transition-all shadow-lg hover:shadow-xl"
            >
              {/* WhatsApp Icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Message Us on WhatsApp
            </a>

            <div className="mt-12 pt-8 border-t border-stone-100">
              <p className="text-xs uppercase tracking-wider text-stone-400 mb-2">Or email us directly</p>
              <a href={`mailto:${email}`} className="text-xl font-serif text-[#1B3B2F] hover:text-[#9C6B4E] transition">
                {email}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}