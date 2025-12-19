import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  domains: ["i.scdn.co"]
 },
 turbopack: {
  root: "."  // Sets the client folder as the root for Turbopack
 }
};

export default nextConfig;
