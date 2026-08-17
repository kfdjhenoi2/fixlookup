import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { VerificationBadge } from "@/components/status-badge";
import {
  errorCodes,
  getManufacturerBySlug,
  isErrorCodeIndexable,
  isModelIndexable,
  manufacturerHasIndexableContent,
  manufacturers,
  models,
  problems,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

interface ManufacturerPageProps {
  params: Promise<{ manufacturer: string }>;
}

export function generateStaticParams() {
  return manufacturers.map((manufacturer) => ({
    manufacturer: manufacturer.slug,
  }));
}

export async function generateMetadata({ params }: ManufacturerPageProps): Promise<Metadata> {
  const { manufacturer: slug } = await params;
  const manufacturer = getManufacturerBySlug(slug);
  if (!manufacturer) return {};

  return createPageMetadata({
    title: `${manufacturer.name} dishwasher troubleshooting`,
    description: `Browse source-reviewed ${manufacturer.name} dishwasher error-code records and shared troubleshooting guides.`,
    path: `/dishwashers/${manufacturer.slug}`,
    noIndex: !manufacturerHasIndexableContent(manufacturer.id),
  });
}

export default async function ManufacturerPage({ params }: ManufacturerPageProps) {
  const { manufacturer: slug } = await params;
  const manufacturer = getManufacturerBySlug(slug);
  if (!manufacturer) notFound();
  const hasIndexableContent = manufacturerHasIndexableContent(manufacturer.id);

  const manufacturerModels = models.filter((model) =>
    model.manufacturerId === manufacturer.id &&
    (!hasIndexableContent || isModelIndexable(model)),
  );
  const manufacturerCodes = errorCodes.filter(
    (errorCode) =>
      errorCode.manufacturerId === manufacturer.id &&
      (!hasIndexableContent || isErrorCodeIndexable(errorCode)),
  );

  return (
    <main className="page-main" id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${manufacturer.name} dishwasher troubleshooting`,
          url: absoluteUrl(`/dishwashers/${manufacturer.slug}`),
          description: manufacturer.overview,
        }}
      />
      <div className="site-shell">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dishwashers", href: "/dishwashers" },
            { label: manufacturer.name },
          ]}
        />
        <header className="page-hero manufacturer-hero">
          <div>
            <span className="eyebrow">Manufacturer index</span>
            <h1>{manufacturer.name} dishwashers</h1>
            <p>{manufacturer.overview}</p>
          </div>
          <div className="manufacturer-monogram" aria-hidden="true">
            {manufacturer.name.slice(0, 2).toUpperCase()}
          </div>
        </header>

        <div className="content-layout">
          <div>
            <section className="section-block section-block-first" aria-labelledby="models-heading">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Model index</span>
                  <h2 id="models-heading">Models</h2>
                </div>
                <span className="section-note">Exact identifiers only</span>
              </div>
              {manufacturerModels.length ? (
                <div className="record-list">
                  {manufacturerModels.map((model) => (
                    <Link
                      href={`/dishwashers/${manufacturer.slug}/models/${model.slug}`}
                      key={model.id}
                    >
                      <div>
                        <VerificationBadge status={model.verificationStatus} />
                        <h3>{model.name}</h3>
                        <p>
                          {model.modelNumber}
                          {model.isFictional ? " · Fictional template record" : ""}
                        </p>
                      </div>
                      <span className="record-arrow" aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-state-code">00</span>
                  <div>
                    <h3>No verified models published yet</h3>
                    <p>
                      Model records will appear only after their exact identifiers
                      and source relationships are reviewed.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="section-block" aria-labelledby="codes-heading">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Error-code index</span>
                  <h2 id="codes-heading">Error codes</h2>
                </div>
              </div>
              {manufacturerCodes.length ? (
                <div className="code-grid">
                  {manufacturerCodes.map((errorCode) => (
                    <Link
                      href={`/dishwashers/${manufacturer.slug}/error-codes/${errorCode.slug}`}
                      key={errorCode.id}
                    >
                      <code>
                        {errorCode.code}
                        {errorCode.aliases[0] ? ` / ${errorCode.aliases[0]}` : ""}
                      </code>
                      <div>
                        <strong>{errorCode.title}</strong>
                        <span>
                          {errorCode.isFictional
                            ? "Fictional template record"
                            : "Source-reviewed record"}
                        </span>
                      </div>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="inline-empty">
                  No error-code claims are published for this manufacturer yet.
                </div>
              )}
            </section>
          </div>

          <aside className="content-rail">
            <div className="rail-card">
              <span className="eyebrow">Before you search</span>
              <h2>Capture the exact label</h2>
              <p>
                Model families can share names while using different guidance.
                The database keys records to exact identifiers and sources.
              </p>
              <Link className="text-link" href="/dishwashers/troubleshooter">
                Use the troubleshooting framework →
              </Link>
            </div>
            <div className="rail-card rail-card-muted">
              <span className="eyebrow">Shared problem guides</span>
              {problems.slice(0, 5).map((problem) => (
                <Link href={`/dishwashers/problems/${problem.slug}`} key={problem.id}>
                  {problem.title}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
