// Rewrites storage URLs for the Next.js image optimizer, which runs server-side
// inside Docker. localhost:8000 is unreachable from inside the container, but
// STORAGE_BASE_URL (e.g. http://host.docker.internal:8000) is reachable.
// Client-side browser fetches are unaffected — they continue to use localhost:8000.
export function fixImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const base = process.env.STORAGE_BASE_URL || 'http://localhost:8000'
  return url.replace(/^http:\/\/localhost:8000/, base)
}
