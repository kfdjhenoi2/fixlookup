import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { shouldBlockIndexing } from "@/lib/deployment.mjs";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  robots: shouldBlockIndexing() ? { index: false, follow: false, nocache: true } : undefined,
};

export default function RedirectRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
