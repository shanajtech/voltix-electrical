import type { NextConfig } from "next";

const pagesExport = process.env.GITHUB_PAGES === "true";
const basePath = pagesExport ? "/voltix-electrical" : "";

const nextConfig: NextConfig = {
  output: pagesExport ? "export" : undefined,
  distDir: pagesExport ? ".next-pages" : ".next",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: pagesExport },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
