import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { galleriesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Gallery, GalleryImage } from '@/lib/types'

export function useGalleries(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['galleries', params],
    queryFn: async () => {
      const res = await galleriesApi.list(params) as { data: Gallery[] }
      return res
    },
  })
}

export function useGallery(id: string) {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: async () => { const res = await galleriesApi.get(String(id)) as { data: Gallery }; return res.data },
    enabled: !!id,
  })
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
  const errors = e.response?.data?.errors
  if (errors) {
    const first = Object.values(errors)[0]
    return Array.isArray(first) ? first[0] : String(first)
  }
  return e.response?.data?.message || fallback
}

export function useCreateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => galleriesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['galleries'] }); toast.success('Gallery created') },
    onError: (err) => { toast.error(extractErrorMessage(err, 'Failed to create gallery')) },
  })
}

export function useUpdateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => galleriesApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['gallery', id], (res as { data: Gallery }).data)
      qc.invalidateQueries({ queryKey: ['galleries'] })
      toast.success('Gallery updated')
    },
    onError: (err) => { toast.error(extractErrorMessage(err, 'Failed to update gallery')) },
  })
}

export function useDeleteGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => galleriesApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['galleries'] }); toast.success('Gallery deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}

export function useGalleryImages(galleryId: string) {
  return useQuery({
    queryKey: ['gallery-images', galleryId],
    queryFn: async () => {
      const res = await galleriesApi.getImages(galleryId) as { data: GalleryImage[] }
      return res.data
    },
    enabled: !!galleryId,
  })
}

export function useUploadGalleryImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ galleryId, formData }: { galleryId: string; formData: FormData }) =>
      galleriesApi.uploadImages(galleryId, formData),
    onSuccess: (_, { galleryId }) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', galleryId] })
      toast.success('Images uploaded')
    },
    onError: () => toast.error('Upload failed'),
  })
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ galleryId, imageId }: { galleryId: string; imageId: string }) =>
      galleriesApi.deleteImage(galleryId, imageId),
    onSuccess: (_, { galleryId }) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', galleryId] })
      toast.success('Image deleted')
    },
    onError: () => toast.error('Failed to delete image'),
  })
}

export function useReorderGalleryImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ galleryId, order }: { galleryId: string; order: { id: string; sort_order: number }[] }) =>
      galleriesApi.reorderImages(galleryId, order),
    onSuccess: (_, { galleryId }) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', galleryId] })
    },
    onError: () => toast.error('Reorder failed'),
  })
}

export function useUpdateGalleryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ galleryId, imageId, data }: { galleryId: string; imageId: string; data: unknown }) =>
      galleriesApi.updateImage(galleryId, imageId, data),
    onSuccess: (_, { galleryId }) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', galleryId] })
    },
    onError: () => toast.error('Failed to update image'),
  })
}
