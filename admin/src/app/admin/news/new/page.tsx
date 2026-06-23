"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { useCreateNews, useNewsCategories } from "@/hooks"
import { slugify, formatDate } from "@/lib/utils"
import { getTitle, type Locale } from "@/lib/types"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LocaleTabs } from "@/components/ui/locale-tabs"
import { SlugInput } from "@/components/ui/slug-input"
import { MediaPicker } from "@/components/ui/media-picker"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface TranslationState {
  title: string
  body: string
  excerpt: string
  seo_title: string
  seo_description: string
  seo_keywords: string
}

const emptyTranslation = (): TranslationState => ({
  title: "",
  body: "",
  excerpt: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
})

export default function NewNewsPage() {
  const router = useRouter()
  const createNews = useCreateNews()
  const { data: categoriesRes } = useNewsCategories({ per_page: 100 })

  type AnyRecord = Record<string, unknown>
  const rawCatData = (categoriesRes?.data as unknown as AnyRecord)?.data ?? categoriesRes?.data
  const categories = Array.isArray(rawCatData) ? rawCatData as AnyRecord[] : []

  const [translations, setTranslations] = useState<Record<Locale, TranslationState>>({
    en: emptyTranslation(),
    ne: emptyTranslation(),
  })
  const [slug, setSlug] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const updateTranslation = useCallback((locale: Locale, field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
  }, [])

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!translations.en.title) return
    setSubmitting(true)
    try {
      await createNews.mutateAsync({
        slug,
        is_published: isPublished,
        is_featured: isFeatured,
        is_breaking: isBreaking,
        category_id: categoryId ? Number(categoryId) : null,
        published_at: publishedAt || null,
        featured_image_id: featuredImageId,
        tag_names: tags,
        translations: [
          { locale: "en", slug, ...translations.en },
          { locale: "ne", slug, ...translations.ne },
        ],
      })
      router.push("/admin/news")
    } catch {
      // Error toast handled by useCreateNews.onError
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
          { label: "News", href: "/admin/news" },
          { label: "Add News" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Add News</h1>
        <p className="mt-1 text-sm text-zinc-500">Create a new news article</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Main content – 65% */}
          <div className="flex-1 space-y-6 min-w-0">
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
                        placeholder="Enter title"
                      />
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Body
                        </label>
                        <RichTextEditor
                          content={translations[locale].body}
                          onChange={(val) => updateTranslation(locale, "body", val)}
                          placeholder="Write the news content…"
                        />
                      </div>
                      <Textarea
                        label="Excerpt"
                        value={translations[locale].excerpt}
                        onChange={(e) => updateTranslation(locale, "excerpt", e.target.value)}
                        placeholder="Brief summary"
                        rows={3}
                      />
                    </div>
                  )}
                </LocaleTabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <LocaleTabs>
                  {(locale: Locale) => (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            SEO Title
                          </label>
                          <span className={`text-xs ${translations[locale].seo_title.length > 60 ? "text-red-500" : "text-zinc-400"}`}>
                            {translations[locale].seo_title.length}/60
                          </span>
                        </div>
                        <input
                          type="text"
                          value={translations[locale].seo_title}
                          onChange={(e) => updateTranslation(locale, "seo_title", e.target.value)}
                          placeholder="SEO title (max 60 chars)"
                          className="flex h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            SEO Description
                          </label>
                          <span className={`text-xs ${translations[locale].seo_description.length > 160 ? "text-red-500" : "text-zinc-400"}`}>
                            {translations[locale].seo_description.length}/160
                          </span>
                        </div>
                        <textarea
                          value={translations[locale].seo_description}
                          onChange={(e) => updateTranslation(locale, "seo_description", e.target.value)}
                          placeholder="SEO description (max 160 chars)"
                          rows={3}
                          className="flex min-h-[80px] w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600"
                        />
                      </div>
                      <Input
                        label="SEO Keywords"
                        value={translations[locale].seo_keywords}
                        onChange={(e) => updateTranslation(locale, "seo_keywords", e.target.value)}
                        placeholder="keyword1, keyword2, ..."
                      />
                    </div>
                  )}
                </LocaleTabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URL Slug</CardTitle>
              </CardHeader>
              <CardContent>
                <SlugInput
                  value={slug}
                  onChange={setSlug}
                  sourceValue={translations.en.title}
                  basePath="nifn.org.np/news"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar – 35% */}
          <div className="w-full lg:w-80 xl:w-96 space-y-6 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Published</span>
                  <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Featured</span>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Breaking News</span>
                  <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
                </div>
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Published At
                  </label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600 dark:text-zinc-100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add a tag and press Enter"
                    className="flex h-10 flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 dark:border-zinc-600"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaPicker
                  onChange={(id) => setFeaturedImageId(id)}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" loading={submitting || createNews.isPending} className="flex-1">
                Create News
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
