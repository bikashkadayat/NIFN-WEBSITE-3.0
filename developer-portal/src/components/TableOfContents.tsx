'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h2, h3')
    const tocItems: TocItem[] = []

    headings.forEach((h) => {
      const text = h.textContent || ''
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      h.setAttribute('id', id)
      tocItems.push({ id, text, level: h.tagName === 'H2' ? 2 : 3 })
    })

    setItems(tocItems)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [content])

  if (items.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  return (
    <nav className="sticky top-24 w-60">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        On this page
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={clsx(
                'text-left text-sm transition-colors hover:text-gray-900 w-full py-1',
                item.level === 3 ? 'pl-4 text-xs' : 'text-sm',
                activeId === item.id
                  ? 'text-cyan-600 font-medium'
                  : 'text-gray-500'
              )}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
