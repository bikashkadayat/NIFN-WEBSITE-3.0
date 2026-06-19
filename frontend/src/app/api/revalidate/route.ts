import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  const expectedSecret = process.env.REVALIDATE_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const slug: string | undefined = body.slug

  if (slug) {
    revalidatePath(`/${slug}`)
  } else {
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({ revalidated: true, slug: slug ?? null })
}
