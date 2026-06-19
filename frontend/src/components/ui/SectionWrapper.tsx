import React from 'react'
import clsx from 'clsx'

type SectionBg = 'white' | 'gray' | 'navy'

interface SectionWrapperProps {
  bg?: SectionBg
  className?: string
  id?: string
  children: React.ReactNode
}

const bgStyles: Record<SectionBg, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  navy: 'bg-[#0F172A]',
}

export function SectionWrapper({ bg = 'white', className, id, children }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={clsx(
        'py-16 md:py-20 lg:py-24',
        bgStyles[bg],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}