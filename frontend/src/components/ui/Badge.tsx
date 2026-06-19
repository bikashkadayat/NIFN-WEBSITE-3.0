import React from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-cyan-100 text-cyan-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-700',
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-0.5',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}