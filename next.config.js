/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Enable standalone output for Docker deployments (optional)
  // Uncomment if deploying with Docker
  // output: 'standalone',
}

module.exports = nextConfig
