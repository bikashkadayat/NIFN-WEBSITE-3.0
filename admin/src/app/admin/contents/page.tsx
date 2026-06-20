'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useContents, useDeleteContent } from '@/hooks'
import { getTitle } from '@/lib/types'
import type { Content } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/ui/data-table'
import { Pagination } from '@/components/ui/pagination'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/ui/empty-state'

export default function ContentsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [portalFilter, setPortalFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useContents({ page, search, portal_type: portalFilter || undefined })
  const deleteMutation = useDeleteContent()

  const contents = (data?.data ?? []) as Content[]
  const meta = data as { current_page?: number; last_page?: number; total?: number; meta?: { current_page: number; last_page: number; total: number } }
  const currentPage = meta?.meta?.current_page ?? meta?.current_page ?? 1
  const lastPage = meta?.meta?.last_page ?? meta?.last_page ?? 1
  const total = meta?.meta?.total ?? meta?.total ?? 0

  const columns: Column<Content>[] = [
    {
      key: 'id',
      label: 'S.No',
      render: (_item, idx) => <span className="text-zinc-500 text-sm">{(page - 1) * 15 + idx + 1}</span>,
    },
    {
      key: 'translations',
      label: 'Title',
      render: (item) => {
        const title = getTitle(item.translations ?? [])
        return (
          <button onClick={() => router.push(`/admin/contents/${item.id}`)} className="font-medium text-zinc-900 hover:text-cyan-600 text-left">
            {title || <span className="italic text-zinc-400">{item.slug}</span>}
          </button>
        )
      },
    },
    { key: 'slug', label: 'Slug', render: (item) => <span className="text-zinc-500 text-sm font-mono">{item.slug}</span> },
    {
      key: 'portal_type',
      label: 'Portal',
      render: (item) => (
        <Badge variant={item.portal_type === 'developer' ? 'default' : 'secondary'}>
          {item.portal_type === 'developer' ? 'Developer' : 'Website'}
        </Badge>
      ),
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.is_published ? 'success' : 'secondary'}>
          {item.is_published ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Created', render: (item) => <span className="text-zinc-500 text-sm">{formatDate(item.created_at)}</span> },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contents' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Contents</h1>
        <Link href="/admin/contents/create">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white"><Plus size={16} /> Create New</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search contents..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="sm:w-72" />
        <Select
          options={[{ value: '', label: 'All Portals' }, { value: 'website', label: 'Website' }, { value: 'developer', label: 'Developer Portal' }]}
          value={portalFilter} onChange={(e) => { setPortalFilter(e.target.value); setPage(1) }} className="sm:w-48"
        />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={24} /></div>
      ) : contents.length === 0 ? (
        <EmptyState title="No contents found" description="Create your first content page." action={{ label: 'Create Content', onClick: () => router.push('/admin/contents/create') }} />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={contents}
            actionColumn={(item) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/contents/${item.id}`)}><Pencil size={14} /></Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)}><Trash2 size={14} className="text-red-500" /></Button>
              </div>
            )}
          />
          <Pagination currentPage={currentPage} lastPage={lastPage} total={total} onPageChange={setPage} />
        </>
      )}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deleteMutation.mutateAsync(deleteId); setDeleteId(null) } }}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
