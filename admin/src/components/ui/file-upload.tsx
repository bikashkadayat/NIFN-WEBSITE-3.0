'use client'

import { useState, useRef, useCallback, type DragEvent } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'

interface ExistingFile {
  name: string
  size?: number
  url?: string
}

interface FileUploadProps {
  value?: ExistingFile | null
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number
  label?: string
  className?: string
}

function FileUpload({
  value,
  onFileSelect,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.csv,.txt',
  maxSize = 50 * 1024 * 1024,
  label,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (f: File) => {
      setError(null)
      if (f.size > maxSize) {
        setError(`File must be less than ${formatFileSize(maxSize)}`)
        return
      }
      setSelectedFile(f)
      onFileSelect(f)
    },
    [maxSize, onFileSelect],
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const remove = () => {
    setSelectedFile(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const display = selectedFile
    ? { name: selectedFile.name, size: selectedFile.size }
    : value || null

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-zinc-700 mb-1">{label}</label>}
      {display ? (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <FileText className="shrink-0 text-zinc-400" size={24} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900">{display.name}</p>
            {display.size != null && (
              <p className="text-xs text-zinc-500">{formatFileSize(display.size)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={remove}
            className="rounded p-1 text-zinc-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
            dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50',
          )}
        >
          <Upload className="mb-2 text-zinc-300" size={32} />
          <p className="text-sm font-medium text-zinc-600">
            Drag & drop file or <span className="text-cyan-600">click to browse</span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            PDF, DOC, XLS, PPT, ZIP, CSV — max {formatFileSize(maxSize)}
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        className="hidden"
      />
    </div>
  )
}

export { FileUpload, type FileUploadProps, type ExistingFile }
