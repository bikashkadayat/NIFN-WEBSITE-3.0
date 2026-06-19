"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Bell, Check, CheckCheck } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { api } from "@/lib/api"
import type { Notification } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { toast } from "sonner"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function NotificationsPage() {
  const qc = useQueryClient()
  const notificationsQuery = useNotifications()
  const notifications: Notification[] = notificationsQuery.data ?? []

  const markRead = async (id: string) => {
    try {
      await api.post(`/admin/notifications/${id}/mark-read`, {})
      qc.invalidateQueries({ queryKey: ["notifications"] })
    } catch {
      toast.error("Failed to mark as read")
    }
  }

  const markAllRead = async () => {
    try {
      await api.post("/admin/notifications/mark-all-read", {})
      qc.invalidateQueries({ queryKey: ["notifications"] })
      toast.success("All notifications marked as read")
    } catch {
      toast.error("Failed to mark all as read")
    }
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Notifications" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck size={16} />
            Mark All as Read
          </Button>
        )}
      </div>

      {notificationsQuery.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You have no notifications at this time."
        />
      ) : (
        <Card>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {notifications.map((notification) => {
              const isUnread = !notification.read_at
              return (
                <div
                  key={notification.id}
                  onClick={() => isUnread && markRead(notification.id)}
                  className={`flex items-start gap-4 p-4 transition-colors ${
                    isUnread
                      ? "bg-cyan-50/50 dark:bg-cyan-900/10 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                      : "cursor-default"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      isUnread ? "bg-cyan-100 dark:bg-cyan-900/40" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <Bell
                      size={16}
                      className={isUnread ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-400"}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {notification.title && (
                      <p className={`text-sm font-medium truncate ${isUnread ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}>
                        {notification.title}
                      </p>
                    )}
                    {notification.message && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                      {timeAgo(notification.created_at)}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {isUnread ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-cyan-500" title="Unread" />
                    ) : (
                      <Check size={14} className="text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
