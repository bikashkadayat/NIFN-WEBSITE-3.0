import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'
import { ScrollAnimation } from '@/components/ui/ScrollAnimation'
import { format } from 'date-fns'

interface NewsItem {
  id: string
  title?: string
  slug?: string
  excerpt?: string
  featured_image_url?: string
  category?: { id: string; name?: string; slug?: string }
  published_at?: string
}

interface LatestNewsProps {
  news: NewsItem[]
}

export function LatestNews({ news }: LatestNewsProps) {
  return (
    <SectionWrapper bg="gray">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Latest News
        </h2>
        <Link
          href="/news"
          className="hidden sm:flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {news.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <ScrollAnimation key={item.id} delay={i * 150}>
              <Link
                href={`/news/${item.slug || item.id}`}
                className="block group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
              >
                <div className="aspect-video overflow-hidden">
                  {item.featured_image_url ? (
                    <img
                      src={item.featured_image_url}
                      alt={item.title || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderImage className="w-full h-full" />
                  )}
                </div>
                <div className="p-5">
                  {item.category?.name && (
                    <span className="inline-block text-xs font-medium text-cyan-700 bg-cyan-50 px-2 py-1 rounded-full mb-3">
                      {item.category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {item.published_at ? format(new Date(item.published_at), 'MMM dd, yyyy') : ''}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-600 font-medium group-hover:gap-2 transition-all text-sm">
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
        >
          View All News <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionWrapper>
  )
}
