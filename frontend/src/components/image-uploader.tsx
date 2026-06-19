'use client'

import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useUploadMedia } from '@/hooks/use-queries'

interface ImageUploaderProps {
  value?: string
  onChange: (mediaId: string, url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(value)
  const uploadMutation = useUploadMedia()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    try {
      const result = await uploadMutation.mutateAsync(file)
      onChange(result.data.id, result.data.url)
    } catch {
      setPreview(value)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    onChange('', '')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-36 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
        </button>
      )}
    </div>
  )
}