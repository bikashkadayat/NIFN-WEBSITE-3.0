import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret')
  const expectedSecret = process.env.REVALIDATION_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const paths: string[] = body.paths || ['/']

  try {
    for (const path of paths) {
      revalidatePath(path)
    }
    return NextResponse.json({ revalidated: true, paths })
  } catch (error) {
    return NextResponse.json({ message: 'Revalidation failed', error }, { status: 500 })
  }
}
