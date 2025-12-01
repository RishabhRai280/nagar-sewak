import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Local backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      // Dribbble (old images)
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
      // Unsplash (backgrounds)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Flaticon icons
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      // Blush.design illustration assets (OpenPeeps, Humaaans)
      {
        protocol: "https",
        hostname: "blush.design",
      },
      // Blush API CDN
      {
        protocol: "https",
        hostname: "blush.design",
      },
      // Rare case: CDN used by blush for served images
      {
        protocol: "https",
        hostname: "assets.blush.design",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

