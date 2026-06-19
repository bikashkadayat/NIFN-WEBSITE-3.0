import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ComingSoon } from '@/components/ui/ComingSoon'
import { fetchContent } from '@/lib/content-fetch'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: { searchParams: { locale?: string } }): Promise<Metadata> {
  const content = await fetchContent('vision', searchParams.locale)
  if (!content) return { title: 'Our Vision' }
  return {
    title: content.seo_title || `${content.title} | NIFN`,
    description: content.seo_description || content.excerpt || '',
  }
}

export default async function VisionPage({ searchParams }: { searchParams: { locale?: string } }) {
  const content = await fetchContent('vision', searchParams.locale)
  if (!content || !content.body) return <ComingSoon title="Our Vision" />

  return (
    <>
      <section className="bg-gradient-to-br from-cyan-700 via-cyan-800 to-blue-900 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: content.title || 'Our Vision' },
            ]}
            className="mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {content.title}
          </h1>
          {content.excerpt && (
            <p className="text-lg text-white/80 max-w-3xl">{content.excerpt}</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.featured_image_url && (
            <img
              src={content.featured_image_url}
              alt={content.title || ''}
              className="w-full aspect-video object-cover rounded-2xl shadow-lg mb-10"
            />
          )}

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
              prose-pre:bg-[#0F172A] prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        </div>
      </section>
    </>
  )
}
