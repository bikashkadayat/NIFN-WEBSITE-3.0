import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, NewspaperIcon } from 'lucide-react'
import { format } from 'date-fns'
import { NewsCard } from '@/components/ui/NewsCard'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import type { News } from '@/types'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface Category {
  id: string
  name?: string
  slug?: string
  article_count?: number
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface NewsListPageProps {
  searchParams: { [key: string]: string | undefined }
}

async function fetchNews(params: URLSearchParams): Promise<{ data: News[]; meta: PaginationMeta }> {
  try {
    const res = await fetch(`${API_URL}/v1/news?${params.toString()}`, { next: { revalidate: 60 } })
    return res.json()
  } catch {
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 9, total: 0 } }
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/v1/news/categories`, { next: { revalidate: 120 } })
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'News & Updates | NIFN',
    description: 'Latest news and updates from the Nepal Interledger Financial Network.',
  }
}

export default async function NewsListPage({ searchParams }: NewsListPageProps) {
  const page = searchParams?.page || '1'
  const categorySlug = searchParams?.category || ''

  const params = new URLSearchParams()
  params.set('page', page)
  params.set('per_page', '9')
  if (categorySlug) params.set('category', categorySlug)

  const [newsData, categories] = await Promise.all([
    fetchNews(params),
    fetchCategories(),
  ])

  const { data: articles, meta } = newsData
  const isFirstPage = page === '1'
  const noCategoryFilter = !categorySlug
  const featuredArticle = isFirstPage && noCategoryFilter ? articles[0] : null
  const gridArticles = isFirstPage && noCategoryFilter ? articles.slice(1) : articles

  const from = meta.total > 0 ? (meta.current_page - 1) * meta.per_page + 1 : 0
  const to = Math.min(meta.current_page * meta.per_page, meta.total)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            News & Updates
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Stay informed with the latest news, announcements, and insights from the Nepal Interledger Financial Network.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/news"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categorySlug ? 'bg-cyan-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/news?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === cat.slug ? 'bg-cyan-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Featured article */}
          {featuredArticle && (
            <div className="mb-10">
              <Link
                href={`/news/${featuredArticle.slug || featuredArticle.id}`}
                className="block group"
              >
                <div className="bg-cyan-50/50 rounded-2xl overflow-hidden border border-cyan-100">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                      <Badge variant="primary" className="mb-4 w-fit">
                        Latest
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-500 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                      <span className="text-sm text-gray-400 mb-6">
                        {featuredArticle.published_at ? format(new Date(featuredArticle.published_at), 'MMM dd, yyyy') : ''}
                      </span>
                      <span className="inline-flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-3 transition-all w-fit">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="md:w-[45%] lg:w-[40%] aspect-video md:aspect-auto">
                      {featuredArticle.featured_image_url ? (
                        <img
                          src={featuredArticle.featured_image_url}
                          alt={featuredArticle.title || ''}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PlaceholderImage className="w-full h-full" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid */}
          {gridArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article) => (
                  <NewsCard key={article.id} news={article} />
                ))}
              </div>

              {/* Pagination + count */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Showing {from}&ndash;{to} of {meta.total} articles
                </p>
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  basePath="/news"
                  searchParams={categorySlug ? { category: categorySlug } : {}}
                />
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="text-center py-20">
              <NewspaperIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h2>
              <p className="text-gray-400 mb-6">
                {categorySlug
                  ? 'No articles in this category yet. Try a different filter.'
                  : 'Check back soon for new articles.'}
              </p>
              {categorySlug && (
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1 text-cyan-600 font-semibold hover:underline"
                >
                  View all articles <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
