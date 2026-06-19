'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Upload, Trash2, Star, GripVertical, ArrowLeft } from 'lucide-react'
import { useGallery, useGalleryImages, useUploadGalleryImages, useReorderGalleryImages, useDeleteGalleryImage, useUpdateGallery } from '@/hooks/use-queries'

export default function GalleryImagesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: gallery, isLoading: galleryLoading } = useGallery(id)
  const { data: images, isLoading: imagesLoading } = useGalleryImages(id)
  const uploadMutation = useUploadGalleryImages()
  const reorderMutation = useReorderGalleryImages()
  const deleteMutation = useDeleteGalleryImage()
  const updateGalleryMutation = useUpdateGallery()

  const [localImages, setLocalImages] = useState<any[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [captions, setCaptions] = useState<Record<string, { en: string; ne: string }>>({})

  useEffect(() => {
    if (images) {
      setLocalImages([...images].sort((a, b) => a.sort_order - b.sort_order))
      const caps: Record<string, { en: string; ne: string }> = {}
      images.forEach(img => { caps[img.id] = { en: img.caption_en || '', ne: img.caption_ne || '' } })
      setCaptions(caps)
    }
  }, [images])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i])
    }

    try {
      await uploadMutation.mutateAsync({ galleryId: id, formData })
    } catch { /* handled */ }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files.length) return

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i])
    }
    uploadMutation.mutate({ galleryId: id, formData })
  }, [id, uploadMutation])

  const handleReorder = () => {
    const order = localImages.map(img => img.id)
    reorderMutation.mutate({ galleryId: id, order })
  }

  const moveImage = (from: number, to: number) => {
    const updated = [...localImages]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    setLocalImages(updated)
  }

  const setCoverImage = async (mediaId: string) => {
    await updateGalleryMutation.mutateAsync({ id, cover_image_id: mediaId, translations: [] })
  }

  const handleDelete = async (imageId: string) => {
    if (confirm('Remove this image?')) {
      deleteMutation.mutate({ galleryId: id, imageId })
    }
  }

  const updateCaption = (imageId: string, locale: 'en' | 'ne', value: string) => {
    setCaptions(prev => ({ ...prev, [imageId]: { ...prev[imageId], [locale]: value } }))
  }

  const title = gallery?.translations?.find(t => t.locale === 'en')?.title || gallery?.title || 'Gallery'

  if (galleryLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/galleries')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer bg-white"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 font-medium">Drag and drop images here, or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB each</p>
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
      </div>

      {/* Info bar */}
      {localImages.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          {localImages.length} {localImages.length === 1 ? 'photo' : 'photos'}
          {localImages.length > 1 && ' · Drag to reorder · Click ☆ to set cover'}
        </p>
      )}

      {/* Images grid */}
      {imagesLoading ? (
        <div className="text-center py-12 text-gray-500">Loading images...</div>
      ) : localImages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No images uploaded yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localImages.map((img, idx) => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Image preview */}
              <div className="relative group">
                <img src={img.media?.url || img.url} alt="" className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <button
                    onClick={() => setCoverImage(img.media_id)}
                    title="Set as cover"
                    className={`p-1.5 rounded-lg bg-white/90 hover:bg-white shadow-sm ${
                      gallery?.cover_image_id === img.media_id ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${gallery?.cover_image_id === img.media_id ? 'fill-yellow-500' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-white shadow-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Drag handle */}
                <div
                  className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-white/90 shadow-sm text-gray-400 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => { e.preventDefault(); if (dragIndex !== null && dragIndex !== idx) { moveImage(dragIndex, idx); setDragIndex(idx) } }}
                  onDragEnd={() => { setDragIndex(null); handleReorder() }}
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Captions */}
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  placeholder="Caption (EN)"
                  value={captions[img.id]?.en || ''}
                  onChange={(e) => updateCaption(img.id, 'en', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Caption (नेपाली)"
                  value={captions[img.id]?.ne || ''}
                  onChange={(e) => updateCaption(img.id, 'ne', e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}