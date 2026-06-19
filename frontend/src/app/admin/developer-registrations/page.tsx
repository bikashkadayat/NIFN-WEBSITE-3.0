'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Eye, Mail, Pencil, RotateCcw, Search, Send, Trash2 } from 'lucide-react'
import {
  useDeleteDeveloperRegistration,
  useDeveloperRegistrations,
  useMarkDeveloperRegistrationRead,
  useMarkDeveloperRegistrationReviewed,
  useSendDeveloperCredentials,
  useUpdateDeveloperRegistration,
} from '@/hooks/use-queries'
import type { DeveloperRegistration } from '@/types'
import { Pagination } from '@/components/pagination'
import { Modal } from '@/components/ui/Modal'
import clsx from 'clsx'

type StatusFilter = 'all' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'contacted'

const statusOptions: Record<DeveloperRegistration['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  contacted: 'bg-gray-100 text-gray-800',
}

const statusDot: Record<DeveloperRegistration['status'], string> = {
  pending: 'bg-amber-500',
  reviewing: 'bg-blue-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  contacted: 'bg-gray-500',
}

export default function DeveloperRegistrationsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DeveloperRegistration | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [sandboxCredentials, setSandboxCredentials] = useState('')

  const params: Record<string, string | number | boolean> = { page, per_page: 15 }
  if (statusFilter !== 'all') params.status = statusFilter
  if (search.trim()) params.search = search.trim()

  const registrationsQuery = useDeveloperRegistrations(params)
  const updateRegistration = useUpdateDeveloperRegistration()
  const markRead = useMarkDeveloperRegistrationRead()
  const markReviewed = useMarkDeveloperRegistrationReviewed()
  const sendCredentials = useSendDeveloperCredentials()
  const deleteRegistration = useDeleteDeveloperRegistration()

  const registrations = registrationsQuery.data?.data ?? []
  const currentPage = registrationsQuery.data?.current_page ?? 1
  const lastPage = registrationsQuery.data?.last_page ?? 1
  const total = registrationsQuery.data?.total ?? 0

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    setAdminNotes(selected?.admin_notes ?? '')
    setSandboxCredentials(selected?.sandbox_credentials ?? '')
  }, [selected])

  const openRegistration = (registration: DeveloperRegistration) => {
    setSelected(registration)
    setAdminNotes(registration.admin_notes ?? '')
    setSandboxCredentials(registration.sandbox_credentials ?? '')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return
    await deleteRegistration.mutateAsync(id)
  }

  const saveRegistration = () => {
    if (!selected) return
    updateRegistration.mutate({
      id: selected.id,
      status: selected.status,
      admin_notes: adminNotes,
      sandbox_credentials: sandboxCredentials,
    })
    setSelected(null)
  }

  const sendSandboxCredentials = () => {
    if (!selected) return
    sendCredentials.mutate({
      id: selected.id,
      sandbox_credentials: sandboxCredentials,
    })
    setSelected(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Developer Registrations</h1>
          <p className="text-sm text-gray-500 mt-1">Review sandbox access requests and manage credentials</p>
        </div>
        <button
          onClick={() => { window.location.href = 'mailto:admin@nifn.org.np?subject=Developer Registration' }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
        >
          <Mail className="w-4 h-4" />
          Reply via Email
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 pt-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'reviewing', 'approved', 'rejected', 'contacted'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => { setStatusFilter(status); setPage(1) }}
                  className={clsx(
                    'pb-3 text-sm font-medium border-b-2 transition-colors capitalize',
                    statusFilter === status
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, organization"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrationsQuery.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No developer registrations found</td>
                </tr>
              ) : (
                registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    onClick={() => openRegistration(registration)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        <span className={clsx('w-2 h-2 rounded-full', statusDot[registration.status])} />
                        <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusOptions[registration.status])}>
                          {registration.status}
                        </span>
                      </span>
                    </td>
                    <td className={clsx('px-6 py-4 text-sm font-medium', !registration.is_read && 'text-gray-900')}>
                      {registration.contact_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{registration.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{registration.organization_name || '--'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{registration.organization_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openRegistration(registration) }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!registration.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markRead.mutate(registration.id)
                            }}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(registration.id)
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
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

        {registrationsQuery.data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              total={total}
              from={(currentPage - 1) * 15 + 1}
              to={Math.min(currentPage * 15, total)}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Developer Registration" maxWidth="max-w-3xl">
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusOptions[selected.status])}>
                {selected.status}
              </span>
              {!selected.is_read && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white">Unread</span>}
              {selected.credentials_sent_at && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Credentials sent</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="mt-1 text-sm text-gray-900">{selected.contact_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="mt-1 text-sm text-gray-900">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Organization</p>
                <p className="mt-1 text-sm text-gray-900">{selected.organization_name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Organization Type</p>
                <p className="mt-1 text-sm text-gray-900">{selected.organization_type}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Submitted</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Last Read</p>
                <p className="mt-1 text-sm text-gray-900">{selected.read_at ? new Date(selected.read_at).toLocaleString() : '--'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Use Case</p>
              <div className="mt-1 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {selected.use_case || 'Not provided'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selected.status}
                onChange={(e) => setSelected({ ...selected, status: e.target.value as DeveloperRegistration['status'] })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="contacted">Contacted</option>
              </select>
              <button
                onClick={() => { window.location.href = `mailto:${selected.email}?subject=Developer sandbox access request` }}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Internal notes"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sandbox Credentials</label>
              <textarea
                value={sandboxCredentials}
                onChange={(e) => setSandboxCredentials(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Paste sandbox API credentials here"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4">
              {!selected.is_read && (
                <button
                  onClick={() => {
                    markRead.mutate(selected.id)
                    setSelected({ ...selected, is_read: true, read_at: new Date().toISOString() })
                  }}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <Check className="w-4 h-4" />
                  Mark as Read
                </button>
              )}
              {selected.status !== 'reviewing' && (
                <button
                  onClick={() => {
                    markReviewed.mutate(selected.id)
                    setSelected({ ...selected, status: 'reviewing', is_read: true, read_at: new Date().toISOString() })
                  }}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Mark as Reviewed
                </button>
              )}
              {sandboxCredentials.trim() && (
                <button
                  onClick={sendSandboxCredentials}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  Send Sandbox Credentials
                </button>
              )}
              <button
                onClick={saveRegistration}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Pencil className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
