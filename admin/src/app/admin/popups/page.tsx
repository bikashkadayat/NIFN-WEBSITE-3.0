"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"
import { usePopupNotices, useDeletePopupNotice } from "@/hooks"
import { formatDate } from "@/lib/utils"
import { getTitle, type PopupNotice } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"

const typeBadgeVariant: Record<string, "default" | "warning" | "success" | "secondary"> = {
  info: "default",
  warning: "warning",
  success: "success",
  announcement: "secondary",
}

export default function PopupsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading } = usePopupNotices({ page })
  const deleteMutation = useDeletePopupNotice()

  type AnyRecord = Record<string, unknown>
  const rawData = (data?.data as unknown as AnyRecord)?.data ?? data?.data
  const popups: PopupNotice[] = Array.isArray(rawData) ? rawData as PopupNotice[] : []
  const paginationMeta = (data?.data as unknown as AnyRecord) ?? {}
  const currentPage = (paginationMeta.current_page as number) ?? 1
  const lastPage = (paginationMeta.last_page as number) ?? 1
  const total = (paginationMeta.total as number) ?? 0

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }, [deleteId, deleteMutation])

  const columns: Column<PopupNotice>[] = [
    {
      key: "sno",
      label: "S.No",
      render: (_item, idx) => (
        <span className="text-zinc-500">{(page - 1) * 15 + idx + 1}</span>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate block">
          {getTitle(item.translations, "—")}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (item) => (
        <Badge variant={typeBadgeVariant[item.type] ?? "secondary"} className="capitalize">
          {item.type}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={item.is_active ? "success" : "secondary"}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (item) => (
        <span className="text-zinc-500 text-sm">
          {item.start_date ? formatDate(item.start_date) : "—"}
        </span>
      ),
    },
    {
      key: "end_date",
      label: "End Date",
      render: (item) => (
        <span className="text-zinc-500 text-sm">
          {item.end_date ? formatDate(item.end_date) : "—"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Popup Notices" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Popup Notices</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage popup notifications</p>
        </div>
        <Link href="/admin/popups/new">
          <Button>
            <Plus size={16} />
            Add Popup
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : popups.length === 0 ? (
            <EmptyState
              title="No popup notices found"
              description="Get started by creating your first popup notice."
              action={{ label: "Add Popup", onClick: () => router.push("/admin/popups/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={popups}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/popups/${item.id}`)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                )}
              />
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  total={total}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Popup Notice"
        message="Are you sure you want to delete this popup notice? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
