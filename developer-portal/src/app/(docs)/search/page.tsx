'use client'

import { Suspense } from 'react'
import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchNavigation, NavNode } from '@/lib/api'
import Link from 'next/link'
import { Search as SearchIcon, FileText, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FlatEntry {
  slug: string
  title: string
  path: string
}

function flattenNav(nodes: NavNode[], prefix: string = ''): FlatEntry[] {
  const entries: FlatEntry[] = []
  for (const node of nodes) {
    if (node.slug) {
      entries.push({
        slug: node.slug,
        title: node.title || '',
        path: prefix ? `${prefix} / ${node.title}` : (node.title || ''),
      })
    }
    if (node.children.length > 0) {
      entries.push(...flattenNav(node.children, node.title || ''))
    }
  }
  return entries
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams?.get('q') || '')
  const [results, setResults] = useState<FlatEntry[]>([])
  const [allEntries, setAllEntries] = useState<FlatEntry[]>([])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNavigation().then((nav) => {
      const entries = flattenNav(nav)
      setAllEntries(entries)
      setLoading(false)
      const q = searchParams?.get('q')
      if (q) {
        performSearch(q, entries)
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const performSearch = useCallback((q: string, entries?: FlatEntry[]) => {
    const source = entries || allEntries
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      router.replace('/search')
      return
    }
    const lower = q.toLowerCase()
    const filtered = source.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.slug.toLowerCase().includes(lower)
    )
    setResults(filtered)
    router.replace(`/search?q=${encodeURIComponent(q)}`)
  }, [allEntries, router])

  const handleSearch = useCallback((q: string) => {
    performSearch(q)
  }, [performSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      router.push('/')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search documentation..."
          className="w-full pl-12 pr-12 py-3.5 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full" />
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for
            &ldquo;{query}&rdquo;
          </p>
          {results.map((entry) => (
            <Link
              key={entry.slug}
              href={`/docs/${entry.slug}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all"
            >
              <FileText className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{entry.title}</p>
                <p className="text-sm text-gray-400">{entry.path}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !query && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            Start typing to search the documentation.
          </p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="animate-spin w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
