import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import type { DashboardStats } from '@/lib/types'

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const res = await dashboardApi.stats() as { data: DashboardStats }
        return res.data
      } catch {
        return null
      }
    },
  })
}
