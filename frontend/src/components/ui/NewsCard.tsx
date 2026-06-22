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
  const title = news.title || ''
  const excerpt = news.excerpt || ''
  const slug = news.slug || news.id
  const categoryName = news.category?.name || ''
  const imageUrl = news.featured_image_url || news.featured_image?.url

  return (
    <Link href={`/news/${slug}`} className="block group">
      <Card className="overflow-hidden h-full">
        <div className="aspect-video overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage className="w-full h-full" />
          )}
          {news.is_breaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              Breaking
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.is_featured && !news.is_breaking && (
              <Badge variant="warning">Featured</Badge>
            )}
            {categoryName && (
              <Badge variant="primary">{categoryName}</Badge>
            )}
          </div>
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