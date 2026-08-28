import type { NextConfig } from "next";

const pdfServerPackages = [
  "pdf-parse",
  "pdfjs-dist",
  "@napi-rs/canvas",
] as const;

const pdfTracingIncludes = [
  "./node_modules/pdf-parse/**/*",
  "./node_modules/pdfjs-dist/**/*",
  "./node_modules/@napi-rs/canvas/**/*",
  "./node_modules/@napi-rs/canvas-linux-x64-gnu/**/*",
  "./node_modules/@napi-rs/canvas-linux-x64-musl/**/*",
  "./node_modules/@napi-rs/canvas-linux-arm64-gnu/**/*",
  "./node_modules/@napi-rs/canvas-linux-arm64-musl/**/*",
] as const;

const nextConfig: NextConfig = {
  serverExternalPackages: [...pdfServerPackages],
  outputFileTracingIncludes: {
    "/knowledge": [...pdfTracingIncludes],
    "/api/dev/test-pdf-pipeline": [...pdfTracingIncludes],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
