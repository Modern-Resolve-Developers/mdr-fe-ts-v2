const nextSafe = require('next-safe')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source : '/:path*',
        headers: nextSafe({ isDev })
      }
    ]
  },
  swcMinify: false
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  basePath: '',
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',
  poweredByHeader: false,
  images: {
    domains: process.env.NEXT_PRIVATE_CMS_URL ? [process.env.NEXT_PRIVATE_CMS_URL.split('//')[1]] : undefined,
  },

  eslint: {
    // TODO: ESLint errors needs to be Fixed
    ignoreDuringBuilds: true,
  },

  publicRuntimeConfig: {
    processEnv: Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => key.includes('NEXT_PRIVATE_') || key.includes('VIDEO_RESOURCES_URL'),
      ),
    ),
  },

  webpack: config => {
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[contenthash].[ext]',
            publicPath: '_next/static/worker',
            outputPath: 'static/worker',
          },
        },
      ],
    });

    return config;
  },
};
