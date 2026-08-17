import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RelatedProblems } from "@/components/related-problems";
import { ClaimSources, SourceList } from "@/components/source-list";
import { SafetyBadge, VerificationBadge } from "@/components/status-badge";
import { getCachedContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { isSupportedLocale, supportedLocales } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface PageProps { params: Promise<{ locale: string; section: string; segment: string; item: string }> }

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    return content.deviceCategories.flatMap((category) => [
      ...content.problems.filter((problem) => problem.categoryId === category.id && content.isProblemIndexable(problem)).map((problem) => ({ locale, section: category.slug, segment: content.messages.routes.problems, item: problem.slug })),
      ...content.errorCodes.filter((code) => code.categoryId === category.id && content.isErrorCodeIndexable(code)).flatMap((code) => {
        const manufacturer = content.getManufacturerById(code.manufacturerId);
        return manufacturer ? [{ locale, section: category.slug, segment: manufacturer.slug, item: code.slug }] : [];
      }),
    ]);
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section, segment, item } = await params;
  if (!isSupportedLocale(locale)) return {};
  const content = getCachedContent(locale);
  const category = content.getCategoryBySlug(section);
  if (!category) return {};
  if (segment === content.messages.routes.problems) {
    const problem = content.getProblemBySlug(item);
    if (!problem || problem.categoryId !== category.id || !content.isProblemIndexable(problem)) return {};
    const page = content.messages.pages.problem;
    return createPageMetadata({
      locale,
      title: formatMessage(page.metaTitle, { title: problem.title }),
      description: formatMessage(page.metaDescription, { summary: problem.summary }),
      path: paths.problem(locale, category, problem),
      openGraphType: "article",
      pathForLocale: (candidate) => {
        const candidateContent = getCachedContent(candidate);
        const localizedCategory = candidateContent.getCategoryById(category.id);
        const localizedProblem = candidateContent.getProblemById(problem.id);
        return localizedCategory && localizedProblem ? paths.problem(candidate, localizedCategory, localizedProblem) : undefined;
      },
    });
  }
  const manufacturer = content.getManufacturerBySlug(segment);
  const code = manufacturer && content.getErrorCodeBySlug(manufacturer.id, item);
  if (!manufacturer || !code || code.categoryId !== category.id || !content.isErrorCodeIndexable(code)) return {};
  const page = content.messages.pages.error;
  return createPageMetadata({
    locale,
    title: formatMessage(page.metaTitle, { name: manufacturer.name, code: code.code }),
    description: formatMessage(page.metaDescription, { name: manufacturer.name, code: code.code }),
    path: paths.errorCode(locale, category, manufacturer, code),
    openGraphType: "article",
    pathForLocale: (candidate) => {
      const candidateContent = getCachedContent(candidate);
      const localizedCategory = candidateContent.getCategoryById(category.id);
      const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
      const localizedCode = candidateContent.errorCodes.find((record) => record.id === code.id);
      return localizedCategory && localizedManufacturer && localizedCode
        ? paths.errorCode(candidate, localizedCategory, localizedManufacturer, localizedCode)
        : undefined;
    },
  });
}

export default async function ItemPage({ params }: PageProps) {
  const { locale, section, segment, item } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  const category = content.getCategoryBySlug(section);
  if (!category) notFound();
  if (segment === content.messages.routes.problems) {
    const problem = content.getProblemBySlug(item);
    if (!problem || problem.categoryId !== category.id || !content.isProblemIndexable(problem)) notFound();
    return <ProblemPage locale={locale} category={category} problem={problem} content={content} />;
  }
  const manufacturer = content.getManufacturerBySlug(segment);
  const code = manufacturer && content.getErrorCodeBySlug(manufacturer.id, item);
  if (!manufacturer || !code || code.categoryId !== category.id || !content.isErrorCodeIndexable(code)) notFound();
  return <ErrorPage locale={locale} category={category} manufacturer={manufacturer} code={code} content={content} />;
}

type Content = ReturnType<typeof getCachedContent>;

function ProblemPage({ locale, category, problem, content }: { locale: Locale; category: Content["deviceCategories"][number]; problem: Content["problems"][number]; content: Content }) {
  const page = content.messages.pages.problem;
  const guide = content.getGuideById(problem.guideId);
  const sourceIds = [...new Set([...problem.sourceIds, ...(guide?.sourceIds ?? []), ...(guide?.steps.flatMap((step) => step.sourceIds) ?? [])])];
  const sources = content.getSourcesByIds(sourceIds);
  const related = content.getRelatedProblems(problem);
  const path = paths.problem(locale, category, problem);
  return (
    <main className="page-main" id="main-content">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: problem.title,
        description: problem.summary,
        inLanguage: locale,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        image: absoluteUrl("/og.png"),
        author: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(paths.home(locale)) },
        publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(paths.home(locale)) },
        dateModified: guide?.lastReviewed ?? undefined,
        isBasedOn: sources.flatMap((source) => source.url ? [source.url] : []),
      }} />
      <div className="site-shell">
        <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={path} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: problem.title }]} />
        <header className="record-hero"><div><span className="eyebrow">{page.eyebrow}</span><div className="card-badges"><VerificationBadge status={problem.verificationStatus} labels={content.messages.verificationLabels} /><SafetyBadge level={problem.safetyLevel} labels={content.messages.safetyLabels} /></div><h1>{problem.title}</h1><p>{problem.summary}</p></div></header>
        <div className="fact-grid"><div><span>{page.symptoms}</span><strong>{problem.symptomLabels.join(" · ")}</strong></div><div><span>{page.safety}</span><strong>{content.messages.safetyLabels[problem.safetyLevel]}</strong></div>{guide?.lastReviewed ? <div><span>{formatMessage(page.reviewed, { date: guide.lastReviewed })}</span></div> : null}</div>
        {guide ? (
          <section className="section-block" aria-labelledby="guide-heading">
            <div className="section-heading"><div><span className="eyebrow">{page.safeChecks}</span><h2 id="guide-heading">{guide.title}</h2></div><span className="section-note">{formatMessage(page.steps, { count: guide.steps.length })}</span></div>
            <ol className="step-list">{guide.steps.map((step, index) => <li key={step.id}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><div><div className="step-title-row"><h3>{step.title}</h3><SafetyBadge level={step.safetyLevel} labels={content.messages.safetyLabels} /></div><p>{step.instruction}</p><ClaimSources sourceIds={step.sourceIds} sources={sources} messages={content.messages.ui} /></div></li>)}</ol>
          </section>
        ) : <section className="empty-state empty-state-wide"><span className="empty-state-code">?</span><div><h2>{page.noGuide}</h2><p>{page.noGuideBody}</p></div></section>}
        <SourceList sources={sources} messages={content.messages.ui} sourceTypeLabels={content.messages.sourceTypeLabels} verificationLabels={content.messages.verificationLabels} />
        <RelatedProblems locale={locale} category={category} problems={related} messages={content.messages.ui} verificationLabels={content.messages.verificationLabels} safetyLabels={content.messages.safetyLabels} />
      </div>
    </main>
  );
}

function ErrorPage({ locale, category, manufacturer, code, content }: { locale: Locale; category: Content["deviceCategories"][number]; manufacturer: Content["manufacturers"][number]; code: Content["errorCodes"][number]; content: Content }) {
  const page = content.messages.pages.error;
  const guide = content.getGuideById(code.guideId);
  const canonicalProblem = guide && content.getProblemById(guide.canonicalProblemId);
  const sources = content.getSourcesByIds(code.sourceIds);
  const related = canonicalProblem ? content.getRelatedProblems(canonicalProblem) : [];
  const path = paths.errorCode(locale, category, manufacturer, code);
  return (
    <main className="page-main" id="main-content">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: `${manufacturer.name} ${code.code}: ${code.title}`,
        description: code.summary,
        inLanguage: locale,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        image: absoluteUrl("/og.png"),
        author: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(paths.home(locale)) },
        publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl(paths.home(locale)) },
        dateModified: guide?.lastReviewed ?? undefined,
        isBasedOn: sources.flatMap((source) => source.url ? [source.url] : []),
      }} />
      <div className="site-shell">
        <Breadcrumbs ariaLabel={content.messages.ui.breadcrumb} currentPath={path} items={[{ label: content.messages.ui.home, href: paths.home(locale) }, { label: category.name, href: paths.category(locale, category) }, { label: manufacturer.name, href: paths.manufacturer(locale, category, manufacturer) }, { label: code.code }]} />
        <header className="error-hero"><div className="error-code-block"><span>{page.codeLabel}</span><code>{code.code}</code></div><div className="error-hero-copy"><span className="eyebrow">{page.eyebrow}</span><div className="card-badges"><VerificationBadge status={code.verificationStatus} labels={content.messages.verificationLabels} /></div><h1>{manufacturer.name} {code.code}</h1><p>{code.summary}</p>{code.aliases.length || code.signalLabels.length ? <p className="alias-line">{formatMessage(page.aliases, { aliases: [...code.aliases, ...code.signalLabels].join(", ") })}</p> : null}</div></header>
        <div className="fact-grid"><div><span>{page.scope}</span><strong>{code.sourceScope}</strong></div><div><span>{page.applicability}</span><strong>{code.applicabilityNote}</strong></div><div><span>{page.evidenceStatus}</span><strong>{content.messages.verificationLabels[code.verificationStatus]}</strong></div></div>
        {guide && canonicalProblem ? (
          <section className="section-block" aria-labelledby="shared-guide-heading">
            <div className="section-heading"><div><span className="eyebrow">{page.sharedEyebrow}</span><h2 id="shared-guide-heading">{page.canonical}</h2></div><SafetyBadge level={guide.safetyLevel} labels={content.messages.safetyLabels} /></div>
            <Link className="guide-summary" href={paths.problem(locale, category, canonicalProblem)}><div><h3>{guide.title}</h3><p>{page.canonicalBody}</p></div><span aria-hidden="true">→</span></Link>
          </section>
        ) : <section className="empty-state empty-state-wide"><span className="empty-state-code">?</span><div><h2>{page.noGuide}</h2><p>{page.noGuideBody}</p><Link className="text-link" href={paths.troubleshooter(locale, category)}>{page.useFramework}</Link></div></section>}
        <SourceList sources={sources} messages={content.messages.ui} sourceTypeLabels={content.messages.sourceTypeLabels} verificationLabels={content.messages.verificationLabels} />
        <RelatedProblems locale={locale} category={category} problems={related} messages={content.messages.ui} verificationLabels={content.messages.verificationLabels} safetyLabels={content.messages.safetyLabels} />
      </div>
    </main>
  );
}
