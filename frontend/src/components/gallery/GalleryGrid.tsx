'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Lightbox } from '@/components/ui/Lightbox'
import type { GalleryDetailImage } from '@/types'

interface GalleryGridProps {
  images: GalleryDetailImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const lightboxImages = images.map((img) => ({
    src: img.url,
    caption: img.caption || '',
  }))

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <Image
              src={img.url}
              alt={img.caption || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className={clsx(
              'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors'
            )} />
          </button>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
