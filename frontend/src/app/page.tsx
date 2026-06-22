import type { Metadata } from 'next'
import { HeroBanner } from '@/components/home/HeroBanner'
import { VideoSection } from '@/components/home/VideoSection'
import { LatestNews } from '@/components/home/LatestNews'
import { Partners } from '@/components/home/Partners'
import { CallToAction } from '@/components/home/CallToAction'
import { fetchContent } from '@/lib/content-fetch'
import { fixImageUrl } from '@/lib/image-url'
import type { Banner } from '@/types'

export const dynamic = 'force-dynamic'

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface SettingMap {
  [key: string]: string | number | boolean
}

async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_URL}/v1/banners`, { next: { revalidate: 60, tags: ['banners'] } })
    const json = await res.json()
    return (json?.data || []).map((b: Banner) => ({
      ...b,
      image_url: fixImageUrl(b.image_url),
    }))
  } catch {
    return []
  }
}

async function fetchLatestNews(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/v1/news?limit=3`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

async function fetchSettings(): Promise<SettingMap> {
  try {
    const res = await fetch(`${API_URL}/v1/settings/public`, { next: { revalidate: 300 } })
    return res.json()
  } catch {
    return {}
  }
}

export async function generateMetadata({ searchParams }: { searchParams: { locale?: string } }): Promise<Metadata> {
  const settings = await fetchSettings()
  return {
    title: (settings.site_name as string) || 'Nepal Interledger Financial Network',
    description: (settings.site_description as string) || 'Connecting Nepal to the global interledger network for inclusive financial services.',
  }
}

export default async function HomePage({ searchParams }: { searchParams: { locale?: string } }) {
  const locale = searchParams?.locale
  const [banners, featuredNews, heroContent, statsContent, featuresContent, ctaContent] = await Promise.all([
    fetchBanners(),
    fetchLatestNews(),
    fetchContent('home-hero', locale),
    fetchContent('home-stats', locale),
    fetchContent('home-features', locale),
    fetchContent('home-cta', locale),
  ])

  return (
    <>
      <HeroBanner banners={banners} content={heroContent} />
      <VideoSection />
      <LatestNews news={featuredNews} sectionTitle="Latest News" />
      <Partners content={featuresContent} />
      <CallToAction content={ctaContent} />
    </>
  )
}
