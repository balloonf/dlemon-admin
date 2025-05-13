/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ['localhost', 'dlemon-admin.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/webp'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig;
