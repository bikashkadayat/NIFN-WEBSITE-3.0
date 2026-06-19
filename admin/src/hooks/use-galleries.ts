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

export function useGallery(id: number | string) {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: async () => { const res = await galleriesApi.get(Number(id)) as { data: Gallery }; return res.data },
    enabled: !!id,
  })
}

export function useCreateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => galleriesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['galleries'] }); toast.success('Gallery created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => galleriesApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['gallery', id], (res as { data: Gallery }).data)
      qc.invalidateQueries({ queryKey: ['galleries'] })
      toast.success('Gallery updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => galleriesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['galleries'] }); toast.success('Gallery deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}

export function useGalleryImages(galleryId: number | string) {
  return useQuery({
    queryKey: ['gallery-images', galleryId],
    queryFn: async () => {
      const res = await galleriesApi.getImages(Number(galleryId)) as { data: GalleryImage[] }
      return res.data
    },
    enabled: !!galleryId,
  })
}

export function useUploadGalleryImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ galleryId, formData }: { galleryId: number; formData: FormData }) =>
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
    mutationFn: ({ galleryId, imageId }: { galleryId: number; imageId: number }) =>
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
    mutationFn: ({ galleryId, order }: { galleryId: number; order: { id: number; sort_order: number }[] }) =>
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
    mutationFn: ({ galleryId, imageId, data }: { galleryId: number; imageId: number; data: unknown }) =>
      galleriesApi.updateImage(galleryId, imageId, data),
    onSuccess: (_, { galleryId }) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', galleryId] })
    },
    onError: () => toast.error('Failed to update image'),
  })
}
