import React from 'react'
import clsx from 'clsx'
import { Card } from './Card'

interface FeatureCardProps {
  icon: React.ReactNode
  iconBg?: string
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, iconBg = 'bg-cyan-100', title, description, className }: FeatureCardProps) {
  return (
    <Card className={clsx('p-8 text-center', className)}>
      <div
        className={clsx(
          'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5',
          iconBg
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </Card>
  )
}