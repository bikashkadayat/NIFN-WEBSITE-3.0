import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { downloadCategoriesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { DownloadCategory } from '@/lib/types'

export function useDownloadCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['download-categories', params],
    queryFn: async () => {
      const res = await downloadCategoriesApi.list(params) as { data: DownloadCategory[] }
      return res
    },
  })
}

export function useDownloadCategory(id: string) {
  return useQuery({
    queryKey: ['download-category', id],
    queryFn: async () => { const res = await downloadCategoriesApi.get(String(id)) as { data: DownloadCategory }; return res.data },
    enabled: !!id,
  })
}

export function useCreateDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => downloadCategoriesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); toast.success('Category created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => downloadCategoriesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); toast.success('Category updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteDownloadCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => downloadCategoriesApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); toast.success('Category deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
