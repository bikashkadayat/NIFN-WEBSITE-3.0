"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCreateDownload, useDownloadCategories } from "@/hooks"
import { getTitle, type Locale } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileUpload } from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"

interface DownloadTranslation {
  title: string
  description: string
}

const emptyTranslation = (): DownloadTranslation => ({
  title: "",
  description: "",
})

export default function NewDownloadPage() {
  const router = useRouter()
  const createDownload = useCreateDownload()
  const { data: categoriesRes } = useDownloadCategories({ per_page: 100 })

  type AnyRecord = Record<string, unknown>
  const rawCatData = (categoriesRes?.data as unknown as AnyRecord)?.data ?? categoriesRes?.data
  const categories = Array.isArray(rawCatData) ? rawCatData as AnyRecord[] : []

  const [translations, setTranslations] = useState<Record<Locale, DownloadTranslation>>({
    en: emptyTranslation(),
    ne: emptyTranslation(),
  })
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [thumbnailId, setThumbnailId] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const updateTranslation = useCallback((locale: Locale, field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category_id", categoryId)
      formData.append("thumbnail_id", thumbnailId ?? "")
      formData.append("sort_order", String(sortOrder))
      formData.append("is_active", isActive ? "1" : "0")
      formData.append("translations", JSON.stringify([
        { locale: "en", ...translations.en },
        { locale: "ne", ...translations.ne },
      ]))

      await createDownload.mutateAsync(formData)
      router.push("/admin/downloads")
    } finally {
      setSubmitting(false)
    }
  }

  const categoryOptions = [
    { value: "", label: "Select category" },
    ...categories.map((c) => ({
      value: String(c.id),
      label: getTitle((c.translations as { locale: string; title?: string; name?: string }[]) ?? [], "Unnamed"),
    })),
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Downloads", href: "/admin/downloads" },
          { label: "New Download" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">New Download</h1>
        <p className="mt-1 text-sm text-zinc-500">Add a downloadable file</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <LocaleTabs>
              {(locale: Locale) => (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={translations[locale].title}
                    onChange={(e) => updateTranslation(locale, "title", e.target.value)}
                    placeholder="Enter title"
                  />
                  <Textarea
                    label="Description"
                    value={translations[locale].description}
                    onChange={(e) => updateTranslation(locale, "description", e.target.value)}
                    placeholder="Describe this download"
                    rows={4}
                  />
                </div>
              )}
            </LocaleTabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              value={file ? { name: file.name, size: file.size } : null}
              onFileSelect={(f) => setFile(f)}
              label="Upload File"
            />
            {!file && (
              <p className="mt-2 text-xs text-red-500">A file is required</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Thumbnail (Optional)
              </label>
              <ImageUpload
                onChange={(id) => setThumbnailId(id)}
                hint="Optional thumbnail image"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
              <Input
                label="Sort Order"
                type="number"
                min={0}
                value={String(sortOrder)}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
              <div className="flex items-center justify-between h-10">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={submitting || createDownload.isPending} disabled={!file}>
            Create Download
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
