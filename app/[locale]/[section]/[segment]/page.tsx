import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { VerificationBadge } from "@/components/status-badge";
import { Troubleshooter } from "@/components/troubleshooter";
import { getCachedContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

interface PageProps { params: Promise<{ locale: string; section: string; segment: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    return content.deviceCategories.flatMap((category) => [
      { locale, section: category.slug, segment: content.messages.routes.troubleshooter },
      ...content.manufacturers.filter((record) => record.categoryIds.includes(category.id)).map((manufacturer) => ({ locale, section: category.slug, segment: manufacturer.slug })),
    ]);
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section, segment } = await params;
  if (!isSupportedLocale(locale)) return {};
  const content = getCachedContent(locale);
  const category = content.getCategoryBySlug(section);
  if (!category) return {};
  if (segment === content.messages.routes.troubleshooter) {
    const page = content.messages.pages.troubleshooter;
    return createPageMetadata({
      locale, title: page.metaTitle, description: page.metaDescription,
      path: paths.troubleshooter(locale, category), noIndex: true,
      pathForLocale: (candidate) => {
        const localized = getCachedContent(candidate).getCategoryById(category.id);
        return localized ? paths.troubleshooter(candidate, localized) : undefined;
      },
    });
  }
  const manufacturer = content.getManufacturerBySlug(segment);
  if (!manufacturer || !manufacturer.categoryIds.includes(category.id)) return {};
  const page = content.messages.pages.manufacturer;
  return createPageMetadata({
    locale,
    title: formatMessage(page.metaTitle, { name: manufacturer.name }),
    description: formatMessage(page.metaDescription, { name: manufacturer.name }),
    path: paths.manufacturer(locale, category, manufacturer),
    noIndex: !content.manufacturerHasIndexableContent(manufacturer.id),
    pathForLocale: (candidate) => {
      const candidateContent = getCachedContent(candidate);
      const localizedCategory = candidateContent.getCategoryById(category.id);
      const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
      return localizedCategory && localizedManufacturer ? paths.manufacturer(candidate, localizedCategory, localizedManufacturer) : undefined;
    },
  });
}

export default async function SegmentPage({ params }: PageProps) {
  const { locale, section, segment } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  const category = content.getCategoryBySlug(section);
  if (!category) notFound();
  if (segment === content.messages.routes.troubleshooter) return <TroubleshooterPage locale={locale} category={category} content={content} />;
  const manufacturer = content.getManufacturerBySlug(segment);
  if (!manufacturer || !manufacturer.categoryIds.includes(category.id)) notFound();
  return <ManufacturerPage locale={locale} category={category} manufacturer={manufacturer} content={content} />;
}

type Content = ReturnType<typeof getCachedContent>;

function ManufacturerPage({ locale, category, manufacturer, content }: { locale: Locale; category: Content["deviceCategories"][number]; manufacturer: Content["manufacturers"][number]; content: Content }) {
  const page = content.messages.pages.manufacturer;
  const hasIndexableContent = content.manufacturerHasIndexableContent(manufacturer.id);
  const models = content.models.filter((record) => record.manufacturerId === manufacturer.id && (!hasIndexableContent || content.isModelIndexable(record)));
  const codes = content.errorCodes.filter((record) => record.manufacturerId === manufacturer.id && (!hasIndexableContent || content.isErrorCodeIndexable(record)));
  return (
    <main className="page-main" id="main-content">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: formatMessage(page.metaTitle, { name: manufacturer.name }), inLanguage: locale, url: absoluteUrl(paths.manufacturer(locale, category, manufacturer)), description: manufacturer.overview }} />
      <div className="site-shell">
        <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={paths.manufacturer(locale, category, manufacturer)} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: manufacturer.name }]} />
        <header className="page-hero manufacturer-hero"><div><span className="eyebrow">{page.eyebrow}</span><h1>{formatMessage(page.title, { name: manufacturer.name })}</h1><p>{manufacturer.overview}</p></div><div className="manufacturer-monogram" aria-hidden="true">{manufacturer.name.slice(0, 2).toUpperCase()}</div></header>
        <div className="content-layout"><div>
          <section className="section-block section-block-first" aria-labelledby="models-heading">
            <div className="section-heading"><div><span className="eyebrow">{page.modelEyebrow}</span><h2 id="models-heading">{page.models}</h2></div><span className="section-note">{page.exactOnly}</span></div>
            {models.length ? <div className="record-list">{models.map((model) => <Link href={paths.model(locale, category, manufacturer, model)} key={model.id}><div><VerificationBadge status={model.verificationStatus} labels={content.messages.verificationLabels} /><h3>{model.name}</h3><p>{model.modelNumber}{model.isFictional ? ` · ${page.fictional}` : ""}</p></div><span className="record-arrow" aria-hidden="true">→</span></Link>)}</div> : <div className="empty-state"><span className="empty-state-code">00</span><div><h3>{page.noModels}</h3><p>{page.noModelsBody}</p></div></div>}
          </section>
          <section className="section-block" aria-labelledby="codes-heading">
            <div className="section-heading"><div><span className="eyebrow">{page.codeEyebrow}</span><h2 id="codes-heading">{page.errorCodes}</h2></div></div>
            {codes.length ? <div className="code-grid">{codes.map((code) => <Link href={paths.errorCode(locale, category, manufacturer, code)} key={code.id}><code>{code.code}{code.aliases[0] ? ` / ${code.aliases[0]}` : ""}</code><div><strong>{code.title}</strong><span>{code.isFictional ? page.fictional : page.reviewedRecord}</span></div><span aria-hidden="true">→</span></Link>)}</div> : <div className="inline-empty">{page.noCodes}</div>}
          </section>
        </div><aside className="content-rail">
          <div className="rail-card"><span className="eyebrow">{page.beforeSearch}</span><h2>{page.captureLabel}</h2><p>{page.captureBody}</p></div>
          <div className="rail-card rail-card-dark"><span className="eyebrow eyebrow-light">{page.sharedGuides}</span><h2>{page.sharedGuides}</h2><p>{page.sharedBody}</p><Link className="text-link-light" href={paths.category(locale, category)}>{page.browseGuides}</Link></div>
        </aside></div>
      </div>
    </main>
  );
}

function TroubleshooterPage({ locale, category, content }: { locale: Locale; category: Content["deviceCategories"][number]; content: Content }) {
  const page = content.messages.pages.troubleshooter;
  return (
    <main className="page-main troubleshooter-page" id="main-content"><div className="site-shell">
      <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={paths.troubleshooter(locale, category)} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: page.breadcrumb }]} />
      <div className="troubleshooter-layout">
        <header className="troubleshooter-intro"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p><div className="trust-note"><span aria-hidden="true">i</span><p><strong>{page.boundaryTitle}</strong>{" "}{page.boundaryBody}</p></div></header>
        <Troubleshooter nodes={content.troubleshooterNodes} messages={content.messages.ui} />
      </div>
    </div></main>
  );
}
