'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/types'

interface LocaleTabsProps {
  children: (locale: Locale) => ReactNode
  defaultLocale?: Locale
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ne', label: 'नेपाली' },
]

export function LocaleTabs({ children, defaultLocale = 'en' }: LocaleTabsProps) {
  const [active, setActive] = useState<Locale>(defaultLocale)

  return (
    <div>
      <div className="flex border-b border-zinc-200 mb-4">
        {LOCALES.map((loc) => (
          <button
            key={loc.value}
            type="button"
            onClick={() => setActive(loc.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              active === loc.value
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300',
            )}
          >
            {loc.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  )
}
