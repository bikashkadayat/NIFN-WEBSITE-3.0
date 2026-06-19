import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const { slug, tag, path } = await request.json()
  if (slug) {
    revalidateTag(`content-${slug}`)
    revalidatePath(`/${slug}`)
  }
  if (tag) revalidateTag(tag)
  if (path) revalidatePath(path)

  return NextResponse.json({ revalidated: true, slug, tag, path })
}
