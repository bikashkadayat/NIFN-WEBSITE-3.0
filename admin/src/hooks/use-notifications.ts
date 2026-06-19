import { useQuery } from '@tanstack/react-query'
import client from '@/lib/api'
import type { Notification } from '@/lib/types'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await client.get<{ data: Notification[] }>('/admin/notifications')
        return res.data.data ?? []
      } catch {
        return [] as Notification[]
      }
    },
  })
}
