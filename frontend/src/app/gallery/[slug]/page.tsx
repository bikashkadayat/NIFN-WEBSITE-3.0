import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import type { Gallery } from '@/types'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface GalleryDetailPageProps {
  params: { slug: string }
}

async function fetchGallery(slug: string): Promise<Gallery | null> {
  try {
    const res = await fetch(`${API_URL}/v1/galleries/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  const gallery = await fetchGallery(params.slug)
  if (!gallery) return { title: 'Gallery Not Found | NIFN' }
  return {
    title: `${gallery.title} | Gallery | NIFN`,
    description: gallery.description || '',
  }
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const gallery = await fetchGallery(params.slug)
  if (!gallery) notFound()

  return (
    <>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Gallery', href: '/gallery' },
              { label: gallery.title || '' },
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="text-lg text-white/80 max-w-3xl">{gallery.description}</p>
          )}
          {gallery.image_count !== undefined && (
            <p className="text-white/60 text-sm mt-3">
              {gallery.image_count} {gallery.image_count === 1 ? 'photo' : 'photos'}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {gallery.images && gallery.images.length > 0 ? (
            <GalleryGrid images={gallery.images} />
          ) : (
            <p className="text-center text-gray-500 py-12">No photos in this gallery yet.</p>
          )}

          <div className="mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
