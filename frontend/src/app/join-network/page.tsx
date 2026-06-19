import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { JoinNetworkForm } from '@/components/forms/JoinNetworkForm'
import { fetchContent } from '@/lib/content-fetch'
import { CheckCircle2, Clock, Mail, Phone, Shield, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { locale?: string }
}): Promise<Metadata> {
  const content = await fetchContent('join-network', searchParams?.locale)
  return {
    title: content?.seo_title || 'Join the Network | NIFN',
    description:
      content?.seo_description ||
      content?.excerpt ||
      "Apply to join Nepal's open payment infrastructure as a member institution.",
  }
}

export default async function JoinNetworkPage({
  searchParams,
}: {
  searchParams: { locale?: string }
}) {
  const content = await fetchContent('join-network', searchParams?.locale)

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: content?.title || 'Join Network' },
            ]}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            {content?.title || 'Join the Network'}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mb-8">
            {content?.excerpt ||
              "Become part of Nepal's open payment infrastructure. Apply to join the NIFN network as a member institution."}
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: Shield, label: 'NRB Compliant' },
              { icon: Zap, label: 'Open Interledger Protocol' },
              { icon: CheckCircle2, label: '3-Day Review' },
            ].map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ APPLICATION FORM SECTION ============ */}
      <section
        id="application-form"
        className="py-16 md:py-20 bg-gray-50 scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
              Membership Application
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Apply to Join NIFN
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete the application below. Our partnerships team will review your
              submission and respond within{' '}
              <strong className="text-gray-900">3 business days</strong>.
            </p>
          </div>

          {/* Reassurance bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { icon: Clock, label: '~10 minutes to complete' },
              { icon: CheckCircle2, label: 'Auto-saves your progress' },
              { icon: Mail, label: 'Email confirmation' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-cyan-600 shrink-0" />
                {item.label}
              </div>
            ))}
          </div>

          {/* The Form */}
          <JoinNetworkForm
            endpoint="/v1/join-network"
            draftKey="nifn:join-draft"
          />

          {/* Help footer */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/contact"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition">
                <Mail className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Questions before applying?
                </div>
                <div className="text-xs text-gray-500">
                  Contact our partnerships team
                </div>
              </div>
            </a>

            <a
              href="tel:+97714000000"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-cyan-300 hover:shadow-md transition group"
            >
              <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition">
                <Phone className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Prefer to talk first?
                </div>
                <div className="text-xs text-gray-500">+977-1-4000000</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============ OPTIONAL: CMS BENEFITS CONTENT ============ */}
      {content?.body && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-600 prose-img:rounded-xl prose-img:my-8 prose-img:shadow-md prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-a:text-cyan-600 prose-a:underline prose-strong:font-bold prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </div>
        </section>
      )}
    </>
  )
}