'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import type { Banner } from '@/types'
import type { ContentData } from '@/lib/content-fetch'

interface HeroBannerProps {
  banners: Banner[]
  content?: ContentData | null
}

export function HeroBanner({ banners, content }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)

  const len = banners.length

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % len)
  }, [len])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + len) % len)
  }, [len])

  useEffect(() => {
    if (len <= 1 || isPaused) return
    timerRef.current = setInterval(goNext, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [len, isPaused, goNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  if (len === 0) {
    return (
      <section className="relative h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.2),transparent_60%)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            {content?.title || 'Open. Interoperable.\nInclusive.'}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-cyan-100/90 font-light mb-12 max-w-3xl mx-auto">
            {content?.excerpt || 'Built on the Interledger Protocol'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
            >
              Learn More
            </Link>
            <Link
              href="/join-network"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white/80 hover:bg-white hover:text-slate-900 text-white text-lg font-semibold rounded-full transition-all hover:scale-105"
            >
              Join Network
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    )
  }

  const slide = banners[current]
  const primaryText = slide.primary_button_text || 'Learn More'
  const primaryLink = slide.primary_button_link || '/about'
  const secondaryText = slide.secondary_button_text || 'Join Network'
  const secondaryLink = slide.secondary_button_link || '/contact'
  const alignValue = slide.text_alignment || 'center'
  const alignClasses: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }
  const alignment = alignValue in alignClasses ? alignValue : 'center'

  return (
    <section
      className="relative h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={clsx(
            'absolute inset-0 transition-opacity duration-700',
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {b.image_url ? (
            <Image
              src={b.image_url}
              alt={b.title || ''}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={clsx('flex flex-col max-w-4xl', alignClasses[alignment as keyof typeof alignClasses])}>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl font-light">
              {slide.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              href={primaryLink}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-all text-lg shadow-lg hover:scale-105"
            >
              {primaryText}
            </Link>
            <Link
              href={secondaryLink}
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/80 hover:bg-white hover:text-slate-900 transition-all text-lg hover:scale-105"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => goTo(i)}
            className={clsx(
              'rounded-full transition-all duration-300',
              i === current
                ? 'bg-white w-8 h-2'
                : 'bg-white/50 w-2 h-2 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
