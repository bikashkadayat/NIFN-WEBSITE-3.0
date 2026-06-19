'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Download as DownloadIcon, FileText } from 'lucide-react'
import { useDownloads, useDeleteDownload } from '@/hooks/use-queries'
import { Pagination } from '@/components/pagination'
import clsx from 'clsx'

const fileIcons: Record<string, { color: string; label: string }> = {
  'application/pdf': { color: 'text-red-600', label: 'PDF' },
  'application/msword': { color: 'text-blue-600', label: 'DOC' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { color: 'text-blue-600', label: 'DOCX' },
  'application/vnd.ms-excel': { color: 'text-green-600', label: 'XLS' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { color: 'text-green-600', label: 'XLSX' },
  'application/zip': { color: 'text-purple-600', label: 'ZIP' },
  'application/x-rar-compressed': { color: 'text-purple-600', label: 'RAR' },
}

function getFileTypeInfo(mimeType: string) {
  return fileIcons[mimeType] || { color: 'text-gray-600', label: 'FILE' }
}

function formatFileSize(bytes: number) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

export default function DownloadsPage() {
  const [page, setPage] = useState(1)
  const deleteMutation = useDeleteDownload()

  const { data, isLoading } = useDownloads({ page, per_page: 20 })

  const handleDelete = async (id: string) => {
    if (confirm('Delete this download?')) deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Downloads</h1>
        <Link href="/downloads/create" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Downloads</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No downloads found</td></tr>
              ) : (
                data?.data?.map((dl, idx) => {
                  const typeInfo = getFileTypeInfo(dl.file_type)
                  return (
                    <tr key={dl.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{data.from + idx}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {dl.translations?.find(t => t.locale === 'en')?.title || dl.title || 'Untitled'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {dl.category?.translations?.find(t => t.locale === 'en')?.name || dl.category?.name || '--'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className={`w-4 h-4 ${typeInfo.color}`} />
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">{dl.file_name}</span>
                          <span className="text-xs text-gray-400">({formatFileSize(dl.file_size)})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          dl.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        )}>
                          {dl.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{dl.download_count}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {dl.file_url && (
                            <a href={dl.file_url} target="_blank" rel="noopener" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Download file">
                              <DownloadIcon className="w-4 h-4" />
                            </a>
                          )}
                          <Link href={`/downloads/${dl.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(dl.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination currentPage={data.current_page} lastPage={data.last_page} total={data.total} from={data.from} to={data.to} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}