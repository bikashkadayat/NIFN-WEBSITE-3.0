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

export function useMenuItems(menuId: string) {
  return useQuery({
    queryKey: ['menu-items', menuId],
    queryFn: async () => { const res = await menusApi.getItems(menuId) as { data: MenuItem[] }; return res.data },
    enabled: !!menuId,
  })
}

export function useCreateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: string; data: unknown }) => menusApi.createItem(menuId, data),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item added') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, itemId, data }: { menuId: string; itemId: string; data: unknown }) =>
      menusApi.updateItem(menuId, itemId, data),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item updated') },
    onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Failed') },
  })
}

export function useDeleteMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, itemId }: { menuId: string; itemId: string }) => menusApi.deleteItem(menuId, itemId),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }); toast.success('Item deleted') },
    onError: () => toast.error('Failed to delete'),
  })
}

export function useReorderMenuItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ menuId, order }: { menuId: string; order: { id: string; sort_order: number; parent_id?: string | null }[] }) =>
      menusApi.reorderItems(menuId, order),
    onSuccess: (_, { menuId }) => { qc.invalidateQueries({ queryKey: ['menu-items', menuId] }) },
    onError: () => toast.error('Reorder failed'),
  })
}
