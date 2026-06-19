'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/use-queries'
import { Modal } from '@/components/modal'

export default function TagsPage() {
  const { data: tags, isLoading } = useTags()
  const createMutation = useCreateTag()
  const updateMutation = useUpdateTag()
  const deleteMutation = useDeleteTag()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name_en: '', name_ne: '',
    slug_en: '', slug_ne: '',
  })

  const openCreate = () => {
    setEditingId(null)
    setForm({ name_en: '', name_ne: '', slug_en: '', slug_ne: '' })
    setModalOpen(true)
  }

  const openEdit = (tag: any) => {
    setEditingId(tag.id)
    const enTrans = tag.translations?.find((t: any) => t.locale === 'en')
    const neTrans = tag.translations?.find((t: any) => t.locale === 'ne')
    setForm({
      name_en: enTrans?.name || '',
      name_ne: neTrans?.name || '',
      slug_en: enTrans?.slug || '',
      slug_ne: neTrans?.slug || '',
    })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      translations: [
        { locale: 'en', name: form.name_en, slug: form.slug_en },
        { locale: 'ne', name: form.name_ne || form.name_en, slug: form.slug_ne || form.slug_en },
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
    if (confirm('Delete this tag?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Tag
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name (EN)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name (NE)</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug (EN)</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : tags?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">No tags found</td></tr>
            ) : (
              tags?.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {tag.translations?.find((t: any) => t.locale === 'en')?.name || tag.name || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tag.translations?.find((t: any) => t.locale === 'ne')?.name || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tag.translations?.find((t: any) => t.locale === 'en')?.slug || tag.slug || '--'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(tag)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(tag.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Tag' : 'Create Tag'}>
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