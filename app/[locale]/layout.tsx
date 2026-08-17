import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const { messages } = getCachedContent(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: messages.ui.defaultTitle, template: "%s | FixOrReplace" },
    description: messages.ui.siteDescription,
    applicationName: siteConfig.name,
    category: "technology",
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale,
      title: messages.ui.defaultTitle,
      description: messages.ui.siteDescription,
      images: [{ url: absoluteUrl("/og.png"), width: 1731, height: 909, alt: messages.ui.socialImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.ui.defaultTitle,
      description: messages.ui.siteDescription,
      images: [absoluteUrl("/og.png")],
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  const category = content.deviceCategories[0];
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">{content.messages.ui.skipToContent}</a>
        <SiteHeader locale={locale} category={category} messages={content.messages.ui} />
        {children}
        <SiteFooter locale={locale} category={category} messages={content.messages.ui} />
      </body>
    </html>
  );
}
