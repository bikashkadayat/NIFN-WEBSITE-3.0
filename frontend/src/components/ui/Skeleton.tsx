import React from 'react'
import clsx from 'clsx'

type SkeletonVariant = 'text' | 'image' | 'card'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  const base = 'animate-pulse bg-gray-200 rounded'

  if (variant === 'text') {
    return (
      <div
        className={clsx(base, 'h-4', className)}
        style={{ width: width || '100%' }}
      />
    )
  }

  if (variant === 'image') {
    return (
      <div
        className={clsx(base, 'aspect-video', className)}
        style={{ width, height }}
      />
    )
  }

  return (
    <div
      className={clsx(base, 'p-5 space-y-3', className)}
      style={{ width, height }}
    >
      <div className="animate-pulse bg-gray-300 rounded h-32 mb-4" />
      <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
      <div className="animate-pulse bg-gray-300 rounded h-4 w-1/2" />
    </div>
  )
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}