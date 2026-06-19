import { fetchDeveloperChangelog } from '@/lib/api'
import type { Metadata } from 'next'
import { ChangelogEntry } from '@/components/changelog/ChangelogEntry'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Track updates, new features, and bug fixes across NIFN releases.',
}

export default async function ChangelogPage() {
  const entries = await fetchDeveloperChangelog()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Changelog</h1>
      <p className="text-lg text-gray-500 mb-12">
        Track updates, new features, and bug fixes across releases.
      </p>

      <div className="relative">
        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Changelog is being prepared</p>
          </div>
        )}

        {entries.map((entry, i) => (
          <ChangelogEntry key={entry.id} entry={entry} isLast={i === entries.length - 1} />
        ))}
      </div>
    </div>
  )
}
