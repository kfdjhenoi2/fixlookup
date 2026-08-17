import type { NextConfig } from "next";
import { shouldBlockIndexing } from "./lib/deployment.mjs";
import { createSecurityHeaders } from "./lib/security.mjs";

const securityHeaders = createSecurityHeaders({
  development: process.env.NODE_ENV === "development",
  blockIndexing: shouldBlockIndexing(),
});

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
