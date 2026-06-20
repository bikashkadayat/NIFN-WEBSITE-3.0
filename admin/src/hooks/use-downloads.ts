import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { downloadsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Download } from '@/lib/types'

export function useDownloads(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['downloads', params],
    queryFn: async () => {
      const res = await downloadsApi.list(params) as { data: Download[] }
      return res
    },
  })
}

export function useDownload(id: string) {
  return useQuery({
    queryKey: ['download', id],
    queryFn: async () => { const res = await downloadsApi.get(String(id)) as { data: Download }; return res.data },
    enabled: !!id,
  })
}

export function useCreateDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData | unknown) => downloadsApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['downloads'] }); toast.success('Download created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | unknown }) => downloadsApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['download', id], (res as { data: Download }).data)
      qc.invalidateQueries({ queryKey: ['downloads'] })
      toast.success('Download updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => downloadsApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['downloads'] }); toast.success('Download deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
