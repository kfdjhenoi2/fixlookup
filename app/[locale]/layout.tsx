import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnalyticsConsentProvider } from "@/components/analytics-consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAnalyticsMeasurementId } from "@/lib/analytics/config";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale, openGraphLocales, supportedLocales } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { shouldBlockIndexing } from "@/lib/deployment.mjs";
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
    title: { default: messages.ui.defaultTitle, template: `%s | ${siteConfig.name}` },
    description: messages.ui.siteDescription,
    applicationName: siteConfig.name,
    category: "technology",
    robots: shouldBlockIndexing() ? { index: false, follow: false, nocache: true } : undefined,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
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
  const category = content.getCategoryById(siteConfig.primaryCategoryId);
  if (!category || !content.categoryHasIndexableContent(category.id)) notFound();
  const measurementId = getAnalyticsMeasurementId();
  return (
    <html lang={locale}>
      <body>
        <AnalyticsConsentProvider
          measurementId={measurementId}
          messages={content.messages.ui}
          privacyPath={paths.privacy(locale)}
        >
          <a className="skip-link" href="#main-content">{content.messages.ui.skipToContent}</a>
          <SiteHeader locale={locale} category={category} messages={content.messages.ui} />
          {children}
          <SiteFooter locale={locale} category={category} messages={content.messages.ui} />
        </AnalyticsConsentProvider>
      </body>
    </html>
  );
}
