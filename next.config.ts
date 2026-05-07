import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.aleren.com.ar',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lnrgqxxdlfgrsmtojurd.supabase.co',
      },
    ],
  },
};

export default nextConfig;
