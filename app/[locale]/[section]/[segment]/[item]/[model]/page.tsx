import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ClaimSources, SourceList } from "@/components/source-list";
import { VerificationBadge } from "@/components/status-badge";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

interface PageProps { params: Promise<{ locale: string; section: string; segment: string; item: string; model: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    return content.models.filter(content.isModelIndexable).flatMap((model) => {
      const category = content.getCategoryById(model.categoryId);
      const manufacturer = content.getManufacturerById(model.manufacturerId);
      return category && manufacturer ? [{ locale, section: category.slug, segment: manufacturer.slug, item: content.messages.routes.models, model: model.slug }] : [];
    });
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const route = await params;
  if (!isSupportedLocale(route.locale)) return {};
  const content = getCachedContent(route.locale);
  const category = content.getCategoryBySlug(route.section);
  const manufacturer = content.getManufacturerBySlug(route.segment);
  const model = manufacturer && content.getModelBySlug(manufacturer.id, route.model);
  if (!category || !manufacturer || !model || route.item !== content.messages.routes.models || model.categoryId !== category.id || !content.isModelIndexable(model)) return {};
  const page = content.messages.pages.model;
  return createPageMetadata({
    locale: route.locale,
    title: formatMessage(page.metaTitle, { name: model.name }),
    description: formatMessage(model.errorRelationships.length ? page.metaDescription : page.metaDescriptionNoCodes, { name: model.name }),
    path: paths.model(route.locale, category, manufacturer, model),
    pathForLocale: (candidate) => {
      const candidateContent = getCachedContent(candidate);
      const localizedCategory = candidateContent.getCategoryById(category.id);
      const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
      const localizedModel = candidateContent.models.find((record) => record.id === model.id);
      return localizedCategory && localizedManufacturer && localizedModel ? paths.model(candidate, localizedCategory, localizedManufacturer, localizedModel) : undefined;
    },
  });
}

export default async function ModelPage({ params }: PageProps) {
  const route = await params;
  const locale = route.locale;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  const category = content.getCategoryBySlug(route.section);
  const manufacturer = content.getManufacturerBySlug(route.segment);
  const model = manufacturer && content.getModelBySlug(manufacturer.id, route.model);
  if (!category || !manufacturer || !model || route.item !== content.messages.routes.models || model.categoryId !== category.id || !content.isModelIndexable(model)) notFound();
  const page = content.messages.pages.model;
  const sources = content.getSourcesByIds(model.sourceIds);
  const documentationSources = sources.filter((source) =>
    [...model.identitySourceIds, ...model.manualSourceIds].includes(source.id),
  );
  const markets = model.marketIds.flatMap((marketId) => {
    const market = content.getMarketById(marketId);
    return market ? [market] : [];
  });
  const errorRelationships = model.errorRelationships.flatMap((relationship) => {
    const errorCode = content.errorCodes.find((record) => record.id === relationship.signalId);
    return errorCode ? [{ relationship, errorCode }] : [];
  });
  const problemRelationships = model.problemRelationships.flatMap((relationship) => {
    const problem = content.getProblemById(relationship.problemId);
    return problem ? [{ relationship, problem }] : [];
  });
  const canonicalPath = paths.model(locale, category, manufacturer, model);
  return (
    <main className="page-main" id="main-content"><div className="site-shell">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: model.name,
        url: absoluteUrl(canonicalPath),
        inLanguage: locale,
        description: model.note,
        mainEntity: {
          "@type": "Product",
          name: model.name,
          model: model.modelNumber,
          brand: { "@type": "Brand", name: manufacturer.name },
        },
        isBasedOn: sources.flatMap((source) => source.url ? [source.url] : []),
      }} />
      <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={canonicalPath} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: manufacturer.name, href: paths.manufacturer(locale, category, manufacturer) }, { label: model.name }]} />
      <header className="record-hero"><div><span className="eyebrow">{page.eyebrow}</span><VerificationBadge status={model.verificationStatus} labels={content.messages.verificationLabels} /><h1>{model.name}</h1><p>{model.note}</p></div></header>
      <section className="section-block" aria-labelledby="identity-heading"><div className="section-heading"><div><span className="eyebrow">{page.identity}</span><h2 id="identity-heading">{page.identity}</h2></div></div><div className="fact-grid"><div><span>{page.modelNumber}</span><strong>{model.modelNumber}</strong></div><div><span>{page.markets}</span><strong>{markets.map((market) => market.name).join(", ")}</strong></div><div><span>{page.evidence}</span><strong>{page.evidenceValue}</strong></div></div></section>
      <section className="section-block" aria-labelledby="model-documentation-heading"><div className="section-heading"><div><span className="eyebrow">{page.documentationEyebrow}</span><h2 id="model-documentation-heading">{page.documentation}</h2></div></div><p>{page.documentationBody}</p><div className="record-list">{documentationSources.map((source) => <a href={`#source-${source.id}`} key={source.id}><div><span className="source-type">{content.messages.sourceTypeLabels[source.kind]}</span><h3>{source.title}</h3></div><span className="record-arrow" aria-hidden="true">↓</span></a>)}</div></section>
      <section className="section-block" aria-labelledby="model-errors-heading"><div className="section-heading"><div><span className="eyebrow">{page.errorsEyebrow}</span><h2 id="model-errors-heading">{page.errors}</h2></div></div>{errorRelationships.length ? <><p>{page.exactCodeNote}</p><div className="model-relationship-list">{errorRelationships.map(({ relationship, errorCode }) => <article className="model-relationship" key={relationship.id}><div><code>{relationship.verifiedIdentifiers.join(" / ")}</code><h3><Link href={paths.errorCode(locale, category, manufacturer, errorCode)}>{manufacturer.name} {relationship.verifiedIdentifiers.join(" / ")} {content.messages.ui.searchKeywordErrorCode}</Link></h3><ClaimSources sourceIds={relationship.sourceIds} sources={sources} messages={content.messages.ui} /></div><Link className="text-link" href={paths.errorCode(locale, category, manufacturer, errorCode)}>{page.openGuide}</Link></article>)}</div></> : <div className="inline-empty">{page.noErrors}</div>}</section>
      <section className="section-block" aria-labelledby="model-guides-heading"><div className="section-heading"><div><span className="eyebrow">{page.guidesEyebrow}</span><h2 id="model-guides-heading">{page.guides}</h2></div></div><div className="model-relationship-list">{problemRelationships.map(({ relationship, problem }) => <article className="model-relationship" key={relationship.id}><div><h3><Link href={paths.problem(locale, category, problem)}>{problem.title}</Link></h3><p>{problem.summary}</p><ClaimSources sourceIds={relationship.sourceIds} sources={sources} messages={content.messages.ui} /></div><Link className="text-link" href={paths.problem(locale, category, problem)}>{page.openGuide}</Link></article>)}</div></section>
      <div className="model-boundaries"><section className="notice" aria-labelledby="model-applicability-heading"><h2 id="model-applicability-heading">{page.applicabilityTitle}</h2><p>{page.applicabilityBody}</p></section><section className="notice notice-warning" aria-labelledby="model-safety-heading"><h2 id="model-safety-heading">{page.safetyTitle}</h2><p>{page.safetyBody}</p><Link className="text-link" href={paths.safety(locale)}>{page.readSafety}</Link></section></div>
      <SourceList sources={sources} messages={content.messages.ui} sourceTypeLabels={content.messages.sourceTypeLabels} verificationLabels={content.messages.verificationLabels} />
    </div></main>
  );
}
