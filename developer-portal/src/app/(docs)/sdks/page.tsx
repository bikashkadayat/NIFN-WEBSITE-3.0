import { fetchDeveloperSdks } from '@/lib/api'
import type { Metadata } from 'next'
import { SdkCard } from '@/components/sdks/SdkCard'
import { ComingSoon } from '@/components/docs/ComingSoon'

export const metadata: Metadata = {
  title: 'SDKs & Libraries',
  description: 'Official SDKs, client libraries, and tools for integrating with the NIF payment network.',
}

export default async function SdksPage() {
  const sdks = await fetchDeveloperSdks()

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">SDKs & Libraries</h1>
      <p className="text-lg text-gray-500 mb-12">
        Official SDKs, client libraries, and tools for integrating with the NIF.
      </p>

      {sdks.length === 0 ? (
        <ComingSoon title="SDKs & Libraries" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sdks.map((sdk) => (
            <SdkCard key={sdk.id} sdk={sdk} />
          ))}
        </div>
      )}
    </div>
  )
}
