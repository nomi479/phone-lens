import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Turbopack configuration (your existing settings)
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Fixed: Added images.remotePatterns to allow external images
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",        // Used in the fixed dashboard
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",        // If you want to switch back to pravatar later
      },
      // Add more hostnames here in the future (e.g., your own CDN, cloudinary, etc.)
      // {
      //   protocol: "https",
      //   hostname: "your-domain.com",
      // },
    ],
  },
};

export default nextConfig;