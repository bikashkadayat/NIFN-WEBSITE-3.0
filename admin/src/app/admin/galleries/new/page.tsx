"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateGallery } from "@/hooks/use-galleries"
import type { Locale } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { SlugInput } from "@/components/ui/slug-input"
import { MediaPicker } from "@/components/ui/media-picker"

export default function GalleryNewPage() {
  const router = useRouter()
  const createGallery = useCreateGallery()

  const [slug, setSlug] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [eventDate, setEventDate] = useState("")
  const [coverImageId, setCoverImageId] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>()
  const [translations, setTranslations] = useState<Record<Locale, { title: string; description: string }>>({
    en: { title: "", description: "" },
    ne: { title: "", description: "" },
  })

  const updateTranslation = (locale: Locale, field: "title" | "description", value: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createGallery.mutateAsync({
      slug,
      is_published: isPublished,
      event_date: eventDate || null,
      cover_image_id: coverImageId || null,
      translations: [
        { locale: "en", title: translations.en.title, description: translations.en.description },
        { locale: "ne", title: translations.ne.title, description: translations.ne.description },
      ],
    })
    router.push("/admin/galleries")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Galleries", href: "/admin/galleries" },
          { label: "Create New" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create Gallery</h1>
        <p className="mt-1 text-sm text-zinc-500">Add a new photo gallery</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gallery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LocaleTabs>
              {(locale) => (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={translations[locale].title}
                      onChange={(e) => updateTranslation(locale, "title", e.target.value)}
                      placeholder={`Gallery title in ${locale === "en" ? "English" : "Nepali"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={translations[locale].description}
                      onChange={(e) => updateTranslation(locale, "description", e.target.value)}
                      placeholder={`Gallery description in ${locale === "en" ? "English" : "Nepali"}`}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </LocaleTabs>

            <SlugInput
              value={slug}
              onChange={setSlug}
              sourceValue={translations.en.title}
              basePath="nifn.org.np/gallery"
            />

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Event Date <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
                label="Published"
                id="is_published"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Cover Image <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <MediaPicker
                value={coverImageUrl}
                onChange={(id, url) => { setCoverImageId(id); setCoverImageUrl(url) }}
                hint="Gallery cover image"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={createGallery.isPending || !translations.en.title || !slug}>
            {createGallery.isPending ? "Creating..." : "Create Gallery"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/galleries")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
