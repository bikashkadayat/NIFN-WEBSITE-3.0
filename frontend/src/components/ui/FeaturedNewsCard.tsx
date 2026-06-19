import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from './Badge'
import { PlaceholderImage } from './PlaceholderImage'
import type { News } from '@/types'
import { format } from 'date-fns'

interface FeaturedNewsCardProps {
  news: News
}

export function FeaturedNewsCard({ news }: FeaturedNewsCardProps) {
  const title = news.translations?.find(t => t.locale === 'en')?.title || news.title || ''
  const excerpt = news.translations?.find(t => t.locale === 'en')?.excerpt || news.excerpt || ''
  const slug = news.translations?.find(t => t.locale === 'en')?.slug || news.slug || ''

  return (
    <div className="bg-cyan-50/50 rounded-2xl overflow-hidden border border-cyan-100">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
          <Badge variant="primary" className="mb-4 w-fit">
            <Sparkles className="w-3 h-3 mr-1" />
            Latest
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 mb-6 line-clamp-3">{excerpt}</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {news.published_at ? format(new Date(news.published_at), 'MMM dd, yyyy') : ''}
            </span>
          </div>
          <Link
            href={`/news/${slug}`}
            className="mt-6 inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all w-fit"
          >
            Read Article <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="md:w-[45%] lg:w-[40%] aspect-video md:aspect-auto">
          {news.featured_image?.url ? (
            <img
              src={news.featured_image.url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
        </div>
      </div>
    </div>
  )
}