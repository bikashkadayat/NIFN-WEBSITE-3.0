import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Tag } from '@/lib/types'

export function useTags(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: async () => {
      const res = await tagsApi.list(params) as { data: Tag[] }
      return res
    },
  })
}

export function useTag(id: string) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: async () => { const res = await tagsApi.get(String(id)) as { data: Tag }; return res.data },
    enabled: !!id,
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => tagsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tags'] }); toast.success('Tag created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => tagsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tags'] }); toast.success('Tag updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tags'] }); toast.success('Tag deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
