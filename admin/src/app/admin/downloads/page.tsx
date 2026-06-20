"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { useDownloads, useDeleteDownload, useDownloadCategories } from "@/hooks"
import { formatDate, formatFileSize } from "@/lib/utils"
import { getTitle, type Download } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function DownloadsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: downloadsRes, isLoading } = useDownloads({
    page,
    search,
    status,
    category_id: categoryId ? Number(categoryId) : undefined,
  })
  const { data: categoriesRes } = useDownloadCategories({ per_page: 100 })
  const deleteDownload = useDeleteDownload()

  type AnyRecord = Record<string, unknown>

  const rawCatData = (categoriesRes?.data as unknown as AnyRecord)?.data ?? categoriesRes?.data
  const categories = Array.isArray(rawCatData) ? rawCatData as AnyRecord[] : []

  const rawDownloadsData = (downloadsRes?.data as unknown as AnyRecord)?.data ?? downloadsRes?.data
  const downloads: Download[] = Array.isArray(rawDownloadsData) ? rawDownloadsData as Download[] : []
  const paginationMeta = (downloadsRes?.data as unknown as AnyRecord) ?? {}
  const currentPage = (paginationMeta.current_page as number) ?? 1
  const lastPage = (paginationMeta.last_page as number) ?? 1
  const total = (paginationMeta.total as number) ?? 0

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    await deleteDownload.mutateAsync(deleteId)
    setDeleteId(null)
  }, [deleteId, deleteDownload])

  const getCategoryName = (item: Download): string => {
    if (item.category) return getTitle(item.category.translations, "Uncategorized")
    if (item.category_id) {
      const cat = categories.find((c) => c.id === item.category_id)
      if (cat) return getTitle((cat.translations as { locale: string; title?: string; name?: string }[]) ?? [], "Uncategorized")
    }
    return "Uncategorized"
  }

  const columns: Column<Download>[] = [
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
      key: "category",
      label: "Category",
      render: (item) => (
        <Badge variant="secondary">{getCategoryName(item)}</Badge>
      ),
    },
    {
      key: "file",
      label: "File Info",
      render: (item) => (
        <div className="text-sm">
          <p className="text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
            {item.file_name ?? "—"}
          </p>
          {item.file_size != null && (
            <p className="text-zinc-400 text-xs">{formatFileSize(item.file_size)}</p>
          )}
        </div>
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
      key: "download_count",
      label: "Downloads",
      render: (item) => (
        <span className="text-zinc-600">{item.download_count ?? 0}</span>
      ),
    },
  ]

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({
      value: String(c.id),
      label: getTitle((c.translations as { locale: string; title?: string; name?: string }[]) ?? [], "Unnamed"),
    })),
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Downloads" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Downloads</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage downloadable files</p>
        </div>
        <Link href="/admin/downloads/new">
          <Button>
            <Plus size={16} />
            Add Download
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search downloads..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9"
            />
          </div>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="w-full sm:w-44"
          />
          <Select
            options={categoryOptions}
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
            className="w-full sm:w-52"
          />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : downloads.length === 0 ? (
            <EmptyState
              title="No downloads found"
              description="Get started by adding your first downloadable file."
              action={{ label: "Add Download", onClick: () => router.push("/admin/downloads/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={downloads}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/downloads/${item.id}`)}
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
        title="Delete Download"
        message="Are you sure you want to delete this download? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteDownload.isPending}
      />
    </div>
  )
}
