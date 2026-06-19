import React from 'react'
import clsx from 'clsx'
import { Breadcrumb } from './Breadcrumb'
import type { BreadcrumbItem } from './Breadcrumb'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  breadcrumb?: BreadcrumbItem[]
  overlay?: boolean
  className?: string
}

export function Hero({ title, subtitle, backgroundImage, breadcrumb, overlay = true, className }: HeroProps) {
  return (
    <section
      className={clsx(
        'relative flex items-center justify-center min-h-[280px] md:min-h-[360px]',
        !backgroundImage && 'bg-gradient-to-br from-[#0F172A] to-[#1E3A5F]',
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {overlay && <div className="absolute inset-0 bg-black/60" />}
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-16">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="mb-4 flex justify-center">
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}