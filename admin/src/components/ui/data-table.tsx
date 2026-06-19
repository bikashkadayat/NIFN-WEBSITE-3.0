"use client"

import { useState, type ReactNode } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T, idx: number) => ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  idKey?: string
  actionColumn?: (item: T) => ReactNode
  onRowClick?: (item: T) => void
  sortField?: string
  sortOrder?: "asc" | "desc"
  onSort?: (field: string) => void
}

function DataTable<T extends object>({
  columns,
  data,
  loading,
  emptyMessage = "No data found.",
  selectable,
  selectedIds = [],
  onSelectionChange,
  idKey = "id",
  actionColumn,
  onRowClick,
  sortField,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(String(( item as Record<string, unknown>)[idKey])))

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(data.map((item) => String(( item as Record<string, unknown>)[idKey])))
    }
  }

  const handleSelect = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id]
    onSelectionChange?.(next)
  }

  const renderSortIcon = (col: Column<T>) => {
    if (!col.sortable) return null
    if (sortField !== col.key) return <ChevronsUpDown size={14} className="ml-1 shrink-0 text-zinc-400" />
    return sortOrder === "asc" ? (
      <ChevronUp size={14} className="ml-1 shrink-0" />
    ) : (
      <ChevronDown size={14} className="ml-1 shrink-0" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50">
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600"
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
                  col.sortable && "cursor-pointer select-none",
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center">
                  {col.label}
                  {renderSortIcon(col)}
                </span>
              </th>
            ))}
            {actionColumn && (
              <th className="w-16 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {selectable && <td className="px-4 py-3"><div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" /></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  </td>
                ))}
                {actionColumn && <td className="px-4 py-3"><div className="h-4 w-8 ml-auto rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" /></td>}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0) + (actionColumn ? 1 : 0)}
                className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={String(( item as Record<string, unknown>)[idKey]) || idx}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(String(( item as Record<string, unknown>)[idKey]))}
                      onChange={() => handleSelect(String(( item as Record<string, unknown>)[idKey]))}
                      className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600"
                      aria-label={`Select row ${idx + 1}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="whitespace-nowrap px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    {col.render ? col.render(item, idx) : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {actionColumn && (
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actionColumn(item)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }
