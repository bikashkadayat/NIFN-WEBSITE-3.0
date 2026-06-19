'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useNewsCategories, useCreateNewsCategory, useUpdateNewsCategory, useDeleteNewsCategory } from '@/hooks/use-queries'
import { Modal } from '@/components/modal'
import clsx from 'clsx'

export default function NewsCategoriesPage() {
  const { data: categories, isLoading } = useNewsCategories()
  const createMutation = useCreateNewsCategory()
  const updateMutation = useUpdateNewsCategory()
  const deleteMutation = useDeleteNewsCategory()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name_en: '', name_ne: '',
    slug_en: '', slug_ne: '',
    description_en: '', description_ne: '',
    sort_order: 0, is_active: true,
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({ name_en: '', name_ne: '', slug_en: '', slug_ne: '', description_en: '', description_ne: '', sort_order: 0, is_active: true })
    setModalOpen(true)
  }

  const openEdit = (cat: any) => {
    setEditingId(cat.id)
    const enTrans = cat.translations?.find((t: any) => t.locale === 'en')
    const neTrans = cat.translations?.find((t: any) => t.locale === 'ne')
    setForm({
      name_en: enTrans?.name || '', name_ne: neTrans?.name || '',
      slug_en: enTrans?.slug || '', slug_ne: neTrans?.slug || '',
      description_en: enTrans?.description || '', description_ne: neTrans?.description || '',
      sort_order: cat.sort_order ?? 0, is_active: cat.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      sort_order: form.sort_order,
      is_active: form.is_active,
      translations: [
        { locale: 'en', name: form.name_en, slug: form.slug_en, description: form.description_en || null },
        { locale: 'ne', name: form.name_ne || form.name_en, slug: form.slug_ne || form.slug_en, description: form.description_ne || null },
      ],
    }

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name (EN)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name (NE)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sort</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Active</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : categories?.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No categories found</td></tr>
            ) : (
              categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.translations?.find((t: any) => t.locale === 'en')?.name || cat.name || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cat.translations?.find((t: any) => t.locale === 'ne')?.name || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {cat.translations?.find((t: any) => t.locale === 'en')?.slug || cat.slug || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.sort_order}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    )}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input
                type="text"
                value={form.name_en}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, name_en: e.target.value }))
                  if (!editingId) setForm(prev => ({ ...prev, slug_en: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (नेपाली)</label>
              <input
                type="text"
                value={form.name_ne}
                onChange={(e) => setForm(prev => ({ ...prev, name_ne: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (English) *</label>
              <input
                type="text"
                value={form.slug_en}
                onChange={(e) => setForm(prev => ({ ...prev, slug_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (नेपाली)</label>
              <input
                type="text"
                value={form.slug_ne}
                onChange={(e) => setForm(prev => ({ ...prev, slug_ne: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
              <textarea
                value={form.description_en}
                onChange={(e) => setForm(prev => ({ ...prev, description_en: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (नेपाली)</label>
              <textarea
                value={form.description_ne}
                onChange={(e) => setForm(prev => ({ ...prev, description_ne: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                min={0}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}