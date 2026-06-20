"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/hooks/use-tags"
import type { Tag, Locale } from "@/lib/types"
import { getTitle, getTranslation } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Modal } from "@/components/ui/modal"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { SlugInput } from "@/components/ui/slug-input"

type AnyRecord = Record<string, unknown>

interface FormState {
  translations: Record<Locale, { name: string }>
  slug: string
}

const emptyForm = (): FormState => ({
  translations: { en: { name: "" }, ne: { name: "" } },
  slug: "",
})

export default function TagsPage() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())

  const tagsQuery = useTags({ page })
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const rawData = (tagsQuery?.data as unknown as AnyRecord)?.data ?? tagsQuery?.data
  const tags = Array.isArray(rawData) ? (rawData as Tag[]) : []
  const meta = (tagsQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const openCreate = () => {
    setForm(emptyForm())
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (tag: Tag) => {
    const en = getTranslation(tag.translations, "en")
    const ne = getTranslation(tag.translations, "ne")
    setForm({
      translations: {
        en: { name: en.name ?? en.title ?? "" },
        ne: { name: ne.name ?? ne.title ?? "" },
      },
      slug: tag.slug,
    })
    setEditingId(tag.id)
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
      translations: [
        { locale: "en", name: form.translations.en.name },
        { locale: "ne", name: form.translations.ne.name },
      ],
    }
    if (editingId) {
      await updateTag.mutateAsync({ id: editingId, data: payload })
    } else {
      await createTag.mutateAsync(payload)
    }
    setModalOpen(false)
  }

  const columns: Column<Tag>[] = [
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
      key: "usage_count",
      label: "Usage Count",
      render: (item) => <span className="text-zinc-600 dark:text-zinc-400">{item.usage_count ?? 0}</span>,
    },
  ]

  const isPending = createTag.isPending || updateTag.isPending

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Tags" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Tags</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage content tags</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Create New
        </Button>
      </div>

      <Card>
        <div className="p-4">
          {tagsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : tags.length === 0 ? (
            <EmptyState
              title="No tags found"
              description="Create your first tag."
              action={{ label: "Create New", onClick: openCreate }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={tags}
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
        title={editingId ? "Edit Tag" : "Create Tag"}
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
                  placeholder={`Tag name in ${locale === "en" ? "English" : "Nepali"}`}
                />
              </div>
            )}
          </LocaleTabs>

          <SlugInput
            value={form.slug}
            onChange={(s) => setForm((prev) => ({ ...prev, slug: s }))}
            sourceValue={form.translations.en.name}
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
          await deleteTag.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Tag"
        message="Are you sure you want to delete this tag? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteTag.isPending}
      />
    </div>
  )
}
