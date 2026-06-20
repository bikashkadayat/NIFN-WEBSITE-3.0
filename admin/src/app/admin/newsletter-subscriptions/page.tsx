"use client"

import { useState } from "react"
import { Download, UserMinus, Trash2 } from "lucide-react"
import {
  useNewsletterSubscribers,
  useUnsubscribeNewsletter,
  useDeleteNewsletterSubscriber,
} from "@/hooks/use-newsletter-subscriptions"
import { newsletterApi } from "@/lib/api"
import type { NewsletterSubscriber } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

type AnyRecord = Record<string, unknown>

export default function NewsletterSubscriptionsPage() {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [unsubscribeId, setUnsubscribeId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const subscribersQuery = useNewsletterSubscribers({ page })
  const unsubscribe = useUnsubscribeNewsletter()
  const deleteSubscriber = useDeleteNewsletterSubscriber()

  const rawData = (subscribersQuery?.data as unknown as AnyRecord)?.data ?? subscribersQuery?.data
  const subscribers = Array.isArray(rawData) ? (rawData as NewsletterSubscriber[]) : []
  const meta = (subscribersQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await newsletterApi.export() as Blob
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error("Failed to export subscribers")
    } finally {
      setExporting(false)
    }
  }

  const columns: Column<NewsletterSubscriber>[] = [
    {
      key: "email",
      label: "Email",
      render: (item) => (
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.email}</span>
      ),
    },
    {
      key: "created_at",
      label: "Subscribed Date",
      render: (item) => (
        <span className="text-sm text-zinc-500">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (item) =>
        item.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Unsubscribed</Badge>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Newsletter Subscriptions" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total > 0 ? `${total} total subscriber${total !== 1 ? "s" : ""}` : "Manage newsletter subscriptions"}
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={exporting}>
          <Download size={16} />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      <Card>
        <div className="p-4">
          {subscribersQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : subscribers.length === 0 ? (
            <EmptyState title="No subscribers found" description="No newsletter subscribers yet." />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={subscribers}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    {item.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUnsubscribeId(item.id)}
                        title="Unsubscribe"
                      >
                        <UserMinus size={14} className="text-amber-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
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

      <ConfirmDialog
        open={!!unsubscribeId}
        onClose={() => setUnsubscribeId(null)}
        onConfirm={async () => {
          if (!unsubscribeId) return
          await unsubscribe.mutateAsync(unsubscribeId)
          setUnsubscribeId(null)
        }}
        title="Unsubscribe"
        message="Are you sure you want to unsubscribe this email address?"
        variant="warning"
        confirmLabel="Unsubscribe"
        loading={unsubscribe.isPending}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await deleteSubscriber.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete Subscriber"
        message="Are you sure you want to permanently delete this subscriber?"
        variant="danger"
        confirmLabel="Delete"
        loading={deleteSubscriber.isPending}
      />
    </div>
  )
}
