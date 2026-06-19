import { SectionWrapper } from '@/components/ui/SectionWrapper'

const VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || ''

export function VideoSection() {
  if (!VIDEO_URL) return null

  return (
    <SectionWrapper bg="navy">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          See NIFN in Action
        </h2>
        <p className="text-gray-200 text-lg">
          Discover how the Nepal Interledger Financial Network is transforming digital payments
          and financial inclusion across Nepal.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={VIDEO_URL}
            title="NIFN Overview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
