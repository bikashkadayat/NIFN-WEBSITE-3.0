'use client'

import { useState, useRef, useCallback, type DragEvent } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import client from '@/lib/api'

interface ImageUploadProps {
  value?: string | null
  onChange: (mediaId: string | null, url?: string) => void
  label?: string
  hint?: string
  className?: string
  circular?: boolean
}

export function ImageUpload({ value, onChange, label, hint, className, circular }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await client.post<{ data: { id: string; url: string } }>('/admin/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const { id, url } = res.data.data
        onChange(id, url)
      } catch {
        setError('Upload failed. Please try again.')
        onChange(null)
      } finally {
        setUploading(false)
      }
    },
    [onChange],
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const remove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>
      )}
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className={cn(
              'object-cover border border-zinc-200',
              circular ? 'h-24 w-24 rounded-full' : 'max-h-48 rounded-lg',
            )}
          />
          <button
            type="button"
            onClick={remove}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-400"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            dragOver
              ? 'border-cyan-400 bg-cyan-50'
              : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50',
          )}
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin text-cyan-500" />
          ) : (
            <>
              <ImageIcon className="mb-2 text-zinc-300" size={32} />
              <p className="text-sm font-medium text-zinc-600">
                Drop an image or <span className="text-cyan-600">click to browse</span>
              </p>
              {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
            </>
          )}
        </div>
      )}
      {uploading && !preview && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-500" />
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  )
}
