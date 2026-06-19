import React from 'react'
import Link from 'next/link'
import { Construction } from 'lucide-react'
import { Button } from './Button'

interface ComingSoonProps {
  title?: string
}

export function ComingSoon({ title = 'Page' }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-cyan-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        This page is being prepared. We&apos;re working hard to bring you something great.
      </p>
      <Button href="/" variant="primary">
        Go Home
      </Button>
    </div>
  )
}