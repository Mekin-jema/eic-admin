/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.gravatar.com",
      "investethiopia.gov.et",
      "avatars.githubusercontent.com"
    ],
  },
  // Add redirects here
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: true, // 308 permanent redirect
      },
    ]
  }
}

module.exports = nextConfig;