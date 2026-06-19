import { fetchDeveloperPage, fetchNavigation } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MdxRenderer } from '@/components/MdxRenderer'
import { TableOfContents } from '@/components/TableOfContents'
import { ComingSoon } from '@/components/docs/ComingSoon'
import { LastUpdated } from '@/components/docs/LastUpdated'
import { DocNavigation } from '@/components/docs/DocNavigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await fetchDeveloperPage(params.slug)
  if (!page) return { title: '404 - Page Not Found' }

  return {
    title: page.seo_title || page.title || 'Documentation',
    description: page.seo_description || page.excerpt || undefined,
    openGraph: {
      title: page.seo_title || page.title || 'Documentation',
      description: page.seo_description || page.excerpt || undefined,
      type: 'article',
    },
  }
}

export default async function DocPage({ params }: Props) {
  const [page, navigation] = await Promise.all([
    fetchDeveloperPage(params.slug),
    fetchNavigation(),
  ])

  if (!page) notFound()

  const hasBody = page.body && page.body.trim().length > 0

  return (
    <article className="max-w-5xl mx-auto px-6 py-12 flex gap-12">
      <div className="flex-1 min-w-0">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/docs" className="hover:text-gray-600 transition-colors">Docs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 font-medium">{page.title}</span>
        </nav>

        {hasBody ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                {page.excerpt}
              </p>
            )}
            <MdxRenderer content={page.body || ''} />
            {page.updated_at && <LastUpdated date={page.updated_at} />}
            <DocNavigation navigation={navigation} currentSlug={params.slug} />
          </>
        ) : (
          <ComingSoon title={page.title} />
        )}
      </div>

      {hasBody && (
        <aside className="hidden xl:block w-60 shrink-0">
          <TableOfContents content={page.body || ''} />
        </aside>
      )}
    </article>
  )
}
