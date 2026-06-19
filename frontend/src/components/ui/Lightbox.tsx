'use client'

import React from 'react'
import LightboxComponent from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'

interface LightboxImage {
  src: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  if (!isOpen) return null

  const slides = images.map((img) => ({
    src: img.src,
    title: img.caption,
  }))

  return (
    <LightboxComponent
      open={isOpen}
      close={onClose}
      index={initialIndex}
      slides={slides}
      plugins={[Captions, Counter]}
      counter={{ container: { style: { top: 16, right: 60, bottom: 'auto', left: 'auto' } } }}
    />
  )
}