import { redirect } from 'next/navigation'

interface BlogPostRedirectProps {
  params: { slug: string }
}

export default function BlogPostRedirect({ params }: BlogPostRedirectProps) {
  redirect(`/news/${params.slug}`)
}
