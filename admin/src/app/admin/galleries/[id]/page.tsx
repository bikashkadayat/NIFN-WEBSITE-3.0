"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Images } from "lucide-react"
import { useGallery, useUpdateGallery } from "@/hooks/use-galleries"
import type { Locale } from "@/lib/types"
import { getTranslation } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { SlugInput } from "@/components/ui/slug-input"
import { ImageUpload } from "@/components/ui/image-upload"
import { Spinner } from "@/components/ui/spinner"

export default function GalleryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const galleryQuery = useGallery(id)
  const updateGallery = useUpdateGallery()

  const [slug, setSlug] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [eventDate, setEventDate] = useState("")
  const [coverImageId, setCoverImageId] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [translations, setTranslations] = useState<Record<Locale, { title: string; description: string }>>({
    en: { title: "", description: "" },
    ne: { title: "", description: "" },
  })
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (galleryQuery.data && !initialized) {
      const g = galleryQuery.data
      setSlug(g.slug)
      setIsPublished(g.is_published)
      setEventDate(g.event_date ?? "")
      setCoverImageId(g.cover_image_id ?? null)
      setCoverImageUrl(g.cover_image?.url ?? null)
      const en = getTranslation(g.translations, "en")
      const ne = getTranslation(g.translations, "ne")
      setTranslations({
        en: { title: en.title ?? "", description: en.description ?? "" },
        ne: { title: ne.title ?? "", description: ne.description ?? "" },
      })
      setInitialized(true)
    }
  }, [galleryQuery.data, initialized])

  const updateTranslation = (locale: Locale, field: "title" | "description", value: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateGallery.mutateAsync({
      id: id,
      data: {
        slug,
        is_published: isPublished,
        event_date: eventDate || null,
        cover_image_id: coverImageId || null,
        translations: [
          { locale: "en", title: translations.en.title, description: translations.en.description },
          { locale: "ne", title: translations.ne.title, description: translations.ne.description },
        ],
      },
    })
    router.push("/admin/galleries")
  }

  if (galleryQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Galleries", href: "/admin/galleries" },
          { label: "Edit Gallery" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Gallery</h1>
          <p className="mt-1 text-sm text-zinc-500">Update gallery details</p>
        </div>
        <Link href={`/admin/galleries/${id}/images`}>
          <Button variant="outline">
            <Images size={16} />
            Manage Images
          </Button>
        </Link>
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
              <ImageUpload
                value={coverImageUrl ?? coverImageId}
                onChange={(mediaId, url) => {
                  setCoverImageId(mediaId)
                  setCoverImageUrl(url ?? null)
                }}
                hint="Gallery cover image"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={updateGallery.isPending || !translations.en.title || !slug}>
            {updateGallery.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/galleries")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
