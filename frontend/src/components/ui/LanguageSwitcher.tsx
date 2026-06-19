'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const LOCALES = ['en', 'ne'] as const
type Locale = (typeof LOCALES)[number]

const LABELS: Record<Locale, string> = { en: 'EN', ne: 'नेपाली' }

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentLocale = searchParams.get('locale') || 'en'

  const switchTo = useCallback(
    (locale: Locale) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('locale', locale)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((locale) => {
        const active = currentLocale === locale
        return (
          <button
            key={locale}
            onClick={() => switchTo(locale)}
            className={
              active
                ? 'rounded px-3 py-1 text-sm font-medium bg-cyan-600 text-white'
                : 'rounded px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          >
            {LABELS[locale]}
          </button>
        )
      })}
    </div>
  )
}
