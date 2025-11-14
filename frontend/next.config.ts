import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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

export default nextConfig;
