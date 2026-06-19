'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { fetchNavigation, NavNode } from '@/lib/api'
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  BookOpen,
  Code2,
  FileText,
  Layers,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Code2,
  FileText,
  Layers,
}

interface SidebarProps {
  onNavReady?: () => void
}

export function Sidebar({ onNavReady }: SidebarProps) {
  const [nav, setNav] = useState<NavNode[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetchNavigation().then((nodes) => {
      setNav(nodes)
      setLoading(false)
      onNavReady?.()
    })
  }, [onNavReady])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const renderNode = (node: NavNode, depth: number = 0) => {
    const isActive = pathname === `/docs/${node.slug}`
    const isExpanded = expanded.has(node.id)
    const hasChildren = node.children.length > 0
    const Icon = node.icon && ICON_MAP[node.icon] ? ICON_MAP[node.icon] : FileText

    return (
      <li key={node.id}>
        <div className="flex items-center">
          <Link
            href={`/docs/${node.slug}`}
            className={clsx(
              'flex-1 flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
              isActive
                ? 'bg-cyan-50 text-cyan-700 font-medium border-l-2 border-cyan-500 rounded-l-none'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{node.title}</span>
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className="mt-1">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  const groupedNav = groupByCategory(nav)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-cyan-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-bold text-gray-900">Documentation</span>
        </Link>
      </div>

      <div className="px-4 pt-3 pb-2">
        <Link
          href="/search"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search docs...</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {loading && (
          <div className="space-y-3 px-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
              </div>
            ))}
          </div>
        )}

        {!loading && nav.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-gray-400">Documentation is being prepared</p>
          </div>
        )}

        {!loading && nav.length > 0 && (
          <ul className="space-y-1">
            {groupedNav.map((group) => (
              <li key={group.category || '__no_cat'}>
                {group.category && (
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    {group.category}
                  </p>
                )}
                <ul className="space-y-1">
                  {group.nodes.map((node) => renderNode(node))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="px-4 py-3 border-t border-gray-200 space-y-1">
        <Link
          href="/sdks"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>SDKs & Libraries</span>
        </Link>
        <Link
          href="/changelog"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Changelog</span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-200 bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-hidden">
        {sidebarContent}
      </aside>
    </>
  )
}

interface NavGroup {
  category: string | null
  nodes: NavNode[]
}

function groupByCategory(nav: NavNode[]): NavGroup[] {
  const groups: Map<string, NavNode[]> = new Map()
  const uncategorized: NavNode[] = []

  for (const node of nav) {
    if (node.category) {
      const existing = groups.get(node.category) || []
      existing.push(node)
      groups.set(node.category, existing)
    } else {
      uncategorized.push(node)
    }
  }

  const result: NavGroup[] = []
  if (uncategorized.length > 0) {
    result.push({ category: null, nodes: uncategorized })
  }
  Array.from(groups.entries()).forEach(([category, nodes]) => {
    result.push({ category, nodes })
  })
  return result
}
