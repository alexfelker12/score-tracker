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
  images: {
    // remotePatterns: ["https://lh3.googleusercontent.com"]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cryb20dtvxvf2ikd.public.blob.vercel-storage.com",
        pathname: "/profile-images/**"
      },
    ]
  }
};

export default nextConfig;
