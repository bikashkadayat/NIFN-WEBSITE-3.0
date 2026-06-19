import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card } from './Card'
import { Badge } from './Badge'
import { PlaceholderImage } from './PlaceholderImage'
import type { News } from '@/types'
import { format } from 'date-fns'

interface NewsCardProps {
  news: News
}

export function NewsCard({ news }: NewsCardProps) {
  const title = news.translations?.find(t => t.locale === 'en')?.title || news.title || ''
  const excerpt = news.translations?.find(t => t.locale === 'en')?.excerpt || news.excerpt || ''
  const slug = news.translations?.find(t => t.locale === 'en')?.slug || news.slug || ''
  const categoryName = news.category?.translations?.find(t => t.locale === 'en')?.name || news.category?.name || ''

  return (
    <Link href={`/news/${slug}`} className="block group">
      <Card className="overflow-hidden h-full">
        <div className="aspect-video overflow-hidden">
          {news.featured_image?.url ? (
            <img
              src={news.featured_image.url}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
        </div>
        <div className="p-5">
          {categoryName && (
            <Badge variant="primary" className="mb-3">{categoryName}</Badge>
          )}
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-cyan-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {news.published_at ? format(new Date(news.published_at), 'MMM dd, yyyy') : ''}
            </span>
            <span className="flex items-center gap-1 text-cyan-600 font-medium group-hover:gap-2 transition-all">
              Read More <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}