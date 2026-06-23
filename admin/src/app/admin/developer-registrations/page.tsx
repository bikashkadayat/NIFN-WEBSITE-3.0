"use client"

import { useEffect, useState } from "react"
import { Eye, Mail, Send, Check, RotateCcw, Trash2, Search } from "lucide-react"
import {
  useDeveloperRegistrations,
  useUpdateDeveloperRegistration,
  useMarkDeveloperRegistrationRead,
  useMarkDeveloperRegistrationReviewed,
  useSendDeveloperCredentials,
  useDeleteDeveloperRegistration,
} from "@/hooks/use-developer-registrations"
import type { DeveloperRegistration } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Select, type SelectOption } from "@/components/ui/select"

type AnyRecord = Record<string, unknown>
type StatusFilter = "all" | "pending" | "reviewing" | "approved" | "rejected" | "contacted"

const statusOptions: SelectOption[] = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "contacted", label: "Contacted" },
]

const statusBadge = (status: DeveloperRegistration["status"]) => {
  const variants: Record<DeveloperRegistration["status"], "warning" | "secondary" | "success" | "destructive" | "outline"> = {
    pending: "warning",
    reviewing: "secondary",
    approved: "success",
    rejected: "destructive",
    contacted: "outline",
  }

  return <Badge variant={variants[status]}>{status}</Badge>
}

const statusDotClass = (status: DeveloperRegistration["status"]) => {
  const classes: Record<DeveloperRegistration["status"], string> = {
    pending: "bg-amber-500",
    reviewing: "bg-cyan-500",
    approved: "bg-emerald-500",
    rejected: "bg-red-500",
    contacted: "bg-zinc-500",
  }

  return classes[status]
}

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  return new Date(value).toLocaleString()
}

export default function DeveloperRegistrationsPage() {
  const [page, setPage] = useState(1)
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all")
  const [selectedItem, setSelectedItem] = useState<DeveloperRegistration | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [sandboxCredentials, setSandboxCredentials] = useState("")

  const params: Record<string, unknown> = { page }
  if (activeStatus !== "all") params.status = activeStatus
  if (search.trim()) params.search = search.trim()

  const registrationsQuery = useDeveloperRegistrations(params)
  const updateRegistration = useUpdateDeveloperRegistration()
  const markRead = useMarkDeveloperRegistrationRead()
  const markReviewed = useMarkDeveloperRegistrationReviewed()
  const sendCredentials = useSendDeveloperCredentials()
  const deleteRegistration = useDeleteDeveloperRegistration()

  // API returns { success, data: { current_page, data: [...], last_page, total } }
  const outerData = (registrationsQuery?.data as unknown as AnyRecord)?.data ?? registrationsQuery?.data
  const paginator = outerData as AnyRecord
  const registrations = Array.isArray(paginator?.data)
    ? (paginator.data as DeveloperRegistration[])
    : Array.isArray(outerData) ? (outerData as DeveloperRegistration[]) : []
  const currentPage = (paginator?.current_page as number) ?? 1
  const lastPage = (paginator?.last_page as number) ?? 1
  const total = (paginator?.total as number) ?? 0

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    setAdminNotes(selectedItem?.admin_notes ?? "")
    setSandboxCredentials(selectedItem?.sandbox_credentials ?? "")
  }, [selectedItem])

  const columns: Column<DeveloperRegistration>[] = [
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span className="inline-flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusDotClass(item.status)}`} />
          {statusBadge(item.status)}
        </span>
      ),
    },
    {
      key: "contact_name",
      label: "Name",
      render: (item) => (
        <span className={`font-medium ${!item.is_read ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
          {item.contact_name}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.email}</span>,
    },
    {
      key: "organization_name",
      label: "Organization",
      render: (item) => (
        <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.organization_name ?? "—"}</span>
      ),
    },
    {
      key: "organization_type",
      label: "Type",
      render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.organization_type}</span>,
    },
    {
      key: "created_at",
      label: "Date",
      render: (item) => (
        <span className="text-sm text-zinc-500">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const openRegistration = (item: DeveloperRegistration) => {
    setSelectedItem(item)
    setAdminNotes(item.admin_notes ?? "")
    setSandboxCredentials(item.sandbox_credentials ?? "")
  }

  const saveRegistration = () => {
    if (!selectedItem) return
    updateRegistration.mutate({
      id: selectedItem.id,
      data: {
        status: selectedItem.status,
        admin_notes: adminNotes,
        sandbox_credentials: sandboxCredentials,
      },
    })
    setSelectedItem(null)
  }

  const sendSandboxCredentials = () => {
    if (!selectedItem) return
    sendCredentials.mutate({
      id: selectedItem.id,
      sandbox_credentials: sandboxCredentials,
    })
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Developer Registrations" }]} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Developer Registrations</h1>
          <p className="mt-1 text-sm text-zinc-500">Review sandbox access requests and manage credentials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "mailto:admin@nifn.org.np?subject=Developer Registration"}>
            <Mail size={16} />
            Reply via Email
          </Button>
        </div>
      </div>

      <Card>
        <div className="border-b border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "reviewing", "approved", "rejected", "contacted"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => { setActiveStatus(status); setPage(1) }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeStatus === status
                      ? "bg-cyan-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {status[0]?.toUpperCase()}{status.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, email, organization"
                className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-600"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {registrationsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : registrations.length === 0 ? (
            <EmptyState title="No registrations found" description="No developer registrations match the current filters." />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={registrations}
                onRowClick={openRegistration}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); openRegistration(item) }}
                      title="View"
                    >
                      <Eye size={14} />
                    </Button>
                    {!item.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          markRead.mutate(item.id)
                        }}
                        title="Mark as read"
                      >
                        <Check size={14} className="text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
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

      <Modal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Developer Registration"
        size="xl"
      >
        {selectedItem && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {statusBadge(selectedItem.status)}
              {!selectedItem.is_read && <Badge variant="default">Unread</Badge>}
              {selectedItem.credentials_sent_at && <Badge variant="success">Credentials sent</Badge>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedItem.contact_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Organization</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.organization_name ?? "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Organization Type</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.organization_type}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Submitted</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDate(selectedItem.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Last Read</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDate(selectedItem.read_at)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Use Case</p>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {selectedItem.use_case || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Status"
                value={selectedItem.status}
                onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value as DeveloperRegistration["status"] })}
                options={statusOptions}
              />
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:${selectedItem.email}?subject=Developer sandbox access request`}
              >
                <Mail size={16} />
                Reply via Email
              </Button>
            </div>

            <Input
              label="Admin Notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes"
            />

            <div>
              <label htmlFor="sandbox_credentials" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sandbox Credentials
              </label>
              <textarea
                id="sandbox_credentials"
                value={sandboxCredentials}
                onChange={(e) => setSandboxCredentials(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-600"
                placeholder="Paste sandbox API credentials here"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              {!selectedItem.is_read && (
                <Button
                  variant="outline"
                  onClick={() => {
                    markRead.mutate(selectedItem.id)
                    setSelectedItem({ ...selectedItem, is_read: true, read_at: new Date().toISOString() })
                  }}
                  disabled={markRead.isPending}
                >
                  <Check size={16} />
                  Mark as Read
                </Button>
              )}
              {selectedItem.status !== "reviewing" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    markReviewed.mutate(selectedItem.id)
                    setSelectedItem({ ...selectedItem, status: "reviewing", is_read: true, read_at: new Date().toISOString() })
                  }}
                  disabled={markReviewed.isPending}
                >
                  <RotateCcw size={16} />
                  Mark as Reviewed
                </Button>
              )}
              {sandboxCredentials.trim() && (
                <Button
                  variant="secondary"
                  onClick={sendSandboxCredentials}
                  disabled={sendCredentials.isPending}
                >
                  <Send size={16} />
                  Send Sandbox Credentials
                </Button>
              )}
              <Button onClick={saveRegistration} disabled={updateRegistration.isPending}>
                Save
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await deleteRegistration.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Registration"
        message="Are you sure you want to delete this registration?"
        variant="danger"
        confirmLabel="Delete"
        loading={deleteRegistration.isPending}
      />
    </div>
  )
}
