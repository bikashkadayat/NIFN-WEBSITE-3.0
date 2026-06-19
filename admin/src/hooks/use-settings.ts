import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '@/lib/api'
import { toast } from 'sonner'
import type { Setting } from '@/lib/types'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => { const res = await settingsApi.list() as { data: Setting[] }; return res.data },
  })
}

export function useBatchUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (settings: { key: string; value: string }[]) => settingsApi.batchUpdate(settings),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); toast.success('Settings saved') },
    onError: () => toast.error('Failed to save settings'),
  })
}
