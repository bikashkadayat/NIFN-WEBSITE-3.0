"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useBanners, useDeleteBanner } from "@/hooks"
import { getTitle, type Banner } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Spinner } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Card } from "@/components/ui/card"

export default function BannersPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useBanners({ page })
  const deleteMutation = useDeleteBanner()

  type AnyRecord = Record<string, unknown>
  const rawData = (data?.data as unknown as AnyRecord)?.data ?? data?.data
  const banners: Banner[] = Array.isArray(rawData) ? rawData as Banner[] : []
  const paginationMeta = (data?.data as unknown as AnyRecord) ?? {}
  const currentPage = (paginationMeta.current_page as number) ?? 1
  const lastPage = (paginationMeta.last_page as number) ?? 1
  const total = (paginationMeta.total as number) ?? 0

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }, [deleteId, deleteMutation])

  const columns: Column<Banner>[] = [
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
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {getTitle(item.translations, "—")}
        </span>
      ),
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (item) =>
        item.image?.url ? (
          <img
            src={item.image.url}
            alt={getTitle(item.translations, "Banner")}
            className="h-10 w-16 rounded object-cover border border-zinc-200"
          />
        ) : (
          <span className="text-zinc-400 text-sm">No image</span>
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
      key: "sort_order",
      label: "Sort Order",
      render: (item) => <span className="text-zinc-600">{item.sort_order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Banners" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Banners</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage homepage banners</p>
        </div>
        <Link href="/admin/banners/new">
          <Button>
            <Plus size={16} />
            Add Banner
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : banners.length === 0 ? (
            <EmptyState
              title="No banners found"
              description="Get started by creating your first banner."
              action={{ label: "Add Banner", onClick: () => router.push("/admin/banners/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={banners}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/banners/${item.id}`)}
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
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
