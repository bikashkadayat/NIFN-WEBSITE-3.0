import type { Metadata } from 'next'
import { ImageIcon } from 'lucide-react'
import { GalleryCard } from '@/components/ui/GalleryCard'
import type { Gallery } from '@/types'
import { fetchContent } from '@/lib/content-fetch'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

async function fetchGalleries(): Promise<Gallery[]> {
  try {
    const res = await fetch(`${API_URL}/v1/galleries`, { next: { revalidate: 60, tags: ["galleries"] } })
    const json = await res.json()
    return (json?.data || []).map((g: any) => ({
      ...g,
      cover_image: g.cover_image_url ? { url: g.cover_image_url } : undefined,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ searchParams }: { searchParams?: { locale?: string } }): Promise<Metadata> {
  const content = await fetchContent('gallery-hero', searchParams?.locale)
  return {
    title: content?.seo_title || content?.title || 'Photo Gallery | NIFN',
    description: content?.seo_description || content?.excerpt || 'Browse photos from Nepal Interledger Financial Network events and activities.',
  }
}

export default async function GalleryListPage({ searchParams }: { searchParams?: { locale?: string } }) {
  const [galleries, heroContent] = await Promise.all([
    fetchGalleries(),
    fetchContent('gallery-hero', searchParams?.locale),
  ])

  return (
    <>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {heroContent?.title || 'Photo Gallery'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {heroContent?.excerpt || 'Explore moments from NIFN events, workshops, and community gatherings.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {galleries.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No galleries yet</h2>
              <p className="text-gray-400">Check back soon for photo galleries.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((gallery) => (
                <GalleryCard key={gallery.id} gallery={gallery} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
