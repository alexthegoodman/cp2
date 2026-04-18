import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

// const { i18n } = require('./next-i18next.config.js')

import { i18n } from "./next-i18next.config";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n,
  transpilePackages: ['react-responsive-masonry'],
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true
  },
  turbopack: {}
};

export default withPWA(nextConfig);
