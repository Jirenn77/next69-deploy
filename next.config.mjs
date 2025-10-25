/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // If you're doing static export
  trailingSlash: true,
  images: {
    unoptimized: true // If using Vercel outside of their image optimization
  }
}

module.exports = nextConfig