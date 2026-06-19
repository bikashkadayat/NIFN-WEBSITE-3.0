import { DevChangelogEntry } from '@/lib/api'

interface ChangelogEntryProps {
  entry: DevChangelogEntry
  isLast: boolean
}

function highlightChangeTypes(body: string): string {
  return body
    .replace(/\[Added\]/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Added</span>')
    .replace(/\[Changed\]/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Changed</span>')
    .replace(/\[Fixed\]/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Fixed</span>')
    .replace(/\[Removed\]/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Removed</span>')
    .replace(/\[Security\]/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Security</span>')
}

export function ChangelogEntry({ entry, isLast }: ChangelogEntryProps) {
  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
      )}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-cyan-100 border-2 border-white flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-cyan-600" />
      </div>

      <div className="flex items-baseline gap-3 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">{entry.title || entry.version}</h2>
        <span className="text-sm font-mono bg-cyan-100 text-cyan-700 px-2.5 py-0.5 rounded-full font-semibold">
          {entry.version}
        </span>
      </div>
      {entry.release_date && (
        <p className="text-sm text-gray-500 mb-4">
          {new Date(entry.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
      {entry.body && (
        <div
          className="prose prose-sm max-w-none prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1 prose-a:text-cyan-600"
          dangerouslySetInnerHTML={{ __html: highlightChangeTypes(entry.body) }}
        />
      )}
    </div>
  )
}
