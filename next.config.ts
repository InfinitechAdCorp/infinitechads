import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     domains: [
      "yfilhnppookwbr7m.public.blob.vercel-storage.com", // ✅ Add your blob host here
    ],
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
