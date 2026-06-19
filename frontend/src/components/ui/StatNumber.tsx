'use client'

import React, { useRef, useEffect, useState } from 'react'

interface StatNumberProps {
  value: string
  label: string
  suffix?: string
  className?: string
}

export function StatNumber({ value, label, suffix = '', className }: StatNumberProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return

    const target = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (isNaN(target)) {
      setDisplayValue(value)
      return
    }

    const duration = 1500
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * target)

      setDisplayValue(current.toLocaleString() + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [hasAnimated, value, suffix])

  return (
    <div ref={ref} className={className}>
      <div className="text-4xl md:text-5xl font-extrabold text-cyan-600">
        {displayValue}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}