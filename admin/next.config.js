/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'host.docker.internal' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
