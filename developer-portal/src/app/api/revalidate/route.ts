import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const { paths } = await request.json()
  const pathList: string[] = Array.isArray(paths) ? paths : ['/']

  for (const path of pathList) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths: pathList })
}
