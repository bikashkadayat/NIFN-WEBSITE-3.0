import type { Metadata } from 'next'
import { FileText, FileSpreadsheet, FileArchive, FileImage, File, Download, FolderOpen } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface DownloadItem {
  id: string
  title?: string
  description?: string
  file_url?: string
  file_name: string
  file_size: number
  file_type: string
  download_count: number
}

interface DownloadCategory {
  category: { id: string; name?: string; slug?: string }
  items: DownloadItem[]
}

async function fetchDownloads(): Promise<DownloadCategory[]> {
  try {
    const res = await fetch(`${API_URL}/v1/downloads`, { next: { revalidate: 60 } })
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes('pdf')) return { icon: FileText, color: 'text-red-500 bg-red-50' }
  if (t.includes('spreadsheet') || t.includes('excel') || t.includes('xls') || t.includes('csv'))
    return { icon: FileSpreadsheet, color: 'text-green-600 bg-green-50' }
  if (t.includes('zip') || t.includes('rar') || t.includes('tar') || t.includes('gz'))
    return { icon: FileArchive, color: 'text-yellow-600 bg-yellow-50' }
  if (t.includes('image') || t.includes('jpg') || t.includes('png') || t.includes('gif'))
    return { icon: FileImage, color: 'text-purple-600 bg-purple-50' }
  return { icon: File, color: 'text-gray-600 bg-gray-50' }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Downloads | NIFN',
    description: 'Download resources, reports, and documents from the Nepal Interledger Financial Network.',
  }
}

export default async function DownloadsPage() {
  const categories = await fetchDownloads()
  const hasDownloads = categories.some((c) => c.items.length > 0)

  return (
    <>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Downloads' },
            ]}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Downloads
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Access reports, guides, and resources from NIFN.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!hasDownloads ? (
            <div className="text-center py-20">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No downloads available</h2>
              <p className="text-gray-400">Check back soon for resources and documents.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) =>
                cat.items.length > 0 ? (
                  <div key={cat.category.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{cat.category.name}</h2>
                    <div className="space-y-3">
                      {cat.items.map((item) => {
                        const { icon: Icon, color } = getFileIcon(item.file_type)
                        return (
                          <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
                          >
                            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm">{item.title || item.file_name}</h3>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                <span>{formatFileSize(item.file_size)}</span>
                                <span>{item.file_type.toUpperCase()}</span>
                              </div>
                            </div>
                            <a
                              href={item.file_url || '#'}
                              download={item.file_name}
                              className="shrink-0 w-10 h-10 rounded-lg bg-cyan-50 hover:bg-cyan-100 flex items-center justify-center text-cyan-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
