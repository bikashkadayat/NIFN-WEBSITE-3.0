import React from 'react'
import clsx from 'clsx'

interface PlaceholderImageProps {
  className?: string
}

export function PlaceholderImage({ className }: PlaceholderImageProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E3A5F]',
        className
      )}
    >
      <svg
        viewBox="0 0 80 80"
        className="w-12 h-12 opacity-20 mb-2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="15" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="10" y1="40" x2="70" y2="40" stroke="white" strokeWidth="1.5" />
        <line x1="40" y1="10" x2="40" y2="70" stroke="white" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="3" fill="white" />
        <circle cx="40" cy="10" r="2.5" fill="white" />
        <circle cx="40" cy="70" r="2.5" fill="white" />
        <circle cx="10" cy="40" r="2.5" fill="white" />
        <circle cx="70" cy="40" r="2.5" fill="white" />
        <circle cx="18.8" cy="18.8" r="2" fill="white" />
        <circle cx="61.2" cy="61.2" r="2" fill="white" />
        <circle cx="61.2" cy="18.8" r="2" fill="white" />
        <circle cx="18.8" cy="61.2" r="2" fill="white" />
      </svg>
      <span className="text-white/20 text-xs font-bold tracking-widest">NIFN</span>
    </div>
  )
}