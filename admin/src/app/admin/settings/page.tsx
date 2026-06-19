"use client"

import { useState, useEffect } from "react"
import { useSettings, useBatchUpdateSettings } from "@/hooks/use-settings"
import type { Setting } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

type AnyRecord = Record<string, unknown>

interface FieldDef {
  key: string
  label: string
  type?: "text" | "textarea" | "url" | "email"
}

const sections: { title: string; fields: FieldDef[] }[] = [
  {
    title: "General",
    fields: [
      { key: "site_name_en", label: "Site Name (EN)" },
      { key: "site_name_ne", label: "Site Name (NE)" },
      { key: "tagline_en", label: "Tagline (EN)" },
      { key: "tagline_ne", label: "Tagline (NE)" },
      { key: "logo_light", label: "Logo (Light)", type: "url" },
      { key: "logo_dark", label: "Logo (Dark)", type: "url" },
      { key: "favicon", label: "Favicon", type: "url" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "contact_email", label: "Contact Email", type: "email" },
      { key: "contact_phone", label: "Contact Phone" },
      { key: "address_en", label: "Address (EN)", type: "textarea" },
      { key: "address_ne", label: "Address (NE)", type: "textarea" },
      { key: "google_maps_url", label: "Google Maps URL", type: "url" },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "social_facebook", label: "Facebook", type: "url" },
      { key: "social_twitter", label: "Twitter / X", type: "url" },
      { key: "social_linkedin", label: "LinkedIn", type: "url" },
      { key: "social_youtube", label: "YouTube", type: "url" },
      { key: "social_github", label: "GitHub", type: "url" },
    ],
  },
  {
    title: "SEO Defaults",
    fields: [
      { key: "seo_title", label: "Default SEO Title" },
      { key: "seo_description", label: "Default SEO Description", type: "textarea" },
      { key: "seo_keywords", label: "Default SEO Keywords" },
      { key: "google_analytics_id", label: "Google Analytics ID" },
      { key: "google_tag_manager_id", label: "Google Tag Manager ID" },
    ],
  },
  {
    title: "Developer Portal",
    fields: [
      { key: "dev_portal_name", label: "Dev Portal Name" },
      { key: "dev_portal_description", label: "Dev Portal Description", type: "textarea" },
      { key: "dev_sandbox_url", label: "Sandbox URL", type: "url" },
      { key: "dev_auth_server_url", label: "Auth Server URL", type: "url" },
      { key: "dev_api_base_url", label: "API Base URL", type: "url" },
      { key: "dev_support_email", label: "Support Email", type: "email" },
      { key: "dev_github_org_url", label: "GitHub Org URL", type: "url" },
    ],
  },
]

export default function SettingsPage() {
  const settingsQuery = useSettings()
  const batchUpdate = useBatchUpdateSettings()

  const rawData = (settingsQuery?.data as unknown as AnyRecord)?.data ?? settingsQuery?.data
  const settings = Array.isArray(rawData) ? (rawData as Setting[]) : []

  const [values, setValues] = useState<Record<string, string>>({})
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (settings.length > 0 && !initialized) {
      const init: Record<string, string> = {}
      settings.forEach((s) => { init[s.key] = s.value ?? "" })
      setValues(init)
      setInitialized(true)
    }
  }, [settings, initialized])

  const getValue = (key: string) => values[key] ?? ""
  const setValue = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    const allKeys = sections.flatMap((s) => s.fields.map((f) => f.key))
    const payload = allKeys.map((key) => ({ key, value: values[key] ?? "" }))
    await batchUpdate.mutateAsync(payload)
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/admin" }, { label: "Settings" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
          <p className="mt-1 text-sm text-zinc-500">Configure your website settings</p>
        </div>
        <Button onClick={handleSave} disabled={batchUpdate.isPending}>
          {batchUpdate.isPending ? "Saving..." : "Save All Settings"}
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={getValue(field.key)}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        placeholder={field.label}
                        rows={3}
                      />
                    ) : (
                      <Input
                        type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
                        value={getValue(field.key)}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        placeholder={field.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={batchUpdate.isPending} size="lg">
          {batchUpdate.isPending ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  )
}
