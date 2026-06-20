"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Images, ImageIcon } from "lucide-react"
import { useGalleries, useDeleteGallery } from "@/hooks/use-galleries"
import type { Gallery } from "@/lib/types"
import { getTitle } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"

type AnyRecord = Record<string, unknown>

export default function GalleriesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const galleriesQuery = useGalleries({ page })
  const deleteGallery = useDeleteGallery()

  const rawData = (galleriesQuery?.data as unknown as AnyRecord)?.data ?? galleriesQuery?.data
  const galleries = Array.isArray(rawData) ? (rawData as Gallery[]) : []
  const meta = (galleriesQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const columns: Column<Gallery>[] = [
    {
      key: "sno",
      label: "S.No",
      render: (_, idx) => <span className="text-zinc-500">{(page - 1) * 15 + idx + 1}</span>,
    },
    {
      key: "title",
      label: "Title",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {getTitle(item.translations, item.slug)}
        </span>
      ),
    },
    {
      key: "cover_image",
      label: "Cover",
      render: (item) =>
        item.cover_image?.thumbnail_url || item.cover_image?.url ? (
          <img
            src={item.cover_image.thumbnail_url ?? item.cover_image.url}
            alt="cover"
            className="h-10 w-16 rounded object-cover border border-zinc-200"
          />
        ) : (
          <div className="flex h-10 w-16 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <ImageIcon size={14} className="text-zinc-400" />
          </div>
        ),
    },
    {
      key: "images_count",
      label: "Photos",
      render: (item) => <span className="text-zinc-600 dark:text-zinc-400">{item.images_count ?? 0}</span>,
    },
    {
      key: "is_published",
      label: "Status",
      render: (item) =>
        item.is_published ? (
          <Badge variant="success">Published</Badge>
        ) : (
          <Badge variant="secondary">Draft</Badge>
        ),
    },
    {
      key: "event_date",
      label: "Date",
      render: (item) => (
        <span className="text-zinc-500 text-sm">
          {item.event_date ? new Date(item.event_date).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Galleries" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Galleries</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage photo galleries</p>
        </div>
        <Link href="/admin/galleries/new">
          <Button>
            <Plus size={16} />
            Create New
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4">
          {galleriesQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : galleries.length === 0 ? (
            <EmptyState
              title="No galleries found"
              description="Get started by creating your first gallery."
              action={{ label: "Create New", onClick: () => router.push("/admin/galleries/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={galleries}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/galleries/${item.id}`}>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit size={14} />
                      </Button>
                    </Link>
                    <Link href={`/admin/galleries/${item.id}/images`}>
                      <Button variant="ghost" size="sm" title="Manage Images">
                        <Images size={14} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  </div>
                )}
              />
              <div className="mt-4">
                <Pagination currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await deleteGallery.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Gallery"
        message="Are you sure you want to delete this gallery? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteGallery.isPending}
      />
    </div>
  )
}
