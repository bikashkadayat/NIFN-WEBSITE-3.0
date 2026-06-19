import React from 'react'
import clsx from 'clsx'

interface CardProps {
  className?: string
  hover?: boolean
  children: React.ReactNode
}

export function Card({ className, hover = true, children }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200',
        hover && 'hover:shadow-lg transition-shadow duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}