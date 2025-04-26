import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minutes-video-bucket.s3.amazonaws.com',
      },
    ],
  },
  
};

export default nextConfig;
