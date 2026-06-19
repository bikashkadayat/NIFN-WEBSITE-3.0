import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ContactForm } from '@/components/forms/ContactForm'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface SettingsMap {
  [key: string]: string | number | boolean | undefined
}

async function fetchSettings(): Promise<SettingsMap> {
  try {
    const res = await fetch(`${API_URL}/v1/settings/public`, { next: { revalidate: 300 } })
    return res.json()
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us | NIFN',
    description: 'Get in touch with the Nepal Interledger Financial Network.',
  }
}

export default async function ContactPage() {
  const settings = await fetchSettings()

  const email = (settings.contact_email as string) || 'info@nifn.org.np'
  const phone = (settings.contact_phone as string) || ''
  const address = (settings.contact_address as string) || 'Kathmandu, Nepal'
  const facebook = settings.facebook_url as string
  const twitter = settings.twitter_url as string
  const linkedin = settings.linkedin_url as string

  return (
    <>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact' },
            ]}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Form */}
            <div className="lg:w-3/5">
              <ContactForm />
            </div>

            {/* Info */}
            <div className="lg:w-2/5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <a href={`mailto:${email}`} className="text-sm text-gray-600 hover:text-cyan-600">{email}</a>
                      </div>
                    </div>
                    {phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <a href={`tel:${phone}`} className="text-sm text-gray-600 hover:text-cyan-600">{phone}</a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {(facebook || twitter || linkedin) && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex gap-3">
                      {facebook && (
                        <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-cyan-100 flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-colors">
                          <Facebook className="w-5 h-5" />
                        </a>
                      )}
                      {twitter && (
                        <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-cyan-100 flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-cyan-100 flex items-center justify-center text-gray-600 hover:text-cyan-600 transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
