import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { toast } from 'sonner'
import type { User } from '@/lib/types'

type RoleObj = { slug?: string; name?: string; permissions?: string[] }

function normalizeUser(u: Record<string, unknown>): User {
  const roleObj = u.role as RoleObj | string | null | undefined
  const isObj = typeof roleObj === 'object' && roleObj !== null
  // DB slugs use hyphens (super-admin), frontend uses underscores (super_admin)
  const rawSlug = (isObj ? (roleObj as RoleObj).slug ?? '' : roleObj ?? '') as string
  return {
    ...(u as unknown as User),
    role: rawSlug.replace(/-/g, '_'),
    role_name: (isObj ? (roleObj as RoleObj).name ?? '' : (u.role_name ?? rawSlug)) as string,
    permissions: (isObj ? ((roleObj as RoleObj).permissions ?? []) : (u.permissions ?? [])) as string[],
  }
}

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      type PageRes = { data: Record<string, unknown>[]; current_page?: number; last_page?: number; total?: number }
      const res = await usersApi.list(params) as PageRes
      return { ...res, data: (res.data ?? []).map(normalizeUser) }
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await usersApi.get(String(id)) as { data: Record<string, unknown> }
      return normalizeUser(res.data)
    },
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
    mutationFn: ({ id, data }: { id: string; data: unknown }) => usersApi.update(id, data),
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
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('User deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}
