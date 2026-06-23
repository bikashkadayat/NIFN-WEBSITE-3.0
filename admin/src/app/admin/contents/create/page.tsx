'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreateContent } from '@/hooks'
import { slugify } from '@/lib/utils'
import { getTranslation } from '@/lib/types'
import type { Locale } from '@/lib/types'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LocaleTabs } from '@/components/ui/locale-tabs'
import { SlugInput } from '@/components/ui/slug-input'
import { MediaPicker } from '@/components/ui/media-picker'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

const emptyLocale = () => ({
  title: '', body: '', excerpt: '', seo_title: '', seo_description: '', seo_keywords: '',
})

export default function ContentCreatePage() {
  const router = useRouter()
  const createContent = useCreateContent()

  const [slug, setSlug] = useState('')
  const [portalType, setPortalType] = useState<'website' | 'developer'>('website')
  const [sortOrder, setSortOrder] = useState(0)
  const [isPublished, setIsPublished] = useState(true)
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null)

  const [translations, setTranslations] = useState({
    en: emptyLocale(),
    ne: emptyLocale(),
  })

  const updateTranslation = useCallback((locale: Locale, field: string, value: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!translations.en.title) { toast.error('English title is required'); return }
    if (!slug) { toast.error('Slug is required'); return }

    const payload = {
      slug,
      portal_type: portalType,
      sort_order: sortOrder,
      is_published: isPublished,
      featured_image_id: featuredImageId,
      translations: [
        { locale: 'en', ...translations.en },
        { locale: 'ne', ...translations.ne },
      ],
    }
    await createContent.mutateAsync(payload)
    router.push('/admin/contents')
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contents', href: '/admin/contents' }, { label: 'Create' }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Create Content</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Content</CardTitle></CardHeader>
          <CardContent>
            <LocaleTabs>
              {(locale) => (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Title {locale === 'en' && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      value={translations[locale].title}
                      onChange={(e) => {
                        updateTranslation(locale, 'title', e.target.value)
                        if (locale === 'en') setSlug(slugify(e.target.value))
                      }}
                      placeholder={locale === 'en' ? 'Enter page title' : 'शीर्षक लेख्नुहोस्'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Body</label>
                    <RichTextEditor
                      content={translations[locale].body}
                      onChange={(html) => updateTranslation(locale, 'body', html)}
                      placeholder="Write content here..."
                      minHeight="400px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Excerpt</label>
                    <Textarea
                      value={translations[locale].excerpt}
                      onChange={(e) => updateTranslation(locale, 'excerpt', e.target.value)}
                      placeholder="Brief summary..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-zinc-700">SEO Title</label>
                        <span className="text-xs text-zinc-400">{translations[locale].seo_title.length}/60</span>
                      </div>
                      <Input
                        value={translations[locale].seo_title}
                        onChange={(e) => updateTranslation(locale, 'seo_title', e.target.value.slice(0, 60))}
                        placeholder="SEO title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">SEO Keywords</label>
                      <Input
                        value={translations[locale].seo_keywords}
                        onChange={(e) => updateTranslation(locale, 'seo_keywords', e.target.value)}
                        placeholder="keyword1, keyword2"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-zinc-700">SEO Description</label>
                      <span className="text-xs text-zinc-400">{translations[locale].seo_description.length}/160</span>
                    </div>
                    <Textarea
                      value={translations[locale].seo_description}
                      onChange={(e) => updateTranslation(locale, 'seo_description', e.target.value.slice(0, 160))}
                      placeholder="SEO meta description..."
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </LocaleTabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <SlugInput
              value={slug}
              onChange={setSlug}
              sourceValue={translations.en.title}
              basePath="nifn.org.np"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Portal Type</label>
                <Select
                  value={portalType}
                  onChange={(e) => setPortalType(e.target.value as 'website' | 'developer')}
                  options={[
                    { value: 'website', label: 'Website' },
                    { value: 'developer', label: 'Developer Portal' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Sort Order</label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <span className="text-sm text-zinc-700">Published</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
          <CardContent>
            <MediaPicker
              onChange={(id) => setFeaturedImageId(id)}
              hint="Recommended: 1200×630px"
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={createContent.isPending} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Create Content
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/contents')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
