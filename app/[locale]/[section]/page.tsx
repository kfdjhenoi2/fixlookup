import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SearchBox } from "@/components/search-box";
import { VerificationBadge } from "@/components/status-badge";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

interface PageProps { params: Promise<{ locale: string; section: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    return [
      { locale, section: content.messages.routes.devices },
      ...content.deviceCategories.map((category) => ({ locale, section: category.slug })),
    ];
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section } = await params;
  if (!isSupportedLocale(locale)) return {};
  const content = getCachedContent(locale);
  if (section === content.messages.routes.devices) {
    const page = content.messages.pages.devices;
    return createPageMetadata({ locale, title: page.metaTitle, description: page.metaDescription, path: paths.devices(locale), pathForLocale: (candidate) => paths.devices(candidate) });
  }
  const category = content.getCategoryBySlug(section);
  if (!category) return {};
  const page = content.messages.pages.category;
  return createPageMetadata({
    locale,
    title: page.metaTitle,
    description: page.metaDescription,
    path: paths.category(locale, category),
    pathForLocale: (candidate) => {
      const localized = getCachedContent(candidate).getCategoryById(category.id);
      return localized ? paths.category(candidate, localized) : undefined;
    },
  });
}

export default async function SectionPage({ params }: PageProps) {
  const { locale, section } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  return section === content.messages.routes.devices
    ? <DevicesPage locale={locale} content={content} />
    : <CategoryPage locale={locale} section={section} content={content} />;
}

type Content = ReturnType<typeof getCachedContent>;

function DevicesPage({ locale, content }: { locale: typeof supportedLocales[number]; content: Content }) {
  const page = content.messages.pages.devices;
  return (
    <main className="page-main" id="main-content"><div className="site-shell">
      <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: page.breadcrumb }]} />
      <header className="page-hero page-hero-compact"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></header>
      <section className="section-block section-block-first"><div className="card-grid">
        {content.deviceCategories.map((category) => (
          <Link className="content-card category-card" href={paths.category(locale, category)} key={category.id}>
            <div className="category-card-top"><span className="device-monogram device-monogram-small" aria-hidden="true">DW</span><span className="badge badge-live">{page.available}</span></div>
            <h2>{category.name}</h2><p>{category.description}</p>
            <span className="muted-label">{formatMessage(page.indexCount, { count: category.manufacturerIds.length })}</span><span className="text-link">{page.browse}</span>
          </Link>
        ))}
        <div className="content-card category-card category-card-disabled">
          <div className="category-card-top"><span className="device-monogram device-monogram-small" aria-hidden="true">+</span><span className="badge badge-neutral">{page.later}</span></div>
          <h2>{page.moreTitle}</h2><p>{page.moreBody}</p>
        </div>
      </div></section>
    </div></main>
  );
}

function CategoryPage({ locale, section, content }: { locale: typeof supportedLocales[number]; section: string; content: Content }) {
  const category = content.getCategoryBySlug(section);
  if (!category) notFound();
  const page = content.messages.pages.category;
  const manufacturers = content.manufacturers.filter((record) => record.categoryIds.includes(category.id));
  const problems = content.problems.filter((record) => record.categoryId === category.id && content.isProblemIndexable(record));
  return (
    <main className="page-main" id="main-content">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: page.title, inLanguage: locale, url: absoluteUrl(paths.category(locale, category)), description: category.description }} />
      <div className="site-shell">
        <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: content.messages.ui.navDevices, href: paths.devices(locale) }, { label: category.name }]} />
        <header className="category-hero"><div><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></div><div className="category-code" aria-hidden="true">DW / 01</div></header>
        <SearchBox items={content.searchItems} locale={locale} messages={content.messages.ui} typeLabels={content.messages.searchTypeLabels} compact />
        <section className="section-block" aria-labelledby="manufacturers-heading">
          <div className="section-heading"><div><span className="eyebrow">{page.manufacturerEyebrow}</span><h2 id="manufacturers-heading">{page.manufacturerTitle}</h2></div><span className="section-note">{formatMessage(page.indexCount, { count: manufacturers.length })}</span></div>
          <div className="manufacturer-grid">{manufacturers.map((manufacturer, index) => <Link href={paths.manufacturer(locale, category, manufacturer)} key={manufacturer.id}><span className="manufacturer-index">{String(index + 1).padStart(2, "0")}</span><strong>{manufacturer.name}</strong><span aria-hidden="true">→</span></Link>)}</div>
        </section>
        <section className="section-block" aria-labelledby="symptoms-heading">
          <div className="section-heading"><div><span className="eyebrow">{page.symptomEyebrow}</span><h2 id="symptoms-heading">{page.symptomTitle}</h2></div><span className="section-note">{formatMessage(page.topicCount, { count: problems.length })}</span></div>
          <div className="record-list">{problems.map((problem) => <Link href={paths.problem(locale, category, problem)} key={problem.id}><div><VerificationBadge status={problem.verificationStatus} labels={content.messages.verificationLabels} /><h3>{problem.title}</h3><p>{problem.summary}</p></div><span className="record-arrow" aria-hidden="true">→</span></Link>)}</div>
        </section>
        <section className="framework-callout"><div><span className="eyebrow eyebrow-light">{page.unsure}</span><h2>{page.frameworkTitle}</h2><p>{page.frameworkBody}</p></div><Link className="button-light" href={paths.troubleshooter(locale, category)}>{page.start}</Link></section>
      </div>
    </main>
  );
}
