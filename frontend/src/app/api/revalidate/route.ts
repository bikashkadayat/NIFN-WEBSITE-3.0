import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  const expectedSecret = process.env.REVALIDATE_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const slug: string | undefined = body.slug
    const tag: string | undefined = body.tag
    const path: string | undefined = body.path
    const type: string | undefined = body.type  // 'news' | 'banner' | 'content' | 'gallery' | 'menu'

    // Targeted invalidation by type
    if (type === 'news' || tag === 'news') {
      revalidateTag('news')
      revalidatePath('/news', 'page')
      if (slug) revalidateTag(`news-${slug}`)
    } else if (type === 'banner' || tag === 'banners') {
      revalidateTag('banners')
      revalidatePath('/', 'page')
    } else if (type === 'content' || tag === 'content') {
      revalidateTag('content')
      if (slug) {
        revalidateTag(`content-${slug}`)
        revalidatePath(`/${slug}`, 'page')
      }
    } else if (type === 'gallery' || tag === 'galleries') {
      revalidateTag('galleries')
      revalidatePath('/gallery', 'page')
    } else if (type === 'menu' || tag === 'menus') {
      revalidateTag('menus')
      revalidatePath('/', 'layout')
    } else {
      // Generic fallback: honour whatever tag/path/slug was passed
      if (slug) {
        revalidateTag(`content-${slug}`)
        revalidatePath(`/${slug}`)
      }
      if (tag) revalidateTag(tag)
      if (path) revalidatePath(path)
    }

    // Always bust the layout so header/footer/settings refresh
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, type: type ?? tag ?? slug ?? 'all', timestamp: Date.now() })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
