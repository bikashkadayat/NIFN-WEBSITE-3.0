"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  lastPage: number
  total: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, last: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = []
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (current > 3) pages.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < last - 2) pages.push("ellipsis")
  pages.push(last)
  return pages
}

function Pagination({ currentPage, lastPage, total, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {currentPage} of {lastPage} &middot; {total} items
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-zinc-600 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers(currentPage, lastPage).map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex h-9 w-9 items-center justify-center text-sm text-zinc-400"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
              )}
            >
              {page}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-zinc-600 transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export { Pagination, type PaginationProps }
