"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import {
  useMenus,
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "@/hooks/use-menus"
import type { Menu, MenuItem, Locale } from "@/lib/types"
import { getTranslation } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Modal } from "@/components/ui/modal"

type AnyRecord = Record<string, unknown>

interface ItemForm {
  title_en: string
  title_ne: string
  url: string
  parent_id: number | null
  target: "_self" | "_blank"
  sort_order: number
  is_active: boolean
}

const emptyItemForm = (): ItemForm => ({
  title_en: "",
  title_ne: "",
  url: "",
  parent_id: null,
  target: "_self",
  sort_order: 0,
  is_active: true,
})

function MenuTab({ menu }: { menu: Menu }) {
  const itemsQuery = useMenuItems(menu.id)
  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()
  const deleteItem = useDeleteMenuItem()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState<ItemForm>(emptyItemForm())

  const items: MenuItem[] = itemsQuery.data ?? []

  const openCreate = () => {
    setForm(emptyItemForm())
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    const en = getTranslation(item.translations, "en")
    const ne = getTranslation(item.translations, "ne")
    setForm({
      title_en: en.title ?? en.name ?? "",
      title_ne: ne.title ?? ne.name ?? "",
      url: item.url,
      parent_id: item.parent_id ?? null,
      target: item.target,
      sort_order: item.sort_order,
      is_active: item.is_active,
    })
    setEditingId(item.id)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      url: form.url,
      parent_id: form.parent_id,
      target: form.target,
      sort_order: form.sort_order,
      is_active: form.is_active,
      translations: [
        { locale: "en", title: form.title_en },
        { locale: "ne", title: form.title_ne },
      ],
    }
    if (editingId) {
      await updateItem.mutateAsync({ menuId: menu.id, itemId: editingId, data: payload })
    } else {
      await createItem.mutateAsync({ menuId: menu.id, data: payload })
    }
    setModalOpen(false)
  }

  const getItemLabel = (item: MenuItem) => {
    const en = getTranslation(item.translations, "en")
    return en.title ?? en.name ?? item.url
  }

  const isPending = createItem.isPending || updateItem.isPending

  const parentOptions = [
    { value: "", label: "None (top-level)" },
    ...items
      .filter((i) => i.id !== editingId)
      .map((i) => ({ value: String(i.id), label: getItemLabel(i) })),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={openCreate}>
          <Plus size={14} />
          Add Item
        </Button>
      </div>

      {itemsQuery.isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size={20} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No menu items"
          description="Add items to this menu."
          action={{ label: "Add Item", onClick: openCreate }}
        />
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <GripVertical size={16} className="text-zinc-400 cursor-grab flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {getItemLabel(item)}
                  </span>
                  {item.parent_id && (
                    <Badge variant="secondary" className="text-xs">nested</Badge>
                  )}
                  {!item.is_active && (
                    <Badge variant="secondary" className="text-xs">inactive</Badge>
                  )}
                  {item.target === "_blank" && (
                    <Badge variant="secondary" className="text-xs">new tab</Badge>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{item.url}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)} title="Edit">
                  <Edit size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)} title="Delete">
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Menu Item" : "Add Menu Item"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title (EN)</label>
              <Input
                value={form.title_en}
                onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))}
                placeholder="Menu item title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title (NE)</label>
              <Input
                value={form.title_ne}
                onChange={(e) => setForm((p) => ({ ...p, title_ne: e.target.value }))}
                placeholder="मेनु शीर्षक"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="/about or https://example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Parent Item</label>
            <Select
              value={form.parent_id !== null ? String(form.parent_id) : ""}
              onChange={(v) => setForm((p) => ({ ...p, parent_id: v ? Number(v) : null }))}
              options={parentOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sort Order</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex gap-6">
            <Switch
              checked={form.target === "_blank"}
              onCheckedChange={(v) => setForm((p) => ({ ...p, target: v ? "_blank" : "_self" }))}
              label="Open in New Tab"
              id="item_new_tab"
            />
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
              label="Active"
              id="item_is_active"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending || !form.url}>
              {isPending ? "Saving..." : editingId ? "Save Changes" : "Add Item"}
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
          await deleteItem.mutateAsync({ menuId: menu.id, itemId: deleteId })
          setDeleteId(null)
        }}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item?"
        variant="danger"
        confirmLabel="Delete"
        loading={deleteItem.isPending}
      />
    </div>
  )
}

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header")

  const menusQuery = useMenus()
  const rawMenus = (menusQuery?.data as unknown as AnyRecord)?.data ?? menusQuery?.data
  const menus = Array.isArray(rawMenus) ? (rawMenus as Menu[]) : (Array.isArray(menusQuery?.data) ? menusQuery.data as Menu[] : [])

  const headerMenu = menus.find((m) => m.location === "header")
  const footerMenu = menus.find((m) => m.location === "footer")
  const activeMenu = activeTab === "header" ? headerMenu : footerMenu

  const tabs: { id: "header" | "footer"; label: string }[] = [
    { id: "header", label: "Header Menu" },
    { id: "footer", label: "Footer Menu" },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Menus" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Menus</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage navigation menus</p>
      </div>

      <Card>
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab.id
                    ? "border-cyan-600 text-cyan-700 dark:text-cyan-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <CardContent className="p-4">
          {menusQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size={24} />
            </div>
          ) : !activeMenu ? (
            <div className="text-center py-8 text-zinc-500">
              No {activeTab} menu found. Please create a menu with location &ldquo;{activeTab}&rdquo; in the database.
            </div>
          ) : (
            <MenuTab menu={activeMenu} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
