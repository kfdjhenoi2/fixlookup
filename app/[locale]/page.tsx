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
import { absoluteUrl } from "@/lib/site";

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
  const { messages, manufacturers, problems, searchItems } = content;
  const page = messages.pages.home;
  const category = content.deviceCategories[0];
  const bosch = content.getManufacturerById("manufacturer-bosch")!;
  const drain = content.getProblemById("problem-dishwasher-not-draining")!;
  const e15 = content.errorCodes.find((record) => record.id === "error-bosch-e15")!;

  return (
    <main id="main-content">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "FixOrReplace",
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
            <SearchBox items={searchItems} locale={locale} messages={messages.ui} typeLabels={messages.searchTypeLabels} />
            <div className="search-examples" aria-label={page.examplesAria}>
              <span>{page.try}</span>
              <Link href={paths.manufacturer(locale, category, bosch)}>{page.exampleBrand}</Link>
              <Link href={paths.problem(locale, category, drain)}>{page.exampleProblem}</Link>
              <Link href={paths.errorCode(locale, category, bosch, e15)}>{page.exampleCode}</Link>
            </div>
          </div>
          <aside className="hero-proof" aria-label={page.commitmentsAria}>
            <div className="proof-topline"><span className="signal-dot" aria-hidden="true" />{page.gates}</div>
            <div className="proof-stack">
              {[
                ["01", page.sourceTitle, page.sourceBody],
                ["02", page.safetyTitle, page.safetyBody],
                ["03", page.unknownTitle, page.unknownBody],
              ].map(([number, title, body]) => (
                <div key={number}><span className="proof-index">{number}</span><div><strong>{title}</strong><p>{body}</p></div></div>
              ))}
            </div>
          </aside>
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
            <h3>{category.name}</h3><p>{category.description}</p>
            <div className="brand-row" aria-label={page.manufacturersAria}>{manufacturers.map((manufacturer) => <span key={manufacturer.id}>{manufacturer.name}</span>)}</div>
          </div>
          <Link className="button-primary" href={paths.category(locale, category)}>{page.browseDishwashers}</Link>
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
