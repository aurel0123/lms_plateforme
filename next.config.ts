import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./app/generated/prisma/**/*"],
    "/**/*": ["./app/generated/prisma/**/*"],
  },
  images : {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev`,
        port: '',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
