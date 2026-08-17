import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { SearchBox } from "@/components/search-box";
import { getCachedContent } from "@/lib/content";
import { isSupportedLocale } from "@/lib/i18n/config";
import { formatMessage } from "@/lib/i18n/messages";
import { paths } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { searchKnowledgeItems } from "@/lib/search.mjs";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) return {};
  const { messages } = getCachedContent(locale);
  return createPageMetadata({
    locale,
    title: messages.pages.home.metaTitle,
    description: messages.pages.home.metaDescription,
    path: paths.home(locale),
    pathForLocale: (candidate) => paths.home(candidate),
  });
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const content = getCachedContent(locale);
  const { messages, searchItems } = content;
  const page = messages.pages.home;
  const category = content.getCategoryById(siteConfig.primaryCategoryId);
  if (!category || !content.categoryHasIndexableContent(category.id)) notFound();
  const manufacturers = content.manufacturers.filter((record) =>
    record.categoryIds.includes(category.id) && content.manufacturerHasIndexableContent(record.id, category.id));
  const problems = content.problems.filter((record) =>
    record.categoryId === category.id && content.isProblemIndexable(record));
  const exampleProblem = problems.find((record) => record.id === "problem-dishwasher-not-draining") ?? problems[0];
  const publishedCodes = content.errorCodes.filter((record) =>
    record.categoryId === category.id && content.isErrorCodeIndexable(record));
  const boschCode = publishedCodes.find((record) => record.id === "error-bosch-e24");
  const samsungCode = publishedCodes.find((record) => record.id === "error-samsung-5c");
  const bosch = boschCode ? content.getManufacturerById(boschCode.manufacturerId) : undefined;
  const samsung = samsungCode ? content.getManufacturerById(samsungCode.manufacturerId) : undefined;
  const siemensModel = content.models.find((record) =>
    record.id === "model-siemens-sn25m889eu-55" && content.isModelIndexable(record));
  const samsungAlias = samsungCode?.aliases.find((alias) => alias === "5E");
  if (!exampleProblem || !boschCode || !samsungCode || !bosch || !samsung || !siemensModel || !samsungAlias) notFound();
  const searchExamples = [
    { label: `${bosch.name} ${boschCode.code}`, query: `${bosch.name} ${boschCode.code}` },
    { label: `${samsung.name} ${samsungAlias}`, query: `${samsung.name} ${samsungAlias}` },
    { label: siemensModel.name, query: siemensModel.name },
    { label: `${category.singularName} not draining`, query: `${category.singularName} not draining` },
  ];
  if (searchExamples.some((example) =>
    searchKnowledgeItems(searchItems, example.query, messages.searchTypeLabels, 10, locale).length === 0)) notFound();
  const categoryPath = paths.category(locale, category);
  const recoveryLinks = [
    { href: `${categoryPath}#manufacturers-heading`, label: messages.ui.searchBrowseManufacturers },
    { href: `${categoryPath}#symptoms-heading`, label: messages.ui.searchBrowseProblems },
  ];

  return (
    <main id="main-content">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        inLanguage: locale,
        url: absoluteUrl(paths.home(locale)),
        description: page.metaDescription,
      }} />
      <section className="hero-section">
        <div className="site-shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">{page.eyebrow}</span>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <SearchBox
              items={searchItems}
              locale={locale}
              messages={messages.ui}
              typeLabels={messages.searchTypeLabels}
              anchorId="search"
              examples={searchExamples}
              examplesAriaLabel={page.examplesAria}
              examplesPrefix={page.try}
              recoveryLinks={recoveryLinks}
            />
            <p className="hero-trust">{page.trustBody} <Link href={paths.editorial(locale)}>{page.trustLink}</Link></p>
          </div>
        </div>
      </section>
      <section className="lookup-paths" aria-labelledby="lookup-paths-heading">
        <div className="site-shell">
          <div className="lookup-paths-heading">
            <span className="eyebrow">{page.pathsEyebrow}</span>
            <h2 id="lookup-paths-heading">{page.pathsTitle}</h2>
          </div>
          <div className="lookup-path-grid">
            {[
              ["01", page.modelPathTitle, page.modelPathBody],
              ["02", page.codePathTitle, page.codePathBody],
              ["03", page.symptomPathTitle, page.symptomPathBody],
            ].map(([number, title, body]) => (
              <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-block site-shell" aria-labelledby="browse-heading">
        <div className="section-heading">
          <div><span className="eyebrow">{page.browseEyebrow}</span><h2 id="browse-heading">{page.browseTitle}</h2></div>
          <Link className="text-link" href={paths.devices(locale)}>{page.viewDevices}</Link>
        </div>
        <div className="device-feature-card">
          <div className="device-monogram" aria-hidden="true">DW</div>
          <div className="device-feature-copy">
            <div className="card-badges"><span className="badge badge-live">{page.mvpCategory}</span><span className="muted-label">{formatMessage(page.manufacturerCount, { count: manufacturers.length })}</span></div>
            <h3>{page.databaseTitle}</h3><p>{page.databaseBody}</p>
            <div className="database-coverage" aria-label={page.databaseCoverageAria}>
              <span>{page.databaseManufacturers}</span><span>{page.databaseCodes}</span><span>{page.databaseProblems}</span><span>{page.databaseModels}</span>
            </div>
            <div className="brand-row" aria-label={page.manufacturersAria}>{manufacturers.map((manufacturer) => <span key={manufacturer.id}>{manufacturer.name}</span>)}</div>
          </div>
          <Link className="button-primary" href={categoryPath}>{page.browseDishwashers}</Link>
        </div>
      </section>
      <section className="section-block section-tint">
        <div className="site-shell split-section">
          <div className="split-intro"><span className="eyebrow">{page.frameworkEyebrow}</span><h2>{page.frameworkTitle}</h2><p>{page.frameworkBody}</p><Link className="button-primary" href={paths.troubleshooter(locale, category)}>{page.startTroubleshooter}</Link></div>
          <ol className="method-list">
            {[[page.identify, page.identifyBody], [page.evidence, page.evidenceBody], [page.safeStep, page.safeStepBody]].map(([title, body], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{body}</p></div></li>)}
          </ol>
        </div>
      </section>
      <section className="section-block site-shell" aria-labelledby="problem-heading">
        <div className="section-heading"><div><span className="eyebrow">{page.reviewedEyebrow}</span><h2 id="problem-heading">{page.clusterTitle}</h2></div><span className="section-note">{formatMessage(page.guideCount, { count: problems.length })}</span></div>
        <div className="card-grid card-grid-two">
          {problems.map((problem, index) => (
            <Link className="content-card problem-card" href={paths.problem(locale, category, problem)} key={problem.id}>
              <span className="card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="badge badge-verified">{messages.verificationLabels.verified}</span>
              <h3>{problem.title}</h3><p>{problem.summary}</p><span className="text-link">{page.viewRecord}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
