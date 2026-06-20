"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useDownload, useUpdateDownload, useDownloadCategories } from "@/hooks"
import { getTitle, getTranslation, type Locale } from "@/lib/types"
import { formatFileSize } from "@/lib/utils"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { ImageUpload } from "@/components/ui/image-upload"
import { FileUpload } from "@/components/ui/file-upload"
import { Spinner } from "@/components/ui/spinner"

interface DownloadTranslation {
  title: string
  description: string
}

const emptyTranslation = (): DownloadTranslation => ({
  title: "",
  description: "",
})

export default function EditDownloadPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: download, isLoading } = useDownload(id)
  const updateDownload = useUpdateDownload()
  const { data: categoriesRes } = useDownloadCategories({ per_page: 100 })

  type AnyRecord = Record<string, unknown>
  const rawCatData = (categoriesRes?.data as unknown as AnyRecord)?.data ?? categoriesRes?.data
  const categories = Array.isArray(rawCatData) ? rawCatData as AnyRecord[] : []

  const [translations, setTranslations] = useState<Record<Locale, DownloadTranslation>>({
    en: emptyTranslation(),
    ne: emptyTranslation(),
  })
  const [newFile, setNewFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [thumbnailId, setThumbnailId] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>()
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (download && !initialized) {
      const enT = getTranslation(download.translations, "en")
      const neT = getTranslation(download.translations, "ne")
      setTranslations({
        en: {
          title: enT.title ?? "",
          description: enT.description ?? "",
        },
        ne: {
          title: neT.title ?? "",
          description: neT.description ?? "",
        },
      })
      setCategoryId(download.category_id ? String(download.category_id) : "")
      setThumbnailId(download.thumbnail_id ?? null)
      setThumbnailUrl(download.thumbnail?.url)
      setSortOrder(download.sort_order)
      setIsActive(download.is_active)
      setInitialized(true)
    }
  }, [download, initialized])

  const updateTranslation = useCallback((locale: Locale, field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      if (newFile) formData.append("file", newFile)
      formData.append("category_id", categoryId)
      formData.append("thumbnail_id", thumbnailId ?? "")
      formData.append("sort_order", String(sortOrder))
      formData.append("is_active", isActive ? "1" : "0")
      formData.append("translations", JSON.stringify([
        { locale: "en", ...translations.en },
        { locale: "ne", ...translations.ne },
      ]))

      await updateDownload.mutateAsync({ id: id, data: formData })
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Downloads", href: "/admin/downloads" },
          { label: "Edit Download" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Download</h1>
        <p className="mt-1 text-sm text-zinc-500">Update download details</p>
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
          <CardContent className="space-y-4">
            {download?.file_name && !newFile && (
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Current file: <span className="text-zinc-600 dark:text-zinc-400">{download.file_name}</span>
                </p>
                {download.file_size != null && (
                  <p className="text-xs text-zinc-500 mt-0.5">{formatFileSize(download.file_size)}</p>
                )}
              </div>
            )}
            <FileUpload
              value={newFile ? { name: newFile.name, size: newFile.size } : null}
              onFileSelect={(f) => setNewFile(f)}
              label={download?.file_name ? "Replace File (optional)" : "Upload File"}
            />
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
                Thumbnail
              </label>
              <ImageUpload
                value={thumbnailUrl}
                onChange={(id, url) => {
                  setThumbnailId(id)
                  setThumbnailUrl(url)
                }}
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
          <Button type="submit" loading={submitting || updateDownload.isPending}>
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
