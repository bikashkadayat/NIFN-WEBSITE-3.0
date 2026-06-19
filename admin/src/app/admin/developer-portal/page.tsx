"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Trash2, Eye } from "lucide-react"
import {
  useDeveloperRegistrations,
  useUpdateDeveloperRegistration,
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

type AnyRecord = Record<string, unknown>
type StatusFilter = "all" | "pending" | "approved" | "rejected"

const statusBadge = (status: string) => {
  if (status === "approved") return <Badge variant="success">Approved</Badge>
  if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>
  return <Badge variant="warning">Pending</Badge>
}

export default function DeveloperPortalPage() {
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<StatusFilter>("all")
  const [selectedItem, setSelectedItem] = useState<DeveloperRegistration | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const params: Record<string, unknown> = { page }
  if (activeTab !== "all") params.status = activeTab

  const registrationsQuery = useDeveloperRegistrations(params)
  const updateStatus = useUpdateDeveloperRegistration()
  const deleteRegistration = useDeleteDeveloperRegistration()

  const rawData = (registrationsQuery?.data as unknown as AnyRecord)?.data ?? registrationsQuery?.data
  const registrations = Array.isArray(rawData) ? (rawData as DeveloperRegistration[]) : []
  const meta = (registrationsQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const tabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ]

  const columns: Column<DeveloperRegistration>[] = [
    {
      key: "contact_name",
      label: "Name",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.contact_name}</span>
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
      render: (item) =>
        item.organization_type ? (
          <Badge variant="secondary">{item.organization_type}</Badge>
        ) : (
          <span className="text-zinc-400">—</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => statusBadge(item.status),
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

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Developer Registrations" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Developer Registrations</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage developer portal registration requests</p>
      </div>

      <Card>
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setPage(1) }}
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
        <div className="p-4">
          {registrationsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : registrations.length === 0 ? (
            <EmptyState title="No registrations found" description="No developer registrations yet." />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={registrations}
                onRowClick={(item) => setSelectedItem(item)}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item) }}
                      title="View"
                    >
                      <Eye size={14} />
                    </Button>
                    {item.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateStatus.mutate({ id: item.id, data: { status: "approved" } })
                        }}
                        title="Approve"
                      >
                        <CheckCircle size={14} className="text-green-600" />
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateStatus.mutate({ id: item.id, data: { status: "rejected" } })
                        }}
                        title="Reject"
                      >
                        <XCircle size={14} className="text-red-500" />
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
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {statusBadge(selectedItem.status)}
              {selectedItem.organization_type && <Badge variant="secondary">{selectedItem.organization_type}</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedItem.contact_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.email}</p>
              </div>
              {selectedItem.organization_name && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Organization</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.organization_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Submitted</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {selectedItem.use_case && (
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Use Case</p>
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {selectedItem.use_case}
                  </p>
                </div>
              </div>
            )}
            {selectedItem.status === "pending" && (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    updateStatus.mutate({ id: selectedItem.id, data: { status: "approved" } })
                    setSelectedItem(null)
                  }}
                  disabled={updateStatus.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={14} />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    updateStatus.mutate({ id: selectedItem.id, data: { status: "rejected" } })
                    setSelectedItem(null)
                  }}
                  disabled={updateStatus.isPending}
                >
                  <XCircle size={14} />
                  Reject
                </Button>
              </div>
            )}
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
