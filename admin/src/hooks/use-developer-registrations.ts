import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { developerRegistrationsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { DeveloperRegistration } from '@/lib/types'

export function useDeveloperRegistrations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['developer-registrations', params],
    queryFn: async () => {
      const res = await developerRegistrationsApi.list(params) as { data: DeveloperRegistration[] }
      return res
    },
  })
}

export function useDeveloperRegistration(id: string | null | undefined) {
  return useQuery({
    queryKey: ['developer-registration', id],
    queryFn: async () => {
      if (!id) return null
      const res = await developerRegistrationsApi.get(String(id)) as { data: DeveloperRegistration }
      return res.data
    },
    enabled: !!id,
  })
}

export function useUpdateDeveloperRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => developerRegistrationsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Registration updated')
    },
    onError: () => toast.error('Failed to update registration'),
  })
}

export function useMarkDeveloperRegistrationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => developerRegistrationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Marked as read')
    },
    onError: () => toast.error('Failed to mark as read'),
  })
}

export function useMarkDeveloperRegistrationReviewed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => developerRegistrationsApi.markReviewed(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Marked as reviewed')
    },
    onError: () => toast.error('Failed to mark as reviewed'),
  })
}

export function useSendDeveloperCredentials() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, sandbox_credentials }: { id: string; sandbox_credentials: string }) =>
      developerRegistrationsApi.update(id, { sandbox_credentials }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Sandbox credentials saved')
    },
    onError: () => toast.error('Failed to save sandbox credentials'),
  })
}

export function useDeleteDeveloperRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => developerRegistrationsApi.delete(String(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['developer-registrations'] })
      qc.invalidateQueries({ queryKey: ['developer-registration-unread-count'] })
      toast.success('Deleted')
    },
    onError: () => toast.error('Failed to delete'),
  })
}
