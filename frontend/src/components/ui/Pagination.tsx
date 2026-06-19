'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `${basePath}?${params.toString()}`
  }

  const getPages = () => {
    const pages: (number | 'ellipsis')[] = []
    const delta = 2
    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages, currentPage + delta)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('ellipsis')
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('ellipsis')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}

      {getPages().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`e-${idx}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={clsx(
              'min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-cyan-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}