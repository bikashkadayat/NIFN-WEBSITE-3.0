import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contentCategoriesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { ContentCategory } from '@/lib/types'

export function useContentCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['content-categories', params],
    queryFn: async () => {
      const res = await contentCategoriesApi.list(params) as { data: ContentCategory[] }
      return res
    },
  })
}

export function useContentCategory(id: string) {
  return useQuery({
    queryKey: ['content-category', id],
    queryFn: async () => {
      const res = await contentCategoriesApi.get(String(id)) as { data: ContentCategory }
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateContentCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => contentCategoriesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['content-categories'] }); toast.success('Category created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateContentCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => contentCategoriesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['content-categories'] }); toast.success('Category updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteContentCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contentCategoriesApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['content-categories'] }); toast.success('Category deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
