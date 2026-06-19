'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl md:text-9xl font-extrabold text-cyan-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
