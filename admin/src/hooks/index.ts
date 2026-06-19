export * from './use-news'
export * from './use-news-categories'
export * from './use-tags'
export * from './use-galleries'
export * from './use-media'
export * from './use-banners'
export * from './use-downloads'
export * from './use-content-categories'
export * from './use-download-categories'
export * from './use-popup-notices'
export * from './use-menus'
export * from './use-settings'
export * from './use-users'
export * from './use-contact-submissions'
export * from './use-newsletter-subscriptions'
export * from './use-developer-registrations'
export * from './use-activity-logs'
export * from './use-notifications'
export * from './use-reports'

// ─── Contents ────────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contentsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Content, PaginatedResponse } from '@/lib/types'

export function useContents(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: async () => {
      const res = await contentsApi.list(params) as { data: Content[]; meta?: PaginatedResponse<Content> }
      return res
    },
  })
}

export function useContent(id: string | number) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: async () => {
      const res = await contentsApi.get(id) as { data: Content }
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => contentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content created successfully')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to create content')
    },
  })
}

export function useUpdateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: unknown }) => contentsApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['content', id], (res as { data: Content }).data)
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content updated successfully')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to update content')
    },
  })
}

export function useDeleteContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => contentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] })
      toast.success('Content deleted')
    },
    onError: () => toast.error('Failed to delete content'),
  })
}
