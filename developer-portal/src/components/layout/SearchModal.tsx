'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, FileText, ArrowUpDown } from 'lucide-react'
import clsx from 'clsx'
import { searchDeveloperDocs, SearchResult } from '@/lib/api'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const res = await searchDeveloperDocs(q)
    setResults(res)
    setSelectedIndex(-1)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, doSearch])

  const handleSelect = (slug: string) => {
    onClose()
    router.push(`/docs/${slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
      return
    }
    if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelect(results[selectedIndex].slug)
      return
    }
  }

  if (!open) return null

  const grouped = groupByCategory(results)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400 bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && query && Object.keys(grouped).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No results found for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {!loading && Object.keys(grouped).length > 0 && (
            <div className="py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {category || 'General'}
                  </p>
                  {items.map((item) => {
                    const globalIndex = results.indexOf(item)
                    return (
                      <button
                        key={item.slug}
                        onClick={() => handleSelect(item.slug)}
                        className={clsx(
                          'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
                          selectedIndex === globalIndex
                            ? 'bg-cyan-50 text-cyan-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <FileText className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          {item.excerpt && (
                            <p className="text-sm text-gray-500 truncate mt-0.5">{item.excerpt}</p>
                          )}
                        </div>
                        {item.category && (
                          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {item.category}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {!loading && !query && (
            <div className="text-center py-12">
              <p className="text-gray-400">Start typing to search documentation.</p>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4 px-4 py-3 border-t border-gray-200 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3" /> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}

function groupByCategory(results: SearchResult[]): Record<string, SearchResult[]> {
  const grouped: Record<string, SearchResult[]> = {}
  for (const item of results) {
    const cat = item.category || 'General'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  }
  return grouped
}
