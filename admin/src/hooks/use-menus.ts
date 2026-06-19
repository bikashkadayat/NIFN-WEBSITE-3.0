import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menusApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Menu, MenuItem } from '@/lib/types'

export function useMenus(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['menus', params],
    queryFn: async () => { const res = await menusApi.list(params) as { data: Menu[] }; return res.data },
  })
}

export function useMenuItems(menuId: number | string) {
  return useQuery({
    queryKey: ['menu-items', menuId],
    queryFn: async () => { const res = await menusApi.getItems(Number(menuId)) as { data: MenuItem[] }; return res.data },
    enabled: !!menuId,
  })
}

export function useCreateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: unknown }) => menusApi.createItem(menuId, data),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item added') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, itemId, data }: { menuId: number; itemId: number; data: unknown }) =>
      menusApi.updateItem(menuId, itemId, data),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, itemId }: { menuId: number; itemId: number }) => menusApi.deleteItem(menuId, itemId),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}

export function useReorderMenuItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, order }: { menuId: number; order: { id: number; sort_order: number; parent_id?: number | null }[] }) =>
      menusApi.reorderItems(menuId, order),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }) },
    onError: () => toast.error('Reorder failed'),
  })
}
