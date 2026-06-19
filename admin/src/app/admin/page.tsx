"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import {
  FileText,
  Newspaper,
  Users,
  Image,
  Download,
  Mail,
  Plus,
  Upload,
  Eye,
  BarChart4,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useAuth } from "@/providers/auth-provider"
import { api } from "@/lib/api"
import type { DashboardStats, ActivityLog } from "@/lib/types"
import { cn, formatDate } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface StatCard {
  label: string
  key: keyof DashboardStats
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  bg: string
}

const statCards: StatCard[] = [
  { label: "Total Contents", key: "total_contents", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total News", key: "total_news", icon: Newspaper, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Total Users", key: "total_users", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Total Media", key: "total_media", icon: Image, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Total Downloads", key: "total_downloads", icon: Download, color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Total Contacts", key: "total_contacts", icon: Mail, color: "text-cyan-600", bg: "bg-cyan-50" },
]

const quickActions = [
  { label: "Create Content", href: "/admin/contents/create", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Upload Media", href: "/admin/media", icon: Upload, color: "bg-emerald-600 hover:bg-emerald-700" },
  { label: "View Users", href: "/admin/users", icon: Eye, color: "bg-violet-600 hover:bg-violet-700" },
]

function ActivityBadge({ action }: { action: string }) {
  const variant =
    action === "created"
      ? "success"
      : action === "updated"
        ? "warning"
        : action === "deleted"
          ? "destructive"
          : "default"
  return <Badge variant={variant}>{action}</Badge>
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<DashboardStats>("/admin/dashboard/stats"),
  })

  const stats = statsResponse?.data

  const [monthlyData] = useState(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        contents: Math.floor(Math.random() * 80) + 20,
        news: Math.floor(Math.random() * 40) + 5,
      })
    }
    return months
  })

  const activities: ActivityLog[] = useMemo(() => {
    if (!stats?.recent_activities) return []
    return stats.recent_activities.slice(0, 10)
  }, [stats])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Here&apos;s what&apos;s happening with your site today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          const value = stats ? (stats[card.key] as number) : null
          return (
            <Card key={card.key}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", card.bg)}>
                  <Icon size={24} className={card.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
                  {isLoading ? (
                    <Spinner size={20} className="mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value ?? 0}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 size={18} className="text-zinc-500" />
              Content &amp; News Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      background: "#fff",
                      fontSize: "13px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="contents" name="Contents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="news" name="News" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Button className={cn("w-full justify-start gap-2 text-white", action.color)}>
                    <Icon size={16} />
                    {action.label}
                  </Button>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size={24} />
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">No recent activities found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    {["User", "Action", "Entity", "Description", "Date"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {activity.user_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <ActivityBadge action={activity.action} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-zinc-600 dark:text-zinc-400">
                        {(activity.subject_type ?? '').replace(/_/g, " ")}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {activity.description}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-500">
                        {formatDate(activity.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
