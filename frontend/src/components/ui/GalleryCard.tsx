import React from 'react'
import Link from 'next/link'
import { Image as ImageIcon } from 'lucide-react'
import { Card } from './Card'
import { PlaceholderImage } from './PlaceholderImage'
import type { Gallery } from '@/types'

interface GalleryCardProps {
  gallery: Gallery
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  const title = gallery.translations?.find(t => t.locale === 'en')?.title || gallery.title || ''
  const slug = gallery.translations?.find(t => t.locale === 'en')?.slug || gallery.slug || ''
  const imageCount = gallery.gallery_images?.length ?? 0
  const coverUrl = gallery.cover_image?.url || gallery.gallery_images?.[0]?.media?.url

  return (
    <Link href={`/gallery/${slug}`} className="block group">
      <Card className="overflow-hidden relative" hover={false}>
        <div className="aspect-[4/3] overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-bold text-lg leading-tight mb-1">{title}</h3>
          <span className="inline-flex items-center gap-1 text-white/80 text-xs">
            <ImageIcon className="w-3.5 h-3.5" />
            {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </Card>
    </Link>
  )
}