import type { Metadata } from 'next'
import { HeroBanner } from '@/components/home/HeroBanner'
import { VideoSection } from '@/components/home/VideoSection'
import { LatestNews } from '@/components/home/LatestNews'
import { Partners } from '@/components/home/Partners'
import { CallToAction } from '@/components/home/CallToAction'
import type { Banner } from '@/types'

export const dynamic = 'force-dynamic'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface SettingMap {
  [key: string]: string | number | boolean
}

async function fetchBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_URL}/v1/banners`, { next: { revalidate: 60 } })
    const json = await res.json()
    return json?.data || []
  } catch {
    return []
  }
}

async function fetchFeaturedNews(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/v1/news?featured=1&limit=3`, { next: { revalidate: 60 } })
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings()
  return {
    title: (settings.site_name as string) || 'Nepal Interledger Financial Network',
    description: (settings.site_description as string) || 'Connecting Nepal to the global interledger network for inclusive financial services.',
  }
}

export default async function HomePage() {
  const [banners, featuredNews] = await Promise.all([
    fetchBanners(),
    fetchFeaturedNews(),
  ])

  return (
    <>
      <HeroBanner banners={banners} />
      <VideoSection />
      <LatestNews news={featuredNews} />
      <Partners />
      <CallToAction />
    </>
  )
}
