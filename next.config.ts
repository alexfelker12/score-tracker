import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects: async () => {
    return [
      // Basic redirect
      {
        source: '/user',
        destination: '/user/profile',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
