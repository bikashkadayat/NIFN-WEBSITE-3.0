import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
      <p className="text-lg text-gray-500 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
