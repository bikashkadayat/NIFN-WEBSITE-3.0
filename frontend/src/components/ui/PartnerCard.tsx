import React from 'react'
import clsx from 'clsx'
import { Building2 } from 'lucide-react'

interface PartnerCardProps {
  name: string
  type: string
  logo?: string
  className?: string
}

export function PartnerCard({ name, type, logo, className }: PartnerCardProps) {
  return (
    <div
      className={clsx(
        'bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center hover:bg-white/15 transition-colors',
        className
      )}
    >
      {logo ? (
        <img src={logo} alt={name} className="w-16 h-16 object-contain mx-auto mb-4 brightness-0 invert" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-white/40" />
        </div>
      )}
      <h3 className="text-white font-semibold text-sm mb-1">{name}</h3>
      <span className="inline-block text-xs text-white/50 px-2 py-0.5 rounded-full bg-white/5">
        {type}
      </span>
    </div>
  )
}