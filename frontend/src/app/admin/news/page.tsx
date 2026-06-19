'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react'
import { useNews, useDeleteNews } from '@/hooks/use-queries'
import { Pagination } from '@/components/pagination'
import clsx from 'clsx'
import { format } from 'date-fns'

export default function NewsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const deleteMutation = useDeleteNews()

  const params: Record<string, string | number | boolean> = { page, per_page: 15 }
  if (search) params.search = search
  if (statusFilter) params.is_published = statusFilter === 'published'

  const { data, isLoading } = useNews(params)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news article?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News Management</h1>
        <Link
          href="/news/create"
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
            {[
              { value: '', label: 'All' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setStatusFilter(tab.value); setPage(1) }}
                className={clsx(
                  'pb-3 text-sm font-medium border-b-2 transition-colors',
                  statusFilter === tab.value
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                )}
              >
                {tab.label}
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No news articles found</td>
                </tr>
              ) : (
                data?.data?.map((news, idx) => (
                  <tr key={news.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{data.from + idx}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {news.translations?.find(t => t.locale === 'en')?.title || news.title || 'Untitled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {news.category?.translations?.find(t => t.locale === 'en')?.name || news.category?.name || '--'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        news.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {news.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {news.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {news.published_at ? format(new Date(news.published_at), 'MMM dd, yyyy') : '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/news/${news.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(news.id)}
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