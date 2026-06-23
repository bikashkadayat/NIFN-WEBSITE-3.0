'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  Upload,
  X,
  Search,
  ImageIcon,
  Check,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize, formatDate } from '@/lib/utils'
import { useMedia, useUploadMedia, useDeleteMedia } from '@/hooks/use-media'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { Media } from '@/lib/types'
import client from '@/lib/api'
import { toast } from 'sonner'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MediaPickerProps {
  /** URL of currently selected image — used only for preview display */
  value?: string | null
  /** Called with (mediaId, imageUrl) whenever selection changes */
  onChange: (id: string | null, url?: string) => void
  label?: string
  hint?: string
  className?: string
  circular?: boolean
}

// Paginated shape returned by Laravel's paginate()
interface PaginatedMedia {
  data: Media[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ─── Upload Tab ─────────────────────────────────────────────────────────────────

interface UploadTabProps {
  onUploaded: (media: Media) => void
}

function UploadTab({ onUploaded }: UploadTabProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.')
        return
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('File size must be under 20 MB.')
        return
      }

      setUploading(true)
      setProgress(10)

      try {
        const fd = new FormData()
        fd.append('file', file)

        const res = await client.post<{ data: Media & { url: string } }>(
          '/admin/media',
          fd,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
              if (e.total) setProgress(Math.round((e.loaded / e.total) * 90))
            },
          },
        )
        setProgress(100)
        toast.success('Image uploaded')
        onUploaded(res.data.data)
      } catch {
        setError('Upload failed. Please try again.')
      } finally {
        setUploading(false)
      }
    },
    [onUploaded],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'w-full max-w-lg flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer',
          dragOver
            ? 'border-cyan-400 bg-cyan-50'
            : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-white',
          uploading && 'pointer-events-none',
        )}
      >
        {uploading ? (
          <>
            <Loader2 size={36} className="animate-spin text-cyan-500" />
            <p className="text-sm font-medium text-zinc-600">Uploading…</p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <Upload size={24} className="text-zinc-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-zinc-700">
                Drop an image here, or{' '}
                <span className="text-cyan-600">click to browse</span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                PNG, JPG, WebP, GIF — max 20 MB
              </p>
            </div>
          </>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="mt-4 w-full max-w-lg h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}

// ─── Library Tab ────────────────────────────────────────────────────────────────

interface LibraryTabProps {
  selectedId: string | null
  onSelect: (media: Media) => void
}

function LibraryTab({ selectedId, onSelect }: LibraryTabProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteMedia = useDeleteMedia()

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const params: Record<string, unknown> = { page, per_page: 24 }
  if (search) params.search = search

  const { data: raw, isLoading, isFetching } = useMedia(params)

  // The hook returns the full paginator object cast incorrectly — fix it here
  const paginated = raw as unknown as PaginatedMedia | undefined
  const mediaList: Media[] = paginated?.data || []
  const currentPage = paginated?.current_page || page
  const lastPage = paginated?.last_page || 1
  const total = paginated?.total || 0

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Delete this image from the library?')) return
    setDeleteId(id)
    try {
      await deleteMedia.mutateAsync(id)
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search by filename…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9 w-full rounded-lg border border-zinc-300 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
          />
          {isFetching && (
            <Loader2
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-zinc-400"
            />
          )}
        </div>
        <span className="shrink-0 text-xs text-zinc-400">{total} image{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={28} />
        </div>
      ) : mediaList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
          <Images size={40} className="text-zinc-300" />
          <p className="text-sm">
            {search ? 'No images match your search.' : 'No images uploaded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
          {mediaList.map((item) => {
            const isSelected = item.id === selectedId
            const isDeleting = deleteId === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                  isSelected
                    ? 'border-cyan-500 shadow-md ring-2 ring-cyan-300'
                    : 'border-zinc-200 hover:border-zinc-400',
                )}
              >
                {item.mime_type?.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.alt_text || item.file_name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                    <ImageIcon size={20} className="text-zinc-400" />
                  </div>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/20">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 shadow-lg">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>
                )}

                {/* Delete button — hover only */}
                {!isSelected && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={isDeleting}
                    className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow group-hover:flex hover:bg-red-600"
                    aria-label="Delete"
                  >
                    {isDeleting ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Trash2 size={10} />
                    )}
                  </button>
                )}

                {/* Filename tooltip */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-[10px] text-white">{item.file_name}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm text-zinc-500">
            {currentPage} / {lastPage}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={currentPage >= lastPage}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Media Picker Modal ─────────────────────────────────────────────────────────

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (media: Media) => void
  initialSelectedId?: string | null
}

function MediaPickerModal({ open, onClose, onConfirm, initialSelectedId }: MediaPickerModalProps) {
  const [tab, setTab] = useState<'upload' | 'library'>('library')
  const [pending, setPending] = useState<Media | null>(null)

  // Reset state when modal reopens
  useEffect(() => {
    if (open) {
      setTab('library')
      setPending(null)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const handleUploaded = useCallback((media: Media) => {
    setPending(media)
    setTab('library')
    // Auto-confirm immediately after upload
    onConfirm(media)
  }, [onConfirm])

  const handleSelect = useCallback((media: Media) => {
    setPending(media)
  }, [])

  const handleConfirm = useCallback(() => {
    if (pending) onConfirm(pending)
  }, [pending, onConfirm])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Media Library</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Select from library or upload a new image</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 px-6">
          <button
            type="button"
            onClick={() => setTab('library')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors -mb-px mr-6',
              tab === 'library'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700',
            )}
          >
            <Images size={15} />
            Select from Library
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={cn(
              'flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors -mb-px',
              tab === 'upload'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700',
            )}
          >
            <Upload size={15} />
            Upload New
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {tab === 'upload' ? (
            <UploadTab onUploaded={handleUploaded} />
          ) : (
            <LibraryTab
              selectedId={pending?.id ?? initialSelectedId ?? null}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {pending && (
              <>
                {pending.mime_type?.startsWith('image/') && (
                  <img
                    src={pending.url}
                    alt={pending.file_name}
                    className="h-10 w-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{pending.file_name}</p>
                  <p className="text-xs text-zinc-400">
                    {formatFileSize(pending.file_size)}
                    {pending.created_at ? ` · ${formatDate(pending.created_at)}` : ''}
                  </p>
                </div>
              </>
            )}
            {!pending && (
              <p className="text-sm text-zinc-400 italic">No image selected</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!pending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-40"
            >
              <Check size={15} />
              Select Image
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ─── Main MediaPicker Component ─────────────────────────────────────────────────

export function MediaPicker({
  value,
  onChange,
  label,
  hint,
  className,
  circular,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [currentId, setCurrentId] = useState<string | null>(null)

  // Sync external value changes (e.g. when edit form loads existing data)
  useEffect(() => {
    setPreview(value || null)
  }, [value])

  const handleConfirm = useCallback(
    (media: Media) => {
      setPreview(media.url)
      setCurrentId(media.id)
      onChange(media.id, media.url)
      setOpen(false)
    },
    [onChange],
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    setCurrentId(null)
    onChange(null)
  }, [onChange])

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}

      {preview ? (
        /* ── Preview state ── */
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={preview}
              alt="Selected"
              className={cn(
                'object-cover border border-zinc-200 shadow-sm',
                circular
                  ? 'h-24 w-24 rounded-full'
                  : 'max-h-48 w-auto rounded-xl',
              )}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-400 transition-colors"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Images size={14} />
              Change Image
            </Button>
            {hint && (
              <p className="text-xs text-zinc-400 max-w-xs">{hint}</p>
            )}
          </div>
        </div>
      ) : (
        /* ── Empty state ── */
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-all',
            'border-zinc-300 bg-zinc-50/50 hover:border-cyan-400 hover:bg-cyan-50/40 cursor-pointer',
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
            <Images size={22} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-600">
              Click to select an image
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Upload new or choose from library
            </p>
          </div>
          {hint && <p className="text-xs text-zinc-400">{hint}</p>}
        </button>
      )}

      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        initialSelectedId={currentId}
      />
    </div>
  )
}
