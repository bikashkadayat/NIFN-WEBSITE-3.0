'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useContents, useDeleteContent } from '@/hooks/use-queries'
import { Pagination } from '@/components/pagination'
import clsx from 'clsx'

type PortalFilter = 'all' | 'website' | 'developer'

export default function ContentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [portalFilter, setPortalFilter] = useState<PortalFilter>('all')
  const deleteMutation = useDeleteContent()

  const params: Record<string, string | number | boolean> = { page, per_page: 15 }
  if (search) params.search = search
  if (portalFilter !== 'all') params.portal_type = portalFilter

  const { data, isLoading } = useContents(params)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content page?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <Link
          href="/contents/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Filter tabs */}
        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex gap-4">
            {(['all', 'website', 'developer'] as PortalFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setPortalFilter(tab); setPage(1) }}
                className={clsx(
                  'pb-3 text-sm font-medium border-b-2 transition-colors capitalize',
                  portalFilter === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab === 'all' ? 'All' : tab === 'website' ? 'Website' : 'Developer Portal'}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Portal Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No content pages found</td>
                </tr>
              ) : (
                data?.data?.map((content, idx) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {data.from + idx}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {content.translations?.find(t => t.locale === 'en')?.title || content.title || 'Untitled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{content.slug}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {content.portal_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        content.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {content.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/contents/${content.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(content.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}