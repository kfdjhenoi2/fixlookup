import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "FixOrReplace — Appliance troubleshooting, with evidence",
    template: "%s | FixOrReplace",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "FixOrReplace — Appliance troubleshooting, with evidence",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: absoluteUrl("/og.png"),
        width: 1731,
        height: 909,
        alt: "FixOrReplace — Evidence before answers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FixOrReplace — Appliance troubleshooting, with evidence",
    description: siteConfig.description,
    images: [absoluteUrl("/og.png")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
