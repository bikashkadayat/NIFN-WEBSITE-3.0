import Link from 'next/link'
import { Construction } from 'lucide-react'

interface ComingSoonProps {
  title?: string
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
        <Construction className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {title || 'Coming Soon'}
      </h2>
      <p className="text-gray-500 mb-6">
        This documentation page is being prepared. Check back soon for detailed guides and examples.
      </p>
      <p className="text-sm font-medium text-gray-400 mb-4">
        In the meantime, you might find these helpful:
      </p>
      <ul className="text-sm space-y-2 mb-8">
        <li>
          <Link href="/docs/quick-start" className="text-cyan-600 hover:text-cyan-800 underline">
            Quick Start Guide
          </Link>
        </li>
        <li>
          <Link href="/sdks" className="text-cyan-600 hover:text-cyan-800 underline">
            API Reference
          </Link>
        </li>
        <li>
          <a href="mailto:support@nifn.org.np" className="text-cyan-600 hover:text-cyan-800 underline">
            Contact Developer Support
          </a>
        </li>
      </ul>
      <Link
        href="/docs"
        className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
      >
        Back to Docs Home
      </Link>
    </div>
  )
}
