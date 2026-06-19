"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  useContentCategories,
  useCreateContentCategory,
  useUpdateContentCategory,
  useDeleteContentCategory,
} from "@/hooks/use-content-categories"
import type { ContentCategory, Locale } from "@/lib/types"
import { getTitle, getTranslation } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Modal } from "@/components/ui/modal"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { SlugInput } from "@/components/ui/slug-input"

type AnyRecord = Record<string, unknown>

interface FormState {
  translations: Record<Locale, { name: string }>
  slug: string
  sort_order: number
  is_active: boolean
}

const emptyForm = (): FormState => ({
  translations: { en: { name: "" }, ne: { name: "" } },
  slug: "",
  sort_order: 0,
  is_active: true,
})

export default function ContentCategoriesPage() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())

  const categoriesQuery = useContentCategories({ page })
  const createCategory = useCreateContentCategory()
  const updateCategory = useUpdateContentCategory()
  const deleteCategory = useDeleteContentCategory()

  const rawData = (categoriesQuery?.data as unknown as AnyRecord)?.data ?? categoriesQuery?.data
  const categories = Array.isArray(rawData) ? (rawData as ContentCategory[]) : []
  const meta = (categoriesQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const openCreate = () => {
    setForm(emptyForm())
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (cat: ContentCategory) => {
    const en = getTranslation(cat.translations, "en")
    const ne = getTranslation(cat.translations, "ne")
    setForm({
      translations: {
        en: { name: en.name ?? en.title ?? "" },
        ne: { name: ne.name ?? ne.title ?? "" },
      },
      slug: cat.slug,
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    })
    setEditingId(cat.id)
    setModalOpen(true)
  }

  const updateTranslation = (locale: Locale, value: string) => {
    setForm((prev) => ({
      ...prev,
      translations: { ...prev.translations, [locale]: { name: value } },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      slug: form.slug,
      sort_order: form.sort_order,
      is_active: form.is_active,
      translations: [
        { locale: "en", name: form.translations.en.name },
        { locale: "ne", name: form.translations.ne.name },
      ],
    }
    if (editingId) {
      await updateCategory.mutateAsync({ id: editingId, data: payload })
    } else {
      await createCategory.mutateAsync(payload)
    }
    setModalOpen(false)
  }

  const columns: Column<ContentCategory>[] = [
    {
      key: "sno",
      label: "S.No",
      render: (_, idx) => <span className="text-zinc-500">{(page - 1) * 15 + idx + 1}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {getTitle(item.translations, item.slug)}
        </span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (item) => (
        <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-xs">{item.slug}</code>
      ),
    },
    {
      key: "id",
      label: "Contents",
      render: () => <span className="text-zinc-400">—</span>,
    },
    {
      key: "is_active",
      label: "Status",
      render: (item) =>
        item.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
    },
  ]

  const isPending = createCategory.isPending || updateCategory.isPending

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Content Categories" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Content Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage content categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Create New
        </Button>
      </div>

      <Card>
        <div className="p-4">
          {categoriesQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : categories.length === 0 ? (
            <EmptyState
              title="No content categories found"
              description="Create your first content category."
              action={{ label: "Create New", onClick: openCreate }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={categories}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)} title="Edit">
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)} title="Delete">
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Category" : "Create Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <LocaleTabs>
            {(locale) => (
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.translations[locale].name}
                  onChange={(e) => updateTranslation(locale, e.target.value)}
                  placeholder={`Category name in ${locale === "en" ? "English" : "Nepali"}`}
                />
              </div>
            )}
          </LocaleTabs>

          <SlugInput
            value={form.slug}
            onChange={(s) => setForm((prev) => ({ ...prev, slug: s }))}
            sourceValue={form.translations.en.name}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sort Order</label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
              className="max-w-xs"
            />
          </div>

          <Switch
            checked={form.is_active}
            onCheckedChange={(v) => setForm((prev) => ({ ...prev, is_active: v }))}
            label="Active"
            id="cc_is_active"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending || !form.translations.en.name || !form.slug}>
              {isPending ? "Saving..." : editingId ? "Save Changes" : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await deleteCategory.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteCategory.isPending}
      />
    </div>
  )
}
