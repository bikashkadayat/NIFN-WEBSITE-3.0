import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => { const res = await usersApi.list(params) as { data: User[] }; return res },
  })
}

export function useUser(id: number | string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => { const res = await usersApi.get(Number(id)) as { data: User }; return res.data },
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => usersApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User created') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) => usersApi.update(id, data),
    onSuccess: (res, { id }) => {
      qc.setQueryData(['user', id], (res as { data: User }).data)
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => usersApi.delete(id as number),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
