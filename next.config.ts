import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves this project from /porfolio-website/. The workflow
  // provides the value during the static export; local/Sites builds stay at /.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
