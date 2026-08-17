import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { SafetyBadge, VerificationBadge } from "@/components/status-badge";
import {
  getGuideById,
  getManufacturerBySlug,
  getModelBySlug,
  getProblemById,
  getSourcesByIds,
  isModelIndexable,
  manufacturers,
  models,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

interface ModelPageProps {
  params: Promise<{ manufacturer: string; model: string }>;
}

export function generateStaticParams() {
  return models.flatMap((model) => {
    const manufacturer = manufacturers.find(
      (candidate) => candidate.id === model.manufacturerId,
    );
    return manufacturer
      ? [{ manufacturer: manufacturer.slug, model: model.slug }]
      : [];
  });
}

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const values = await params;
  const manufacturer = getManufacturerBySlug(values.manufacturer);
  const model = manufacturer ? getModelBySlug(manufacturer.id, values.model) : undefined;
  if (!manufacturer || !model) return {};

  return createPageMetadata({
    title: model.isFictional ? `${model.name} demo model record` : model.name,
    description: model.note,
    path: `/dishwashers/${manufacturer.slug}/models/${model.slug}`,
    noIndex: !isModelIndexable(model),
  });
}

export default async function ModelPage({ params }: ModelPageProps) {
  const values = await params;
  const manufacturer = getManufacturerBySlug(values.manufacturer);
  if (!manufacturer) notFound();
  const model = getModelBySlug(manufacturer.id, values.model);
  if (!model) notFound();
  const guide = getGuideById(model.guideIds[0]);
  const canonicalProblem = guide
    ? getProblemById(guide.canonicalProblemId)
    : undefined;
  const sourceRecords = getSourcesByIds(model.sourceIds);

  return (
    <main className="page-main" id="main-content">
      <div className="site-shell article-width">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dishwashers", href: "/dishwashers" },
            { label: manufacturer.name, href: `/dishwashers/${manufacturer.slug}` },
            { label: model.name },
          ]}
        />
        <header className="record-hero">
          <div className="card-badges">
            <VerificationBadge status={model.verificationStatus} />
            {model.isFictional ? (
              <span className="badge badge-fictional">Fictional model</span>
            ) : null}
          </div>
          <span className="eyebrow">Model page template</span>
          <h1>{model.name}</h1>
          <p className="record-lead">{model.note}</p>
        </header>

        <section className="fact-grid" aria-label="Model record details">
          <div>
            <span>Manufacturer</span>
            <strong>{manufacturer.name}</strong>
          </div>
          <div>
            <span>Model identifier</span>
            <strong>{model.modelNumber}</strong>
          </div>
          <div>
            <span>Content status</span>
            <strong>
              {model.verificationStatus === "verified"
                ? "Source reviewed"
                : "Not ready for publication"}
            </strong>
          </div>
        </section>

        {model.isFictional ? (
          <div className="notice notice-demo">
            <strong>Do not use this record for appliance decisions.</strong>
            <p>
              The model and identifier are intentionally fictional. This page
              demonstrates how verified model relationships will be presented.
            </p>
          </div>
        ) : null}

        <section className="section-block" aria-labelledby="model-guides-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Shared guidance</span>
              <h2 id="model-guides-heading">Linked troubleshooting guide</h2>
            </div>
          </div>
          {guide && canonicalProblem ? (
            <Link
              className="guide-summary"
              href={`/dishwashers/problems/${canonicalProblem.slug}`}
            >
              <div>
                <div className="card-badges">
                  <VerificationBadge status={guide.verificationStatus} />
                  <SafetyBadge level={guide.safetyLevel} />
                </div>
                <h3>{guide.title}</h3>
                <p>
                  One shared guide can serve multiple compatible records after
                  those relationships are verified.
                </p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </section>
        <SourceList sources={sourceRecords} />
      </div>
    </main>
  );
}
