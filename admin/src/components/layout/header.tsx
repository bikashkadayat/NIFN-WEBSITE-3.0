"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Bell, Menu, LogOut, User as UserIcon, Shield } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onMenuToggle?: () => void
}

function pathToLabel(path: string): string {
  const segments = path.split("/").filter(Boolean)
  if (segments.length === 1) return "Dashboard"
  const last = segments[segments.length - 1]
  return last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

const roleBadgeColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  admin: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  editor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const pathParts = pathname.split("/").filter(Boolean)
  const breadcrumbItems = pathParts.map((_, i) => {
    const href = "/" + pathParts.slice(0, i + 1).join("/")
    const label = i === 0 ? "Admin" : pathToLabel(href)
    const isLast = i === pathParts.length - 1
    return { label, href: isLast ? undefined : href }
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
          <Menu size={20} />
        </Button>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <Badge
              variant="destructive"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full p-0 text-[10px] leading-none"
            >
              0
            </Badge>
          </Button>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Avatar name={user?.name || "User"} src={user?.avatar || undefined} size="sm" />
            <div className="hidden text-left md:block">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-100">
                  {user?.name || "Admin"}
                </p>
                {user?.role && (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase leading-none",
                      roleBadgeColors[user.role] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {roleLabels[user.role] || user.role_name || user.role}
                  </span>
                )}
              </div>
              <p className="text-xs leading-tight text-zinc-500">{user?.email || ""}</p>
            </div>
          </button>

          {dropdownOpen && (
            <div
              className={cn(
                "absolute right-0 z-50 mt-1 min-w-[200px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900",
              )}
            >
              <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-700">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.name}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
                {user?.role && (
                  <span
                    className={cn(
                      "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                      roleBadgeColors[user.role] || "bg-gray-100 text-gray-700"
                    )}
                  >
                    <Shield size={10} />
                    {roleLabels[user.role] || user.role_name || user.role}
                  </span>
                )}
              </div>
              <button
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <UserIcon size={14} />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
