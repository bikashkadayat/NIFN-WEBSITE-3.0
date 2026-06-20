import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactSubmissionsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { ContactSubmission } from '@/lib/types'

export function useContactSubmissions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['contact-submissions', params],
    queryFn: async () => { const res = await contactSubmissionsApi.list(params) as { data: ContactSubmission[] }; return res },
  })
}

export function useContactSubmission(id: string) {
  return useQuery({
    queryKey: ['contact-submission', id],
    queryFn: async () => { const res = await contactSubmissionsApi.get(String(id)) as { data: ContactSubmission }; return res.data },
    enabled: !!id,
  })
}

export function useMarkContactRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contactSubmissionsApi.markRead(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contact-submissions'] }); toast.success('Marked as read') },
    onError: () => toast.error('Failed'),
  })
}

export function useDeleteContactSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contactSubmissionsApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['contact-submissions'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
