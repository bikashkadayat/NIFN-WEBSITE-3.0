"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useUsers, useDeleteUser } from "@/hooks/use-users"
import type { User } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"

type AnyRecord = Record<string, unknown>

const roleVariant: Record<string, "default" | "warning" | "secondary" | "success"> = {
  super_admin: "default",
  admin: "warning",
  editor: "success",
  viewer: "secondary",
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div className="h-8 w-8 rounded-full bg-cyan-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
      {initials}
    </div>
  )
}

export default function UsersPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  const usersQuery = useUsers({ page })
  const deleteUser = useDeleteUser()

  const rawData = (usersQuery?.data as unknown as AnyRecord)?.data ?? usersQuery?.data
  const users = Array.isArray(rawData) ? (rawData as User[]) : []
  const meta = (usersQuery?.data as unknown as AnyRecord) ?? {}
  const currentPage = (meta.current_page as number) ?? 1
  const lastPage = (meta.last_page as number) ?? 1
  const total = (meta.total as number) ?? 0

  const columns: Column<User>[] = [
    {
      key: "avatar",
      label: "",
      render: (item) => <UserAvatar name={item.name} />,
    },
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item) => <span className="text-zinc-600 dark:text-zinc-400 text-sm">{item.email}</span>,
    },
    {
      key: "role",
      label: "Role",
      render: (item) => (
        <Badge variant={roleVariant[item.role] ?? "secondary"}>
          {item.role.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (item) =>
        item.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
    },
    {
      key: "last_login_at",
      label: "Last Login",
      render: (item) => (
        <span className="text-zinc-500 text-sm">
          {item.last_login_at ? new Date(item.last_login_at).toLocaleDateString() : "Never"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Users" }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Users</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage admin users</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus size={16} />
            Create User
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4">
          {usersQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size={24} />
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Create the first admin user."
              action={{ label: "Create User", onClick: () => router.push("/admin/users/new") }}
            />
          ) : (
            <>
              <DataTable
                columns={columns}
                data={users}
                actionColumn={(item) => (
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/users/${item.id}`}>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit size={14} />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(item.id)} title="Delete">
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
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          await deleteUser.mutateAsync(deleteId)
          setDeleteId(null)
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleteUser.isPending}
      />
    </div>
  )
}
