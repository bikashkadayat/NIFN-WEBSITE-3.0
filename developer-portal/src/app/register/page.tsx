import type { Metadata } from 'next'
import { DeveloperRegistrationForm } from '@/components/forms/DeveloperRegistrationForm'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Register for Sandbox Access',
  description: 'Get sandbox API credentials and start building on the NIFN payment network.',
}

export default function RegisterPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-cyan-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Get Sandbox Access
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Register for sandbox credentials and start integrating with the NIFN payment network.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
              <DeveloperRegistrationForm />
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-8 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What you&apos;ll receive:
                </h3>
                <ul className="space-y-3">
                  {[
                    'Sandbox API credentials',
                    'Test environment access',
                    'Documentation and SDKs',
                    'Email support',
                    'Discord community access (optional)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
