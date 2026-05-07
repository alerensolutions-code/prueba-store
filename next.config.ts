import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.aleren.com.ar',
      },
      {
        protocol: 'https',
        hostname: 'lnrgqxxdlfgrsmtojurd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
