import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={clsx(isLast ? 'text-white font-medium' : 'text-gray-300')}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}