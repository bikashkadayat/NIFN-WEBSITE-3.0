"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Search, Star } from "lucide-react"
import { useNewsList, useDeleteNewsItem, useNewsCategories } from "@/hooks"
import { formatDate } from "@/lib/utils"
import { getTitle, type News } from "@/lib/types"
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
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
]

export default function NewsListPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: newsRes, isLoading } = useNewsList({
    page,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(categoryId ? { category_id: Number(categoryId) } : {}),
  })
  const { data: categoriesRes } = useNewsCategories({ per_page: 100 })
  const deleteNews = useDeleteNewsItem()

  type AnyRecord = Record<string, unknown>

  const rawCategoriesData = (categoriesRes?.data as unknown as AnyRecord)?.data ?? categoriesRes?.data
  const rawCategories = Array.isArray(rawCategoriesData) ? rawCategoriesData as AnyRecord[] : []

  const rawNewsData = (newsRes?.data as unknown as AnyRecord)?.data ?? newsRes?.data
  const newsData: News[] = Array.isArray(rawNewsData) ? rawNewsData as News[] : []
  const paginationMeta = (newsRes?.data as unknown as AnyRecord) ?? {}
  const currentPage = (paginationMeta.current_page as number) ?? 1
  const lastPage = (paginationMeta.last_page as number) ?? 1
  const total = (paginationMeta.total as number) ?? 0

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    await deleteNews.mutateAsync(deleteId)
    setDeleteId(null)
  }, [deleteId, deleteNews])

  const getCategoryName = (item: News): string => {
    if (item.category) return getTitle(item.category.translations, "Uncategorized")
    if (item.category_id) {
      const cat = rawCategories.find((c) => c.id === item.category_id)
      if (cat) return getTitle((cat.translations as { locale: string; title?: string; name?: string }[]) ?? [], "Uncategorized")
    }
    return "Uncategorized"
  }

  const columns: Column<News>[] = [
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
      render: (item) => {
        const title = getTitle(item.translations)
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
              {title || "—"}
            </span>
            {item.is_breaking && (
              <Badge variant="destructive" className="shrink-0">Breaking</Badge>
            )}
          </div>
        )
      },
    },
    {
      key: "category",
      label: "Category",
      render: (item) => (
        <Badge variant="secondary">{getCategoryName(item)}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={item.is_published ? "success" : "warning"}>
          {item.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "featured",
      label: "Featured",
      render: (item) =>
        item.is_featured ? (
          <Star size={16} className="text-amber-400 fill-amber-400" />
        ) : (
          <span className="text-zinc-300">—</span>
        ),
    },
    {
      key: "published_at",
      label: "Date",
      render: (item) => (
        <span className="text-zinc-500 text-sm">
          {item.published_at
            ? formatDate(item.published_at)
            : formatDate(item.created_at)}
        </span>
      ),
    },
  ]

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...rawCategories.map((c) => ({
      value: String(c.id),
      label: getTitle((c.translations as { locale: string; title?: string; name?: string }[]) ?? [], "Unnamed"),
    })),
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "News" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">News</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage news articles</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus size={16} />
            Add News
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search news..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="w-full sm:w-44"
          />
          <Select
            options={categoryOptions}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setPage(1)
            }}
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
          ) : newsData.length === 0 ? (
            <EmptyState
              title="No news found"
              description="Get started by creating your first news article."
              action={{ label: "Add News", onClick: () => router.push("/admin/news/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={newsData}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/news/${item.id}`)}
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
        title="Delete News"
        message="Are you sure you want to delete this news article? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteNews.isPending}
      />
    </div>
  )
}
