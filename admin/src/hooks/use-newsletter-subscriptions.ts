import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { newsletterApi } from '@/lib/api'
import { toast } from 'sonner'
import type { NewsletterSubscriber } from '@/lib/types'

export function useNewsletterSubscribers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['newsletter-subscribers', params],
    queryFn: async () => { const res = await newsletterApi.list(params) as { data: NewsletterSubscriber[] }; return res },
  })
}

export function useUnsubscribeNewsletter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => newsletterApi.unsubscribe(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['newsletter-subscribers'] }); toast.success('Unsubscribed') },
    onError: () => toast.error('Failed'),
  })
}

export function useDeleteNewsletterSubscriber() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => newsletterApi.delete(String(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['newsletter-subscribers'] }); toast.success('Deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
