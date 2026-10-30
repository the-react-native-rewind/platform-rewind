import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // `next dev` blocks dev assets from 127.0.0.1 unless this host is listed.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
