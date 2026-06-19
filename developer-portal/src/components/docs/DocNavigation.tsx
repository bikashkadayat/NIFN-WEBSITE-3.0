import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavNode } from '@/lib/api'

interface AdjacentPage {
  slug: string
  title: string
}

interface DocNavigationProps {
  navigation: NavNode[]
  currentSlug: string
}

export function findAdjacentPages(navigation: NavNode[], currentSlug: string): { prev: AdjacentPage | null; next: AdjacentPage | null } {
  const flat: AdjacentPage[] = []

  function flatten(nodes: NavNode[]) {
    for (const node of nodes) {
      if (node.slug) {
        flat.push({ slug: node.slug, title: node.title || '' })
      }
      if (node.children.length > 0) {
        flatten(node.children)
      }
    }
  }

  flatten(navigation)

  const idx = flat.findIndex((p) => p.slug === currentSlug)
  if (idx === -1) return { prev: null, next: null }

  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  }
}

export function DocNavigation({ navigation, currentSlug }: DocNavigationProps) {
  const { prev, next } = findAdjacentPages(navigation, currentSlug)

  if (!prev && !next) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-stretch gap-4">
        <div className="flex-1">
          {prev && (
            <Link
              href={`/docs/${prev.slug}`}
              className="flex flex-col h-full p-4 border border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-200 transition-all group"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
                Previous
              </span>
              <span className="text-base font-semibold text-gray-900 group-hover:text-cyan-700">
                {prev.title}
              </span>
            </Link>
          )}
        </div>
        <div className="flex-1">
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="flex flex-col h-full p-4 border border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-200 transition-all group text-right"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                Next
                <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
              </span>
              <span className="text-base font-semibold text-gray-900 group-hover:text-cyan-700">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
