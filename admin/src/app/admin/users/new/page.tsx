"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateUser } from "@/hooks/use-users"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

export default function UserNewPage() {
  const router = useRouter()
  const createUser = useCreateUser()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "editor",
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match")
      return
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    await createUser.mutateAsync({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: form.role,
      is_active: form.is_active,
    })
    router.push("/admin/users")
  }

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Create User" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create User</h1>
        <p className="mt-1 text-sm text-zinc-500">Add a new admin user</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min 8 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={form.password_confirmation}
                onChange={(e) => set("password_confirmation", e.target.value)}
                placeholder="Repeat password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                options={roleOptions}
              />
            </div>

            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => set("is_active", v)}
              label="Active"
              id="user_is_active"
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? "Creating..." : "Create User"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
