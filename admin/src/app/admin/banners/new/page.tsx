"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCreateBanner } from "@/hooks"
import { type Locale } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ui/image-upload"

interface BannerTranslation {
  title: string
  subtitle: string
  primary_button_text: string
  secondary_button_text: string
}

const emptyTranslation = (): BannerTranslation => ({
  title: "",
  subtitle: "",
  primary_button_text: "",
  secondary_button_text: "",
})

const textAlignOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]

const overlayOptions = [
  { value: "light", label: "Light (30%)" },
  { value: "medium", label: "Medium (50%)" },
  { value: "dark", label: "Dark (70%)" },
]

export default function NewBannerPage() {
  const router = useRouter()
  const createBanner = useCreateBanner()

  const [translations, setTranslations] = useState<Record<Locale, BannerTranslation>>({
    en: emptyTranslation(),
    ne: emptyTranslation(),
  })
  const [backgroundImageId, setBackgroundImageId] = useState<string | null>(null)
  const [primaryButtonLink, setPrimaryButtonLink] = useState("")
  const [secondaryButtonLink, setSecondaryButtonLink] = useState("")
  const [textAlignment, setTextAlignment] = useState<"left" | "center" | "right">("left")
  const [overlayOpacity, setOverlayOpacity] = useState<"light" | "medium" | "dark">("medium")
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
    setSubmitting(true)
    try {
      await createBanner.mutateAsync({
        background_image_id: backgroundImageId,
        primary_button_link: primaryButtonLink || null,
        secondary_button_link: secondaryButtonLink || null,
        text_alignment: textAlignment,
        overlay_opacity: overlayOpacity,
        sort_order: sortOrder,
        is_active: isActive,
        translations: [
          { locale: "en", ...translations.en },
          { locale: "ne", ...translations.ne },
        ],
      })
      router.push("/admin/banners")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Banners", href: "/admin/banners" },
          { label: "New Banner" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">New Banner</h1>
        <p className="mt-1 text-sm text-zinc-500">Create a new homepage banner</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Background Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onChange={(id) => setBackgroundImageId(id)}
              hint="Recommended: 1920×800px"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Titles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Title (English)"
                value={translations.en.title}
                onChange={(e) => updateTranslation("en", "title", e.target.value)}
                placeholder="Banner title in English"
              />
              <Input
                label="Title (Nepali)"
                value={translations.ne.title}
                onChange={(e) => updateTranslation("ne", "title", e.target.value)}
                placeholder="Banner title in Nepali"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Subtitle (English)"
                value={translations.en.subtitle}
                onChange={(e) => updateTranslation("en", "subtitle", e.target.value)}
                placeholder="Subtitle in English"
              />
              <Input
                label="Subtitle (Nepali)"
                value={translations.ne.subtitle}
                onChange={(e) => updateTranslation("ne", "subtitle", e.target.value)}
                placeholder="Subtitle in Nepali"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Primary Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Button Text (English)"
                value={translations.en.primary_button_text}
                onChange={(e) => updateTranslation("en", "primary_button_text", e.target.value)}
                placeholder="e.g. Learn More"
              />
              <Input
                label="Button Text (Nepali)"
                value={translations.ne.primary_button_text}
                onChange={(e) => updateTranslation("ne", "primary_button_text", e.target.value)}
                placeholder="Nepali button text"
              />
            </div>
            <Input
              label="Primary Button Link"
              value={primaryButtonLink}
              onChange={(e) => setPrimaryButtonLink(e.target.value)}
              placeholder="https://example.com"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Secondary Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Button Text (English)"
                value={translations.en.secondary_button_text}
                onChange={(e) => updateTranslation("en", "secondary_button_text", e.target.value)}
                placeholder="e.g. Contact Us"
              />
              <Input
                label="Button Text (Nepali)"
                value={translations.ne.secondary_button_text}
                onChange={(e) => updateTranslation("ne", "secondary_button_text", e.target.value)}
                placeholder="Nepali button text"
              />
            </div>
            <Input
              label="Secondary Button Link"
              value={secondaryButtonLink}
              onChange={(e) => setSecondaryButtonLink(e.target.value)}
              placeholder="https://example.com"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Text Alignment"
                options={textAlignOptions}
                value={textAlignment}
                onChange={(e) => setTextAlignment(e.target.value as "left" | "center" | "right")}
              />
              <Select
                label="Overlay Opacity"
                options={overlayOptions}
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(e.target.value as "light" | "medium" | "dark")}
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
          <Button type="submit" loading={submitting || createBanner.isPending}>
            Create Banner
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
