import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { ContentData } from '@/lib/content-fetch'

interface CallToActionProps {
  content?: ContentData | null
}

export function CallToAction({ content }: CallToActionProps) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-[#0F172A] via-[#1e3a5f] to-[#0891b2cc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {content?.title || "Ready to Join Nepal's Open Payment Network?"}
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
          {content?.excerpt || "Whether you're a cooperative, a developer, or an organization, there's a place for you in the NIFN ecosystem."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/join-network"
            className="px-7 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-colors inline-flex items-center gap-2"
          >
            Join as Cooperative <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white/10 transition-colors"
          >
            Partner with Us
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_DEVELOPER_PORTAL_URL || 'https://developers.nifn.org.np'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 text-white/80 hover:text-white font-semibold transition-colors inline-flex items-center gap-2"
          >
            Developer Portal <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
