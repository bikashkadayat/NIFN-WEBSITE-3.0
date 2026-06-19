"use client"

import { useState, useRef, use } from "react"
import Link from "next/link"
import { Star, Trash2, Upload, GripVertical } from "lucide-react"
import { useGallery, useGalleryImages, useUploadGalleryImages, useDeleteGalleryImage, useUpdateGalleryImage } from "@/hooks/use-galleries"
import type { GalleryImage } from "@/lib/types"
import { getTitle } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Card } from "@/components/ui/card"

export default function GalleryImagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const galleryQuery = useGallery(id)
  const imagesQuery = useGalleryImages(id)
  const uploadImages = useUploadGalleryImages()
  const deleteImage = useDeleteGalleryImage()
  const updateImage = useUpdateGalleryImage()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null)
  const [captions, setCaptions] = useState<Record<number, { en: string; ne: string }>>({})

  const gallery = galleryQuery.data
  const images: GalleryImage[] = imagesQuery.data ?? []
  const galleryTitle = gallery ? getTitle(gallery.translations, gallery.slug) : "Gallery"

  const getCaptionEn = (img: GalleryImage) =>
    captions[img.id]?.en !== undefined ? captions[img.id].en : (img.caption_en ?? "")

  const getCaptionNe = (img: GalleryImage) =>
    captions[img.id]?.ne !== undefined ? captions[img.id].ne : (img.caption_ne ?? "")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("images[]", file))
    await uploadImages.mutateAsync({ galleryId: Number(id), formData })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSetCover = async (imageId: number) => {
    await updateImage.mutateAsync({ galleryId: Number(id), imageId, data: { is_cover: true } })
  }

  const handleCaptionBlur = async (img: GalleryImage) => {
    const en = getCaptionEn(img)
    const ne = getCaptionNe(img)
    if (en !== img.caption_en || ne !== img.caption_ne) {
      await updateImage.mutateAsync({
        galleryId: Number(id),
        imageId: img.id,
        data: { caption_en: en, caption_ne: ne },
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteImageId) return
    await deleteImage.mutateAsync({ galleryId: Number(id), imageId: deleteImageId })
    setDeleteImageId(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Galleries", href: "/admin/galleries" },
          { label: galleryTitle, href: `/admin/galleries/${id}` },
          { label: "Images" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Gallery Images</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {images.length} photo{images.length !== 1 ? "s" : ""} &bull; Drag to reorder &bull; Click ★ to set as cover
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/galleries/${id}`}>
            <Button variant="outline">Back to Gallery</Button>
          </Link>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploadImages.isPending}>
            <Upload size={16} />
            {uploadImages.isPending ? "Uploading..." : "Upload Images"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {imagesQuery.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          title="No images yet"
          description="Upload images to this gallery."
          action={{ label: "Upload Images", onClick: () => fileInputRef.current?.click() }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <div className="relative group">
                <img
                  src={img.media.thumbnail_url ?? img.media.url}
                  alt={img.caption_en ?? "Gallery image"}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-2">
                  <GripVertical size={16} className="text-white/70 cursor-grab mt-1" />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.id)}
                      title="Set as cover"
                      className="p-1 rounded bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <Star
                        size={14}
                        className={img.is_cover ? "text-yellow-400 fill-yellow-400" : "text-white"}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteImageId(img.id)}
                      title="Delete"
                      className="p-1 rounded bg-black/50 hover:bg-red-500/70 transition-colors"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>
                {img.is_cover && (
                  <div className="absolute bottom-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded">
                    Cover
                  </div>
                )}
              </div>
              <div className="p-2 space-y-1">
                <Input
                  placeholder="Caption (EN)"
                  value={getCaptionEn(img)}
                  onChange={(e) =>
                    setCaptions((prev) => ({
                      ...prev,
                      [img.id]: { en: e.target.value, ne: getCaptionNe(img) },
                    }))
                  }
                  onBlur={() => handleCaptionBlur(img)}
                  className="text-xs h-7"
                />
                <Input
                  placeholder="Caption (NE)"
                  value={getCaptionNe(img)}
                  onChange={(e) =>
                    setCaptions((prev) => ({
                      ...prev,
                      [img.id]: { en: getCaptionEn(img), ne: e.target.value },
                    }))
                  }
                  onBlur={() => handleCaptionBlur(img)}
                  className="text-xs h-7"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteImageId}
        onClose={() => setDeleteImageId(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteImage.isPending}
      />
    </div>
  )
}
