import Link from 'next/link'
import { ExternalLink, GitFork, CheckCircle2, Clock, Wrench, AlertTriangle, FlaskConical } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { DevSdk } from '@/lib/api'

const STATUS_STYLES: Record<string, string> = {
  official: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  community: 'bg-blue-50 text-blue-700 border-blue-200',
  alpha: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  beta: 'bg-purple-50 text-purple-700 border-purple-200',
  deprecated: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  official: CheckCircle2,
  community: FlaskConical,
  alpha: AlertTriangle,
  beta: Clock,
  deprecated: Wrench,
}

interface SdkCardProps {
  sdk: DevSdk
}

export function SdkCard({ sdk }: SdkCardProps) {
  const statusStyle = STATUS_STYLES[sdk.status?.toLowerCase()] || STATUS_STYLES.official
  const StatusIcon = STATUS_ICONS[sdk.status?.toLowerCase()] || CheckCircle2

  return (
    <div className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg transition-all flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 truncate">
            {sdk.title || sdk.language}
          </h2>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {sdk.package_name}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ml-3 ${statusStyle}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {sdk.status}
        </span>
      </div>

      {sdk.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sdk.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
        {sdk.maintainer && (
          <span className="text-gray-400 text-xs">By {sdk.maintainer}</span>
        )}
        {sdk.runtime && (
          <span className="text-gray-400 text-xs">{sdk.runtime}</span>
        )}
        {sdk.license && (
          <span className="text-gray-400 text-xs">{sdk.license}</span>
        )}
      </div>

      {sdk.installation_code && (
        <div className="mt-auto">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Installation</p>
          <CodeBlock code={sdk.installation_code} />
        </div>
      )}

      <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
        {sdk.documentation_url && (
          <Link
            href={sdk.documentation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Docs
          </Link>
        )}
        {sdk.github_url && (
          <Link
            href={sdk.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <GitFork className="w-4 h-4" />
            GitHub
          </Link>
        )}
      </div>
    </div>
  )
}
