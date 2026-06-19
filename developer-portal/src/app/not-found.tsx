import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
}

export default function NotFound() {
  return (
    <div className="py-24 text-center px-4">
      <p className="text-8xl font-extrabold text-cyan-600/20 mb-4">404</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
        The documentation page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/docs"
          className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
        >
          Browse Documentation
        </Link>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
