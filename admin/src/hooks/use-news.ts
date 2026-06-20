import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { newsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { News } from '@/lib/types'

interface NewsParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  category_id?: number
}

export function useNewsList(params?: NewsParams) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: async () => {
      const res = await newsApi.list(params as Record<string, unknown>) as { data: News[]; meta?: unknown }
      return res
    },
  })
}

export function useNewsItem(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const res = await newsApi.get(String(id)) as { data: News }
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => newsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News created successfully')
    },
    onError: (err: { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }) => {
      const data = err.response?.data
      if (data?.errors) {
        const firstField = Object.keys(data.errors)[0]
        const firstMsg = data.errors[firstField][0]
        toast.error(`${firstField}: ${firstMsg}`)
      } else {
        toast.error(data?.message || 'Failed to create news')
      }
    },
  })
}

export function useUpdateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => newsApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['news', id], (res as { data: News }).data)
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News updated successfully')
    },
    onError: (err: { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }) => {
      const data = err.response?.data
      if (data?.errors) {
        const firstField = Object.keys(data.errors)[0]
        const firstMsg = data.errors[firstField][0]
        toast.error(`${firstField}: ${firstMsg}`)
      } else {
        toast.error(data?.message || 'Failed to update news')
      }
    },
  })
}

export function useDeleteNewsItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => newsApi.delete(String(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['news'] })
      toast.success('News deleted')
    },
    onError: () => toast.error('Failed to delete news'),
  })
}
