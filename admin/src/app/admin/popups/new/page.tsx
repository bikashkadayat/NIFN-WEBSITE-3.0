"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCreatePopupNotice } from "@/hooks"
import { type Locale } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { ImageUpload } from "@/components/ui/image-upload"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface PopupTranslation {
  title: string
  body: string
  button_text: string
}

const emptyTranslation = (): PopupTranslation => ({
  title: "",
  body: "",
  button_text: "",
})

const typeOptions = [
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "success", label: "Success" },
  { value: "promotional", label: "Promotional" },
]

const frequencyOptions = [
  { value: "once_session", label: "Once per session" },
  { value: "once_day", label: "Once per day" },
  { value: "always", label: "Always" },
]

export default function NewPopupPage() {
  const router = useRouter()
  const createPopup = useCreatePopupNotice()

  const [translations, setTranslations] = useState<Record<Locale, PopupTranslation>>({
    en: emptyTranslation(),
    ne: emptyTranslation(),
  })
  const [imageId, setImageId] = useState<string | null>(null)
  const [buttonLink, setButtonLink] = useState("")
  const [type, setType] = useState<"info" | "warning" | "success" | "promotional">("info")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [displayFrequency, setDisplayFrequency] = useState<"once_session" | "once_day" | "always">("once_session")
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
    setSubmitting(true)
    try {
      const translationsPayload = [
        { locale: "en", ...translations.en },
        ...(translations.ne.title.trim() ? [{ locale: "ne", ...translations.ne }] : []),
      ]
      await createPopup.mutateAsync({
        type,
        button_link: buttonLink || null,
        image_id: imageId,
        start_date: startDate || null,
        end_date: endDate || null,
        display_frequency: displayFrequency,
        is_active: isActive,
        translations: translationsPayload,
      })
      router.push("/admin/popups")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Popup Notices", href: "/admin/popups" },
          { label: "New Popup" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">New Popup Notice</h1>
        <p className="mt-1 text-sm text-zinc-500">Create a popup notification for site visitors</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <LocaleTabs>
              {(locale: Locale) => (
                <div className="space-y-4">
                  <Input
                    label="Title"
                    value={translations[locale].title}
                    onChange={(e) => updateTranslation(locale, "title", e.target.value)}
                    placeholder="Popup title"
                  />
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Body
                    </label>
                    <RichTextEditor
                      content={translations[locale].body}
                      onChange={(val) => updateTranslation(locale, "body", val)}
                      placeholder="Popup body content…"
                    />
                  </div>
                  <Input
                    label="Button Text"
                    value={translations[locale].button_text}
                    onChange={(e) => updateTranslation(locale, "button_text", e.target.value)}
                    placeholder="e.g. Learn More"
                  />
                </div>
              )}
            </LocaleTabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onChange={(id) => setImageId(id)}
              hint="Optional popup image"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Type"
                options={typeOptions}
                value={type}
                onChange={(e) => setType(e.target.value as "info" | "warning" | "success" | "promotional")}
              />
              <Select
                label="Display Frequency"
                options={frequencyOptions}
                value={displayFrequency}
                onChange={(e) => setDisplayFrequency(e.target.value as typeof displayFrequency)}
              />
            </div>
            <Input
              label="Button Link"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="https://example.com"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600 dark:text-zinc-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={submitting || createPopup.isPending}>
            Create Popup
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
