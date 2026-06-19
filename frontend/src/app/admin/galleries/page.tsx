'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { useGalleries, useDeleteGallery } from '@/hooks/use-queries'
import { Pagination } from '@/components/pagination'
import clsx from 'clsx'
import { format } from 'date-fns'

export default function GalleriesPage() {
  const [page, setPage] = useState(1)
  const deleteMutation = useDeleteGallery()

  const { data, isLoading } = useGalleries({ page, per_page: 15 })

  const handleDelete = async (id: string) => {
    if (confirm('Delete this gallery?')) deleteMutation.mutate(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Galleries</h1>
        <Link
          href="/galleries/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cover</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Images</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No galleries found</td></tr>
              ) : (
                data?.data?.map((gallery) => (
                  <tr key={gallery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {gallery.cover_image?.url ? (
                        <img src={gallery.cover_image.url} alt="" className="w-14 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {gallery.translations?.find(t => t.locale === 'en')?.title || gallery.title || 'Untitled'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Link href={`/galleries/${gallery.id}/images`} className="text-blue-600 hover:underline">
                        {gallery.gallery_images?.length ?? 0} photos
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        gallery.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {gallery.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {gallery.event_date ? format(new Date(gallery.event_date), 'MMM dd, yyyy') : '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/galleries/${gallery.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <Link href={`/galleries/${gallery.id}/images`} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Manage Images">
                          <ImageIcon className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(gallery.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
            <Pagination currentPage={data.current_page} lastPage={data.last_page} total={data.total} from={data.from} to={data.to} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}