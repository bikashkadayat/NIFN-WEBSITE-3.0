import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type {
  Content,
  News,
  NewsCategory,
  Tag,
  Gallery,
  GalleryImage,
  Banner,
  Download as DownloadType,
  DownloadCategory,
  DeveloperRegistration,
  ApiResponse,
  PaginatedResponse,
} from '@/types'
import toast from 'react-hot-toast'

// ─── Contents ──────────────────────────────────────────────────────────────

export function useContents(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/contents', { params })
      return data as PaginatedResponse<Content>
    },
  })
}

export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/contents/${id}`)
      return (data as ApiResponse<Content>).data
    },
    enabled: !!id,
  })
}

export function useCreateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/contents', payload)
      return data as ApiResponse<Content>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content created successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create content')
    },
  })
}

export function useUpdateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/contents/${id}`, payload)
      return data as ApiResponse<Content>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['content', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update content')
    },
  })
}

export function useDeleteContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/contents/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content deleted successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete content')
    },
  })
}

// ─── News ──────────────────────────────────────────────────────────────────

export function useNews(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/news', { params })
      return data as PaginatedResponse<News>
    },
  })
}

export function useNewsItem(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/news/${id}`)
      return (data as ApiResponse<News>).data
    },
    enabled: !!id,
  })
}

export function useCreateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/news', payload)
      return data as ApiResponse<News>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News article created successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create news')
    },
  })
}

export function useUpdateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/news/${id}`, payload)
      return data as ApiResponse<News>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['news', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News article updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update news')
    },
  })
}

export function useDeleteNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/news/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News article deleted successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete news')
    },
  })
}

// ─── News Categories ───────────────────────────────────────────────────────

export function useNewsCategories() {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/news-categories')
      return (data as ApiResponse<NewsCategory[]>).data
    },
  })
}

export function useCreateNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/news-categories', payload)
      return data as ApiResponse<NewsCategory>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news-categories'] })
      toast.success('Category created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create category')
    },
  })
}

export function useUpdateNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/news-categories/${id}`, payload)
      return data as ApiResponse<NewsCategory>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news-categories'] })
      toast.success('Category updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update category')
    },
  })
}

export function useDeleteNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/news-categories/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news-categories'] })
      toast.success('Category deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete category')
    },
  })
}

// ─── Tags ──────────────────────────────────────────────────────────────────

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/tags')
      return (data as ApiResponse<Tag[]>).data
    },
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/tags', payload)
      return data as ApiResponse<Tag>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create tag')
    },
  })
}

export function useUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/tags/${id}`, payload)
      return data as ApiResponse<Tag>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update tag')
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/tags/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete tag')
    },
  })
}

// ─── Media Upload ──────────────────────────────────────────────────────────

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/v1/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data as ApiResponse<{ id: string; url: string }>
    },
  })
}

// ─── Galleries ─────────────────────────────────────────────────────────────

export function useGalleries(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['galleries', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/galleries', { params })
      return data as PaginatedResponse<Gallery>
    },
  })
}

export function useGallery(id: string) {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/galleries/${id}`)
      return (data as ApiResponse<Gallery>).data
    },
    enabled: !!id,
  })
}

export function useCreateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/galleries', payload)
      return data as ApiResponse<Gallery>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['galleries'] })
      toast.success('Gallery created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create gallery')
    },
  })
}

export function useUpdateGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/galleries/${id}`, payload)
      return data as ApiResponse<Gallery>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['gallery', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['galleries'] })
      toast.success('Gallery updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update gallery')
    },
  })
}

export function useDeleteGallery() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/galleries/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['galleries'] })
      toast.success('Gallery deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete gallery')
    },
  })
}

// ─── Gallery Images ────────────────────────────────────────────────────────

export function useGalleryImages(galleryId: string) {
  return useQuery({
    queryKey: ['gallery-images', galleryId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/galleries/${galleryId}/images`)
      return (data as ApiResponse<GalleryImage[]>).data
    },
    enabled: !!galleryId,
  })
}

export function useUploadGalleryImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ galleryId, formData }: { galleryId: string; formData: FormData }) => {
      const { data } = await api.post(`/v1/admin/galleries/${galleryId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', variables.galleryId] })
      qc.invalidateQueries({ queryKey: ['gallery', variables.galleryId] })
      toast.success('Images uploaded')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to upload images')
    },
  })
}

export function useReorderGalleryImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ galleryId, order }: { galleryId: string; order: string[] }) => {
      const { data } = await api.post(`/v1/admin/galleries/${galleryId}/images/reorder`, { order })
      return data
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', variables.galleryId] })
      toast.success('Images reordered')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reorder images')
    },
  })
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ galleryId, imageId }: { galleryId: string; imageId: string }) => {
      await api.delete(`/v1/admin/galleries/${galleryId}/images/${imageId}`)
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['gallery-images', variables.galleryId] })
      qc.invalidateQueries({ queryKey: ['gallery', variables.galleryId] })
      toast.success('Image removed')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete image')
    },
  })
}

// ─── Banners ───────────────────────────────────────────────────────────────

export function useBanners(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['banners', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/banners', { params })
      return data as PaginatedResponse<Banner>
    },
  })
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/banners/${id}`)
      return (data as ApiResponse<Banner>).data
    },
    enabled: !!id,
  })
}

export function useCreateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/banners', payload)
      return data as ApiResponse<Banner>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create banner')
    },
  })
}

export function useUpdateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/banners/${id}`, payload)
      return data as ApiResponse<Banner>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['banner', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update banner')
    },
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/banners/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete banner')
    },
  })
}

// ─── Downloads ─────────────────────────────────────────────────────────────

export function useDownloads(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['downloads', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/downloads', { params })
      return data as PaginatedResponse<DownloadType>
    },
  })
}

export function useDownload(id: string) {
  return useQuery({
    queryKey: ['download', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/downloads/${id}`)
      return (data as ApiResponse<DownloadType>).data
    },
    enabled: !!id,
  })
}

export function useCreateDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/v1/admin/downloads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data as ApiResponse<DownloadType>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['downloads'] })
      toast.success('Download created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create download')
    },
  })
}

export function useUpdateDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      formData.append('_method', 'PUT')
      const { data } = await api.post(`/v1/admin/downloads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data as ApiResponse<DownloadType>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['download', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['downloads'] })
      toast.success('Download updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update download')
    },
  })
}

export function useDeleteDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/downloads/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['downloads'] })
      toast.success('Download deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete download')
    },
  })
}

// ─── Download Categories ───────────────────────────────────────────────────

export function useDownloadCategories() {
  return useQuery({
    queryKey: ['download-categories'],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/download-categories')
      return (data as ApiResponse<DownloadCategory[]>).data
    },
  })
}

export function useCreateDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data } = await api.post('/v1/admin/download-categories', payload)
      return data as ApiResponse<DownloadCategory>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['download-categories'] })
      toast.success('Download category created')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create category')
    },
  })
}

export function useUpdateDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/download-categories/${id}`, payload)
      return data as ApiResponse<DownloadCategory>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['download-categories'] })
      toast.success('Download category updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update category')
    },
  })
}

export function useDeleteDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/download-categories/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['download-categories'] })
      toast.success('Download category deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete category')
    },
  })
}

// ─── Developer Registrations ───────────────────────────────────────────────

export function useDeveloperRegistrations(params?: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: ['developer-registrations', params],
    queryFn: async () => {
      const { data } = await api.get('/v1/admin/developer-registrations', { params })
      return data as PaginatedResponse<DeveloperRegistration>
    },
  })
}

export function useDeveloperRegistration(id: string) {
  return useQuery({
    queryKey: ['developer-registration', id],
    queryFn: async () => {
      const { data } = await api.get(`/v1/admin/developer-registrations/${id}`)
      return (data as ApiResponse<DeveloperRegistration>).data
    },
    enabled: !!id,
  })
}

export function useUpdateDeveloperRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Record<string, unknown> & { id: string }) => {
      const { data } = await api.put(`/v1/admin/developer-registrations/${id}`, payload)
      return data as ApiResponse<DeveloperRegistration>
    },
    onSuccess: (result, variables) => {
      qc.setQueryData(['developer-registration', variables.id], result.data)
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Registration updated')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update registration')
    },
  })
}

export function useMarkDeveloperRegistrationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/v1/admin/developer-registrations/${id}/mark-read`)
      return data as ApiResponse<DeveloperRegistration>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Marked as read')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to mark as read')
    },
  })
}

export function useMarkDeveloperRegistrationReviewed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/v1/admin/developer-registrations/${id}/mark-reviewed`)
      return data as ApiResponse<DeveloperRegistration>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Marked as reviewed')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to mark as reviewed')
    },
  })
}

export function useSendDeveloperCredentials() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, sandbox_credentials }: { id: string; sandbox_credentials: string }) => {
      const { data } = await api.put(`/v1/admin/developer-registrations/${id}`, { sandbox_credentials })
      return data as ApiResponse<DeveloperRegistration>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Sandbox credentials saved')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save sandbox credentials')
    },
  })
}

export function useDeleteDeveloperRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/v1/admin/developer-registrations/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Registration deleted')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete registration')
    },
  })
}

// ─── Upload File (not media) ───────────────────────────────────────────────

export function useUploadFile() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/v1/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data as ApiResponse<{ id: string; url: string }>
    },
  })
}