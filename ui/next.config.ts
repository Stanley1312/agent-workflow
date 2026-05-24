import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['0.0.0.0', '192.168.50.54'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;