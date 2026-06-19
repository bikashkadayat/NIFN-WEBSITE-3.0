'use client'

import clsx from 'clsx'

interface LocaleTabsProps {
  active: string
  onChange: (locale: string) => void
  locales: string[]
  errors?: Record<string, Record<string, string[]>>
}

export function LocaleTabs({ active, onChange, locales, errors }: LocaleTabsProps) {
  const labels: Record<string, string> = {
    en: 'English',
    ne: 'नेपाली',
  }

  return (
    <div className="flex gap-1 mb-4">
      {locales.map((locale) => {
        const hasError = errors?.[locale] && Object.keys(errors[locale]).length > 0
        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-colors',
              active === locale
                ? 'bg-white text-blue-600 border-blue-500'
                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200',
              hasError && 'text-red-600'
            )}
          >
            {labels[locale] || locale}
          </button>
        )
      })}
    </div>
  )
}