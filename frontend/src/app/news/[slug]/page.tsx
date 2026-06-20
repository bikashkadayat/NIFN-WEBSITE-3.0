import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { NewsCard } from '@/components/ui/NewsCard'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import type { News } from '@/types'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface NewsDetailPageProps {
  params: { slug: string }
}

async function fetchNewsDetail(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${API_URL}/v1/news/${slug}`, { next: { revalidate: 60, tags: ['news', `news-${slug}`] } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.data || null
  } catch {
    return null
  }
}

async function fetchRelatedNews(categorySlug: string, currentId: string): Promise<News[]> {
  try {
    const res = await fetch(
      `${API_URL}/v1/news?category=${categorySlug}&limit=3&per_page=4`,
      { next: { revalidate: 60, tags: ['news'] } }
    )
    const json = await res.json()
    const all: News[] = json?.data || []
    return all.filter((n) => n.id !== currentId).slice(0, 3)
  } catch {
    return []
  }
}

function buildArticleJsonLd(article: News) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image_url,
    datePublished: article.published_at,
    author: article.author ? { '@type': 'Person', name: article.author.name } : undefined,
  }
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const article = await fetchNewsDetail(params.slug)
  if (!article) return { title: 'Article Not Found | NIFN' }

  const title = article.seo_title || article.title || 'News Article'
  const description = article.seo_description || article.excerpt || ''

  return {
    title: `${title} | NIFN`,
    description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: article.published_at,
      images: article.featured_image_url ? [{ url: article.featured_image_url, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.featured_image_url ? [article.featured_image_url] : [],
    },
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = await fetchNewsDetail(params.slug)
  if (!article) notFound()

  const relatedNews = article.category?.slug
    ? await fetchRelatedNews(article.category.slug, article.id)
    : []

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(article)) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 pt-24 pb-32 md:pt-28 md:pb-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'News', href: '/news' },
              { label: article.title || '' },
            ]}
            className="mb-6"
          />
          {article.category && (
            <Badge variant="primary" className="mb-4">
              {article.category.name}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {format(new Date(article.published_at), 'MMMM dd, yyyy')}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured image overlapping hero */}
          {article.featured_image_url && (
            <div className="relative -mt-16 mb-10">
              <img
                src={article.featured_image_url}
                alt={article.title || ''}
                className="w-full aspect-video object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Prose body */}
          {article.body && (
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-600
                prose-img:rounded-xl prose-img:my-8 prose-img:shadow-md
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                prose-li:mb-2 prose-li:text-gray-600
                prose-blockquote:border-l-4 prose-blockquote:border-cyan-500
                prose-a:text-cyan-600 prose-a:underline
                prose-strong:font-bold prose-strong:text-gray-900
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-[#0F172A] prose-pre:rounded-xl
                prose-table:border-collapse prose-th:bg-gray-50 prose-th:border prose-th:p-3
                prose-td:border prose-td:p-3"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: any) => (
                  <Badge key={tag.id} variant="default">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedNews.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <NewsCard key={related.id} news={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
