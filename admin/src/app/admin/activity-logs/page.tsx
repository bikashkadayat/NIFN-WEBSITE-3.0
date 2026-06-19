"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { useActivityLogs } from "@/hooks/use-activity-logs"
import type { ActivityLog } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"

type AnyRecord = Record<string, unknown>

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const logsQuery = useActivityLogs({ page, search: search || undefined })

  const rawData = (logsQuery?.data as unknown as AnyRecord)?.data ?? logsQuery?.data
  const allLogs = Array.isArray(rawData) ? (rawData as ActivityLog[]) : []
  const meta = (logsQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const logs = useMemo(() => {
    if (!search) return allLogs
    const q = search.toLowerCase()
    return allLogs.filter(
      (l) =>
        l.action?.toLowerCase().includes(q) ||
        l.user_name?.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.subject_type?.toLowerCase().includes(q)
    )
  }, [allLogs, search])

  const columns: Column<ActivityLog>[] = [
    {
      key: "sno",
      label: "S.No",
      render: (_, idx) => <span className="text-zinc-500">{(page - 1) * 15 + idx + 1}</span>,
    },
    {
      key: "user_name",
      label: "User",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
          {item.user_name ?? item.user?.name ?? "System"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs font-mono">
          {item.action}
        </code>
      ),
    },
    {
      key: "subject_type",
      label: "Entity",
      render: (item) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {item.subject_type ? item.subject_type.split("\\").pop() : "—"}
          {item.subject_id ? ` #${item.subject_id}` : ""}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate block">
          {item.description ?? "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Date",
      render: (item) => (
        <span className="text-sm text-zinc-500 whitespace-nowrap">
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      key: "ip_address",
      label: "IP Address",
      render: (item) => (
        <span className="text-sm text-zinc-500 font-mono">{item.ip_address ?? "—"}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Activity Logs" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Activity Logs</h1>
        <p className="mt-1 text-sm text-zinc-500">View system activity and audit trail</p>
      </div>

      <Card>
        <div className="p-4 space-y-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search logs..."
              className="pl-9"
            />
          </div>

          {logsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState title="No activity logs" description="No logs found." />
          ) : (
            <>
              <DataTable columns={columns} data={logs} />
              <Pagination currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
