/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'f4.bcbits.com',
      },
    ],
  },
}

module.exports = nextConfig
