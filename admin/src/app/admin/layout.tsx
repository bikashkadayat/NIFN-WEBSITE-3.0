"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto bg-zinc-50 p-6 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </AuthProvider>
  )
}
