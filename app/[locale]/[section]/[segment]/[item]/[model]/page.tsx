import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { VerificationBadge } from "@/components/status-badge";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";

interface PageProps { params: Promise<{ locale: string; section: string; segment: string; item: string; model: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    return content.models.flatMap((model) => {
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
  if (!category || !manufacturer || !model || route.item !== content.messages.routes.models || model.categoryId !== category.id) return {};
  const page = content.messages.pages.model;
  return createPageMetadata({
    locale: route.locale,
    title: formatMessage(page.metaTitle, { name: model.name }),
    description: formatMessage(page.metaDescription, { name: model.name }),
    path: paths.model(route.locale, category, manufacturer, model),
    noIndex: !content.isModelIndexable(model),
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
  if (!category || !manufacturer || !model || route.item !== content.messages.routes.models || model.categoryId !== category.id) notFound();
  const page = content.messages.pages.model;
  const family = content.modelFamilies.find((record) => record.id === model.familyId);
  const sources = content.getSourcesByIds(model.sourceIds);
  const guides = model.guideIds.flatMap((id) => {
    const guide = content.getGuideById(id);
    const problem = guide && content.getProblemById(guide.canonicalProblemId);
    return guide && problem ? [{ guide, problem }] : [];
  });
  return (
    <main className="page-main" id="main-content"><div className="site-shell">
      <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={paths.model(locale, category, manufacturer, model)} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: manufacturer.name, href: paths.manufacturer(locale, category, manufacturer) }, { label: model.name }]} />
      <header className="record-hero"><div><span className="eyebrow">{page.eyebrow}</span><VerificationBadge status={model.verificationStatus} labels={content.messages.verificationLabels} /><h1>{model.name}</h1><p>{model.note}</p>{model.isFictional ? <p className="trust-note">{page.fictionalWarning}</p> : null}</div></header>
      <section className="section-block" aria-labelledby="identity-heading"><div className="section-heading"><div><span className="eyebrow">{page.identity}</span><h2 id="identity-heading">{page.identity}</h2></div></div><div className="fact-grid"><div><span>{page.modelNumber}</span><strong>{model.modelNumber}</strong></div><div><span>{page.family}</span><strong>{family?.name ?? "—"}</strong></div><div><span>{page.evidence}</span><strong>{content.messages.verificationLabels[model.verificationStatus]}</strong></div></div></section>
      <section className="section-block" aria-labelledby="model-guides-heading"><div className="section-heading"><div><span className="eyebrow">{page.guidesEyebrow}</span><h2 id="model-guides-heading">{page.guides}</h2></div></div>{guides.length ? <div className="record-list">{guides.map(({ guide, problem }) => <Link href={paths.problem(locale, category, problem)} key={guide.id}><div><h3>{guide.title}</h3></div><span className="record-arrow">{page.openGuide}</span></Link>)}</div> : <div className="inline-empty">{page.noGuides}</div>}</section>
      <SourceList sources={sources} messages={content.messages.ui} sourceTypeLabels={content.messages.sourceTypeLabels} verificationLabels={content.messages.verificationLabels} />
    </div></main>
  );
}
