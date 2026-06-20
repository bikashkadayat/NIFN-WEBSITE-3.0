import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { newsCategoriesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { NewsCategory } from '@/lib/types'

export function useNewsCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['news-categories', params],
    queryFn: async () => {
      const res = await newsCategoriesApi.list(params) as { data: NewsCategory[] }
      return res
    },
  })
}

export function useNewsCategory(id: string) {
  return useQuery({
    queryKey: ['news-category', id],
    queryFn: async () => {
      const res = await newsCategoriesApi.get(String(id)) as { data: NewsCategory }
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => newsCategoriesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-categories'] }); toast.success('Category created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => newsCategoriesApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-categories'] }); toast.success('Category updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteNewsCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => newsCategoriesApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-categories'] }); toast.success('Category deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
