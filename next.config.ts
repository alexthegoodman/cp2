import type { NextConfig } from "next";

// const { i18n } = require('./next-i18next.config.js')

import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n,
  transpilePackages: ['react-responsive-masonry'],
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
