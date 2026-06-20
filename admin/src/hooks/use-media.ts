import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Media } from '@/lib/types'

export function useMedia(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: async () => {
      const res = await mediaApi.list(params) as { data: Media[] }
      return res
    },
  })
}

export function useUploadMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => mediaApi.upload(formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); toast.success('File uploaded') },
    onError: () => toast.error('Upload failed'),
  })
}

export function useUpdateMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { alt_text?: string } }) => mediaApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }) },
    onError: () => toast.error('Failed to update'),
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mediaApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media'] }); toast.success('File deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
