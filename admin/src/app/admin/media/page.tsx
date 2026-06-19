'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, ImageIcon, Film, FileArchive, FileText, Music, Grid, List, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useMedia, useUploadMedia, useDeleteMedia } from '@/hooks/use-media'
import { formatFileSize, formatDate } from '@/lib/utils'
import type { Media } from '@/lib/types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/lib/utils'

function getFileIcon(mimeType: string) {
  if (mimeType?.startsWith('image/')) return ImageIcon
  if (mimeType?.startsWith('video/')) return Film
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return FileArchive
  if (mimeType?.includes('pdf') || mimeType?.includes('doc') || mimeType?.includes('text')) return FileText
  if (mimeType?.startsWith('audio/')) return Music
  return File
}

export default function MediaPage() {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: mediaRes, isLoading, refetch } = useMedia({ page })
  const uploadMedia = useUploadMedia()
  const deleteMedia = useDeleteMedia()

  // The hook returns { data: Media[] | { data: Media[] } }
  const rawData = mediaRes?.data
  const mediaList: Media[] = Array.isArray(rawData) ? rawData : ((rawData as unknown as { data: Media[] })?.data ?? [])
  const metaData = Array.isArray(rawData) ? {} : (rawData as unknown as { current_page?: number; last_page?: number; total?: number } ?? {})
  const currentPage = metaData?.current_page ?? page
  const lastPage = metaData?.last_page ?? 1
  const total = metaData?.total ?? mediaList.length

  const handleFilesSelected = async (files: FileList) => {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('file', files[i])
      try {
        await uploadMedia.mutateAsync(fd)
      } catch {
        toast.error(`Failed to upload ${files[i].name}`)
      }
    }
    setUploading(false)
    await refetch()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMedia.mutateAsync(deleteId)
    setDeleteId(null)
    if (selectedMedia?.id === deleteId) setSelectedMedia(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Media Manager' }]} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Media Manager</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total} file{total !== 1 ? 's' : ''} in library
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded', viewMode === 'grid' ? 'bg-zinc-200' : 'hover:bg-zinc-100')}>
            <Grid size={16} />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('p-2 rounded', viewMode === 'list' ? 'bg-zinc-200' : 'hover:bg-zinc-100')}>
            <List size={16} />
          </button>
          <Button onClick={() => fileInputRef.current?.click()} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload
          </Button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar" className="hidden"
            onChange={(e) => { if (e.target.files?.length) handleFilesSelected(e.target.files) }} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : mediaList.length === 0 ? (
        <EmptyState title="No files yet" description="Upload files to get started." action={{ label: 'Upload', onClick: () => fileInputRef.current?.click() }} />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4' : 'space-y-2'}>
          {mediaList.map((item) => {
            const isImage = item.mime_type?.startsWith('image/')
            const Icon = getFileIcon(item.mime_type)
            if (viewMode === 'grid') {
              return (
                <div key={item.id} className="group relative rounded-lg border border-zinc-200 bg-white overflow-hidden cursor-pointer hover:border-cyan-400"
                  onClick={() => setSelectedMedia(item)}>
                  {isImage ? (
                    <img src={item.url} alt={item.alt_text || item.file_name} className="h-24 w-full object-cover" />
                  ) : (
                    <div className="h-24 flex items-center justify-center bg-zinc-50">
                      <Icon size={32} className="text-zinc-400" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs text-zinc-700 truncate">{item.file_name}</p>
                    <p className="text-xs text-zinc-400">{formatFileSize(item.size)}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white">
                    <X size={12} />
                  </button>
                </div>
              )
            }
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer"
                onClick={() => setSelectedMedia(item)}>
                {isImage ? (
                  <img src={item.url} alt={item.file_name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center rounded bg-zinc-100">
                    <Icon size={20} className="text-zinc-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{item.file_name}</p>
                  <p className="text-xs text-zinc-500">{formatFileSize(item.size)} • {formatDate(item.created_at)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}>
                  <X size={14} className="text-red-500" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="text-sm text-zinc-600 flex items-center">Page {currentPage} of {lastPage}</span>
          <Button variant="outline" size="sm" disabled={currentPage >= lastPage} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* Detail panel */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedMedia(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">File Details</h3>
              <button onClick={() => setSelectedMedia(null)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
            </div>
            {selectedMedia.mime_type?.startsWith('image/') ? (
              <img src={selectedMedia.url} alt={selectedMedia.file_name} className="w-full rounded-lg object-contain max-h-64" />
            ) : (
              <div className="h-32 flex items-center justify-center bg-zinc-50 rounded-lg">
                <File size={48} className="text-zinc-300" />
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div><span className="text-zinc-500">Name:</span> <span className="text-zinc-900 ml-2">{selectedMedia.file_name}</span></div>
              <div><span className="text-zinc-500">Size:</span> <span className="text-zinc-900 ml-2">{formatFileSize(selectedMedia.size)}</span></div>
              <div><span className="text-zinc-500">Type:</span> <span className="text-zinc-900 ml-2">{selectedMedia.mime_type}</span></div>
              <div><span className="text-zinc-500">Uploaded:</span> <span className="text-zinc-900 ml-2">{formatDate(selectedMedia.created_at)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard.writeText(selectedMedia.url); toast.success('URL copied') }}>
                Copy URL
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => { setDeleteId(selectedMedia.id); setSelectedMedia(null) }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMedia.isPending}
      />
    </div>
  )
}
