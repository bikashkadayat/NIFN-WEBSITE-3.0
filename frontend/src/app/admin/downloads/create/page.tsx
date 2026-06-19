'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateDownload, useDownloadCategories, useUploadMedia } from '@/hooks/use-queries'
import { ImageUploader } from '@/components/image-uploader'
import { Upload, FileText, X } from 'lucide-react'

export default function CreateDownloadPage() {
  const router = useRouter()
  const createMutation = useCreateDownload()
  const { data: categories } = useDownloadCategories()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [enTitle, setEnTitle] = useState('')
  const [neTitle, setNeTitle] = useState('')
  const [enDescription, setEnDescription] = useState('')
  const [neDescription, setNeDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [thumbnailId, setThumbnailId] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      if (f.size > 50 * 1024 * 1024) {
        alert('File must be less than 50MB')
        return
      }
      setFile(f)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { alert('Please select a file'); return }
    if (!enTitle) { alert('Title (EN) is required'); return }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('category_id', categoryId || '')
    formData.append('thumbnail_id', thumbnailId || '')
    formData.append('sort_order', String(sortOrder))
    formData.append('is_active', String(isActive))

    formData.append('translations[0][locale]', 'en')
    formData.append('translations[0][title]', enTitle)
    formData.append('translations[0][description]', enDescription || '')
    formData.append('translations[1][locale]', 'ne')
    formData.append('translations[1][title]', neTitle || enTitle)
    formData.append('translations[1][description]', neDescription || '')

    try {
      await createMutation.mutateAsync(formData)
      router.push('/downloads')
    } catch { /* handled */ }
  }

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return bytes + ' B'
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Download</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">File</h2>
          <p className="text-xs text-gray-400 mb-2">Accept: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, CSV, TXT. Max size: 50MB</p>

          <div
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { if (f.size <= 50*1024*1024) setFile(f); else alert('File too large') } }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            {file ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag and drop a file here, or click to browse</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.csv,.txt" onChange={handleFileSelect} className="hidden" />
          </div>
        </div>

        {/* English */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-4">English</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN) <span className="text-red-500">*</span></label>
            <input type="text" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
            <textarea value={enDescription} onChange={(e) => setEnDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Nepali */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-4">नेपाली</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (NE)</label>
            <input type="text" value={neTitle} onChange={(e) => setNeTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (NE)</label>
            <textarea value={neDescription} onChange={(e) => setNeDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.translations?.find(t => t.locale === 'en')?.name || cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} min={0} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail (optional)</label>
            <ImageUploader value="" onChange={(id) => setThumbnailId(id)} />
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
            {createMutation.isPending ? 'Uploading...' : 'Save Download'}
          </button>
          <button type="button" onClick={() => router.push('/downloads')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
        </div>
      </form>
    </div>
  )
}