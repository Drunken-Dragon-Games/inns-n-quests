/** @type {import('next').NextConfig} */

const hostname = process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] ?? "https://acceptance.ddu.gg"

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',
  compiler: {
    styledComponents: true
  },
  images : {
    domains : ['d1f9hywwzs4bxo.cloudfront.net', 'cdn.ddu.gg', 'www.drunkendragon.games']
  },
  webpack: function (config, options) {
    return {
      ...config, 
      experiments: {
        topLevelAwait: true
      }
    }
  },
  rewrites: async () =>
    [
      {
        source: "/:path*",
        destination: `/:path*`,
      },
      {
        source: "/quests",
        destination: `${hostname}/quests`,
      },
      {
        source: "/quests/:path*",
        destination: `${hostname}/quests/:path*`,
      },
      {
        source: "/explorer",
        destination: `${hostname}/explorer`,
      },
      {
        source: "/explorer/:path*",
        destination: `${hostname}/explorer/:path*`,
      },
    ]
}

module.exports = nextConfig
