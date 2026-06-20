"use client"

import { useState } from "react"
import { Eye, Check, Trash2, X } from "lucide-react"
import {
  useContactSubmissions,
  useMarkContactRead,
  useDeleteContactSubmission,
} from "@/hooks/use-contact-submissions"
import type { ContactSubmission } from "@/lib/types"
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

type FilterTab = "all" | "unread" | "read"

export default function ContactSubmissionsPage() {
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const params: Record<string, unknown> = { page }
  if (activeTab === "unread") params.is_read = 0
  if (activeTab === "read") params.is_read = 1

  const submissionsQuery = useContactSubmissions(params)
  const markRead = useMarkContactRead()
  const deleteSubmission = useDeleteContactSubmission()

  const rawData = (submissionsQuery?.data as unknown as AnyRecord)?.data ?? submissionsQuery?.data
  const submissions = Array.isArray(rawData) ? (rawData as ContactSubmission[]) : []
  const meta = (submissionsQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "read", label: "Read" },
  ]

  const columns: Column<ContactSubmission>[] = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <span className={`font-medium ${!item.is_read ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
          {item.name}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.email}</span>,
    },
    {
      key: "subject",
      label: "Subject",
      render: (item) => (
        <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate max-w-xs block">
          {item.subject}
        </span>
      ),
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
    {
      key: "is_read",
      label: "Status",
      render: (item) =>
        item.is_read ? (
          <Badge variant="secondary">Read</Badge>
        ) : (
          <Badge variant="default">Unread</Badge>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Contact Submissions" }]} />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Contact Submissions</h1>
        <p className="mt-1 text-sm text-zinc-500">View and manage contact form submissions</p>
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
          {submissionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState title="No submissions found" description="No contact submissions yet." />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={submissions}
                onRowClick={(item) => setSelectedItem(item)}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedItem(item) }} title="View">
                      <Eye size={14} />
                    </Button>
                    {!item.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); markRead.mutate(item.id) }}
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
        title="Contact Submission"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Name</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.email}</p>
              </div>
              {selectedItem.phone && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{selectedItem.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Date</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {new Date(selectedItem.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Subject</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedItem.subject}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Message</p>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{selectedItem.message}</p>
              </div>
            </div>
            {!selectedItem.is_read && (
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    markRead.mutate(selectedItem.id)
                    setSelectedItem((prev) => prev ? { ...prev, is_read: true } : null)
                  }}
                  disabled={markRead.isPending}
                  size="sm"
                >
                  <Check size={14} />
                  Mark as Read
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
          await deleteSubmission.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Submission"
        message="Are you sure you want to delete this contact submission?"
        variant="danger"
        confirmLabel="Delete"
        loading={deleteSubmission.isPending}
      />
    </div>
  )
}
