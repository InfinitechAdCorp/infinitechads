import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xhnuzvy74xn9ytm3.public.blob.vercel-storage.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },    
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
