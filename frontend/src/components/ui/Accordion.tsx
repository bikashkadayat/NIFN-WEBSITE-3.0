'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface AccordionProps {
  title: string | React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<string>(defaultOpen ? '500px' : '0')

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0')
    }
  }, [isOpen, children])

  return (
    <div className={clsx('border-b border-gray-200', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
      >
        {title}
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pb-4 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  )
}