import type { NextConfig } from "next";

const projectRoot = new URL(".", import.meta.url).pathname;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
