import { useQuery } from '@tanstack/react-query'
import { activityLogsApi } from '@/lib/api'
import type { ActivityLog } from '@/lib/types'

export function useActivityLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: async () => { const res = await activityLogsApi.list(params) as { data: ActivityLog[] }; return res },
  })
}
