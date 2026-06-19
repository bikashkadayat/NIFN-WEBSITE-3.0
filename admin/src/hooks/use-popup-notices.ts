import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { popupNoticesApi } from '@/lib/api'
import { toast } from 'sonner'
import type { PopupNotice } from '@/lib/types'

export function usePopupNotices(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['popup-notices', params],
    queryFn: async () => {
      const res = await popupNoticesApi.list(params) as { data: PopupNotice[] }
      return res
    },
  })
}

export function usePopupNotice(id: number | string) {
  return useQuery({
    queryKey: ['popup-notice', id],
    queryFn: async () => { const res = await popupNoticesApi.get(Number(id)) as { data: PopupNotice }; return res.data },
    enabled: !!id,
  })
}

export function useCreatePopupNotice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => popupNoticesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['popup-notices'] }); toast.success('Popup notice created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdatePopupNotice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => popupNoticesApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['popup-notice', id], (res as { data: PopupNotice }).data)
      qc.invalidateQueries({ queryKey: ['popup-notices'] })
      toast.success('Popup notice updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeletePopupNotice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => popupNoticesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['popup-notices'] }); toast.success('Popup notice deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
