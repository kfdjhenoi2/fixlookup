import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { SafetyBadge, VerificationBadge } from "@/components/status-badge";
import {
  errorCodes,
  getErrorCodeBySlug,
  getGuideById,
  getManufacturerById,
  getManufacturerBySlug,
  getProblemById,
  getSourcesByIds,
  isErrorCodeIndexable,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

interface ErrorCodePageProps {
  params: Promise<{ manufacturer: string; code: string }>;
}

export function generateStaticParams() {
  return errorCodes.flatMap((errorCode) => {
    const manufacturer = getManufacturerById(errorCode.manufacturerId);
    return manufacturer
      ? [{ manufacturer: manufacturer.slug, code: errorCode.slug }]
      : [];
  });
}

export async function generateMetadata({ params }: ErrorCodePageProps): Promise<Metadata> {
  const values = await params;
  const manufacturer = getManufacturerBySlug(values.manufacturer);
  const errorCode = manufacturer
    ? getErrorCodeBySlug(manufacturer.id, values.code)
    : undefined;
  if (!manufacturer || !errorCode) return {};

  return createPageMetadata({
    title: `${manufacturer.name} ${errorCode.code}${errorCode.isFictional ? " demo error code" : " error code"}`,
    description: errorCode.summary,
    path: `/dishwashers/${manufacturer.slug}/error-codes/${errorCode.slug}`,
    noIndex: !isErrorCodeIndexable(errorCode),
  });
}

export default async function ErrorCodePage({ params }: ErrorCodePageProps) {
  const values = await params;
  const manufacturer = getManufacturerBySlug(values.manufacturer);
  if (!manufacturer) notFound();
  const errorCode = getErrorCodeBySlug(manufacturer.id, values.code);
  if (!errorCode) notFound();
  const guide = getGuideById(errorCode.guideId);
  const canonicalProblem = guide
    ? getProblemById(guide.canonicalProblemId)
    : undefined;
  const sourceRecords = getSourcesByIds(errorCode.sourceIds);

  return (
    <main className="page-main" id="main-content">
      <div className="site-shell article-width">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dishwashers", href: "/dishwashers" },
            { label: manufacturer.name, href: `/dishwashers/${manufacturer.slug}` },
            { label: "Error codes" },
            { label: errorCode.code },
          ]}
        />
        <header className="error-hero">
          <div className="error-code-block">
            <span>Displayed code</span>
            <code>{errorCode.code}</code>
          </div>
          <div className="error-hero-copy">
            <div className="card-badges">
              <VerificationBadge status={errorCode.verificationStatus} />
              {errorCode.isFictional ? (
                <span className="badge badge-fictional">Fictional code</span>
              ) : null}
            </div>
            <span className="eyebrow">Error-code page template</span>
            <h1>{manufacturer.name} {errorCode.title}</h1>
            <p>{errorCode.summary}</p>
          </div>
        </header>

        {errorCode.isFictional ? (
          <div className="notice notice-warning">
            <strong>This code has no real appliance meaning.</strong>
            <p>
              Never use {errorCode.code} to diagnose a device. A real code page will
              remain unpublished until its meaning, applicability, and guidance
              have authoritative sources.
            </p>
          </div>
        ) : null}

        {guide && canonicalProblem ? (
          <section className="section-block" aria-labelledby="error-guide-heading">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Shared troubleshooting guide</span>
                <h2 id="error-guide-heading">Continue on the problem guide</h2>
              </div>
              <SafetyBadge level={guide.safetyLevel} />
            </div>
            <Link
              className="guide-summary"
              href={`/dishwashers/problems/${canonicalProblem.slug}`}
            >
              <div>
                <h3>{guide.title}</h3>
                <p>
                  The complete workflow is maintained once on its canonical
                  problem page to prevent conflicting duplicate guidance.
                </p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        ) : null}

        <SourceList sources={sourceRecords} />

        <div className="bottom-navigation">
          <Link href={`/dishwashers/${manufacturer.slug}`}>← Back to {manufacturer.name}</Link>
          <Link href="/dishwashers/troubleshooter">Open troubleshooter →</Link>
        </div>
      </div>
    </main>
  );
}
