'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { X, Search, Loader2, FileText, Image, Newspaper } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

interface SearchResult {
  id: string
  type: 'news' | 'gallery' | 'page'
  title: string
  slug: string
  excerpt?: string
  url: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchSite: (query: string) => Promise<SearchResult[]>
}

export function SearchModal({ isOpen, onClose, searchSite }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const grouped = {
    news: results.filter(r => r.type === 'news'),
    gallery: results.filter(r => r.type === 'gallery'),
    page: results.filter(r => r.type === 'page'),
  }

  const hasResults = results.length > 0

  const debouncedSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const res = await searchSite(query.trim())
        setResults(res)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
        setSearched(true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchSite])

  useEffect(() => {
    const cleanup = debouncedSearch()
    return cleanup
  }, [debouncedSearch])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  if (!isOpen) return null

  const typeIcon = (type: string) => {
    switch (type) {
      case 'news': return <Newspaper className="w-4 h-4" />;
      case 'gallery': return <Image className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }

  const typeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'News';
      case 'gallery': return 'Gallery';
      default: return 'Page';
    }
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-cyan-100 text-cyan-700';
      case 'gallery': return 'bg-purple-100 text-purple-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search news, galleries, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
          />
          {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {!loading && searched && !hasResults && (
            <div className="p-8 text-center">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No results found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="p-2 space-y-1">
              {(Object.entries(grouped) as [string, SearchResult[]][]).map(
                ([type, items]) =>
                  items.length > 0 && (
                    <div key={type}>
                      <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {typeLabel(type)}
                      </p>
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={onClose}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className={clsx('p-1.5 rounded-lg shrink-0', typeColor(type))}>
                            {typeIcon(type)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-cyan-600 transition-colors truncate">
                              {item.title}
                            </p>
                            {item.excerpt && (
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', typeColor(type))}>
                            {typeLabel(type)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )
              )}
            </div>
          )}

          {!loading && !searched && !query && (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Type to search across the site</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}