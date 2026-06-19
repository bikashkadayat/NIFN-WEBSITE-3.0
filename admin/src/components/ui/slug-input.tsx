'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn, slugify } from '@/lib/utils'

interface SlugInputProps {
  value: string
  onChange: (slug: string) => void
  sourceValue?: string
  basePath?: string
  label?: string
  required?: boolean
  error?: string
  className?: string
}

export function SlugInput({
  value,
  onChange,
  sourceValue,
  basePath = '',
  label = 'URL Slug',
  required,
  error,
  className,
}: SlugInputProps) {
  const [manuallyEdited, setManuallyEdited] = useState(false)

  useEffect(() => {
    if (!manuallyEdited && sourceValue) {
      onChange(slugify(sourceValue))
    }
  }, [sourceValue, manuallyEdited, onChange])

  const regenerate = () => {
    if (sourceValue) {
      setManuallyEdited(false)
      onChange(slugify(sourceValue))
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setManuallyEdited(true)
            onChange(slugify(e.target.value))
          }}
          className={cn(
            'flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500',
            error ? 'border-red-300' : 'border-zinc-300',
          )}
          placeholder="auto-generated-slug"
        />
        {sourceValue && (
          <button
            type="button"
            onClick={regenerate}
            title="Regenerate from title"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
      {value && (
        <p className="mt-1 text-xs text-zinc-400">
          URL: <span className="text-zinc-600">{basePath}/{value}</span>
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
