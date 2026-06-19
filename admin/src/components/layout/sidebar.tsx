"use client"

import { useState, useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { developerRegistrationsApi } from "@/lib/api"
import { useAuth } from "@/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Menu,
  Image,
  Popcorn,
  Newspaper,
  Tags,
  Images,
  Download,
  Users,
  Settings,
  Code,
  Mail,
  MailOpen,
  Bell,
  BarChart3,
  Activity,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  permission?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Dashboard",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Contents", href: "/admin/contents", icon: FileText, permission: "content.view" },
      { label: "Content Categories", href: "/admin/content-categories", icon: FolderTree, permission: "content.view" },
      { label: "Menus", href: "/admin/menus", icon: Menu, permission: "menu.view" },
      { label: "Banners", href: "/admin/banners", icon: Image, permission: "banner.view" },
      { label: "Popups", href: "/admin/popups", icon: Popcorn, permission: "popup.view" },
    ],
  },
  {
    label: "Information",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper, permission: "news.view" },
      { label: "News Categories", href: "/admin/news-categories", icon: FolderTree, permission: "news.view" },
      { label: "Tags", href: "/admin/tags", icon: Tags, permission: "content.view" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Media", href: "/admin/media", icon: Image, permission: "media.view" },
      { label: "Galleries", href: "/admin/galleries", icon: Images, permission: "gallery.view" },
    ],
  },
  {
    label: "Downloads",
    items: [
      { label: "Downloads", href: "/admin/downloads", icon: Download, permission: "download.view" },
      { label: "Download Categories", href: "/admin/download-categories", icon: FolderTree, permission: "download.view" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users, permission: "user.view" },
      { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.view" },
      { label: "Developer Registrations", href: "/admin/developer-registrations", icon: Code, permission: "registration.view" },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Contact Submissions", href: "/admin/contact-submissions", icon: Mail, permission: "submission.view" },
      { label: "Newsletter", href: "/admin/newsletter-subscriptions", icon: MailOpen, permission: "subscriber.view" },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Reports", href: "/admin/reports", icon: BarChart3, permission: "log.view" },
      { label: "Activity Logs", href: "/admin/activity-logs", icon: Activity, permission: "log.view" },
    ],
  },
]

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { hasPermission, user } = useAuth()
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("sidebar-collapsed") === "true"
  })
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set())
  const unreadQuery = useQuery({
    queryKey: ['developer-registration-unread-count'],
    queryFn: async () => {
      const res = await developerRegistrationsApi.unreadCount() as { data: { unread_count: number } }
      return res.data.unread_count
    },
    retry: false,
  })
  const unreadCount = unreadQuery.data ?? 0

  const visibleGroups = useMemo(() => {
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!item.permission) return true
          if (!user) return false
          if (user.permissions?.includes("*")) return true
          return hasPermission(item.permission)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [user, hasPermission])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar-collapsed", String(next))
      return next
    })
  }, [])

  const toggleGroup = (label: string) => {
    setClosedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const isGroupOpen = (group: NavGroup) => {
    const hasActive = group.items.some((item) => isActive(item.href))
    if (hasActive) return true
    return !closedGroups.has(group.label)
  }

  const renderNav = (closeButton?: boolean) => (
    <div
      className={cn(
        "flex h-full flex-col bg-zinc-900 text-zinc-300 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-zinc-800",
          collapsed ? "justify-center px-0" : "justify-between px-4",
        )}
      >
        {collapsed ? (
          <img src="/logo.png" alt="NIFN" className="h-8 w-auto opacity-90" />
        ) : (
          <>
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/logo.png" alt="NIFN" className="h-7 w-auto" />
              <span className="text-sm font-bold tracking-tight text-white">Admin</span>
            </Link>
            {closeButton && (
              <button onClick={onMobileClose} className="text-zinc-400 hover:text-white lg:hidden">
                <X size={20} />
              </button>
            )}
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {visibleGroups.map((group) => {
          if (collapsed) {
            return (
              <div key={group.label} className="mb-3 space-y-1 px-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "flex items-center justify-center rounded-lg p-2 transition-colors relative",
                      isActive(item.href)
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                    )}
                  >
                    <item.icon size={20} />
                    {item.href === "/admin/developer-registrations" && unreadCount > 0 && (
                      <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px] leading-none">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            )
          }

          const groupOpen = isGroupOpen(group)

          return (
            <div key={group.label} className="mb-3">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300"
              >
                {group.label}
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", groupOpen ? "rotate-0" : "-rotate-90")}
                />
              </button>
              {groupOpen && (
                <div className="mt-0.5 space-y-0.5 px-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-zinc-800 font-medium text-white"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                      {item.href === "/admin/developer-registrations" && unreadCount > 0 && (
                        <Badge className="ml-auto h-5 min-w-5 rounded-full px-1 text-[10px] leading-5">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="hidden shrink-0 border-t border-zinc-800 p-3 lg:block">
        <button
          onClick={toggleCollapsed}
          className="flex w-full items-center justify-center rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden h-full shrink-0 lg:block">{renderNav()}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="relative h-full w-64 shadow-xl">{renderNav(true)}</div>
        </div>
      )}
    </>
  )
}
