import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { PartnerCard } from '@/components/ui/PartnerCard'

const PARTNERS = [
  { name: 'Nepal Internet Foundation', type: 'Technology & Governance' },
  { name: 'Interledger Foundation', type: 'Technology' },
  { name: 'Cooperatives', type: 'Financial Services' },
]

export function Partners() {
  return (
    <SectionWrapper bg="navy">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Our Partners & Network
        </h2>
        <p className="text-gray-200 text-lg">
          Together with our partners, we are building an open, interoperable financial network for Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        {PARTNERS.map((p) => (
          <PartnerCard key={p.name} name={p.name} type={p.type} />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/join-network"
          className="px-7 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-colors inline-flex items-center gap-2"
        >
          Become a Partner <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/about"
          className="px-7 py-3 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white/10 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </SectionWrapper>
  )
}
