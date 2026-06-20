import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bannersApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Banner } from '@/lib/types'

export function useBanners(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['banners', params],
    queryFn: async () => {
      const res = await bannersApi.list(params) as { data: Banner[] }
      return res
    },
  })
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: async () => { const res = await bannersApi.get(String(id)) as { data: Banner }; return res.data },
    enabled: !!id,
  })
}

export function useCreateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => bannersApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['banners'] }); toast.success('Banner created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => bannersApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['banner', id], (res as { data: Banner }).data)
      qc.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bannersApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['banners'] }); toast.success('Banner deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
