import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedProblems } from "@/components/related-problems";
import { SourceList } from "@/components/source-list";
import { SafetyBadge, VerificationBadge } from "@/components/status-badge";
import {
  getGuideById,
  getProblemById,
  getProblemBySlug,
  getRelatedProblems,
  getSourcesByIds,
  isProblemIndexable,
  problems,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

interface ProblemPageProps {
  params: Promise<{ problem: string }>;
}

export function generateStaticParams() {
  return problems.map((problem) => ({ problem: problem.slug }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { problem: slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return {};
  return createPageMetadata({
    title: problem.title,
    description: problem.summary,
    path: `/dishwashers/problems/${problem.slug}`,
    noIndex: !isProblemIndexable(problem),
  });
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { problem: slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) notFound();
  const guide = getGuideById(problem.guideId);
  const canonicalProblem = guide
    ? getProblemById(guide.canonicalProblemId)
    : undefined;
  const isCanonicalGuidePage = guide?.canonicalProblemId === problem.id;
  const sourceRecords = getSourcesByIds([
    ...new Set([
      ...problem.sourceIds,
      ...(guide?.sourceIds ?? []),
      ...(guide?.steps.flatMap((step) => step.sourceIds) ?? []),
    ]),
  ]);
  const related = getRelatedProblems(problem);

  return (
    <main className="page-main" id="main-content">
      <div className="site-shell article-width">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dishwashers", href: "/dishwashers" },
            { label: "Problems" },
            { label: problem.title },
          ]}
        />
        <header className="record-hero">
          <div className="card-badges">
            <VerificationBadge status={problem.verificationStatus} />
            <SafetyBadge level={problem.safetyLevel} />
          </div>
          <span className="eyebrow">Problem record</span>
          <h1>{problem.title}</h1>
          <p className="record-lead">{problem.summary}</p>
        </header>

        {problem.verificationStatus !== "verified" ? (
          <div className="notice notice-demo">
            <strong>This record is not ready for publication.</strong>
            <p>
              It contains no diagnosis or device-specific repair claim. Pending
              records are excluded from search indexing until sources are reviewed.
            </p>
          </div>
        ) : null}

        <section className="section-block" aria-labelledby="symptom-heading">
          <div className="section-heading section-heading-compact">
            <div>
              <span className="eyebrow">Recorded signals</span>
              <h2 id="symptom-heading">Symptom labels</h2>
            </div>
          </div>
          <div className="tag-list">
            {problem.symptomLabels.map((label) => <span key={label}>{label}</span>)}
          </div>
        </section>

        {guide && isCanonicalGuidePage ? (
          <section className="section-block" aria-labelledby="steps-heading">
            <div className="section-heading">
              <div>
                <span className="eyebrow">User-level workflow</span>
                <h2 id="steps-heading">{guide.title}</h2>
              </div>
              <span className="section-note">
                {guide.steps.length} {guide.verificationStatus === "verified" ? "steps" : "demo steps"}
              </span>
            </div>
            <ol className="step-list">
              {guide.steps.map((step, index) => (
                <li key={step.id}>
                  <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="step-title-row">
                      <h3>{step.title}</h3>
                      <SafetyBadge level={step.safetyLevel} />
                    </div>
                    <p>{step.instruction}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : guide && canonicalProblem ? (
          <section className="section-block" aria-labelledby="shared-guide-heading">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Shared troubleshooting guide</span>
                <h2 id="shared-guide-heading">Continue on the canonical guide</h2>
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
                  This workflow is maintained once to avoid conflicting or
                  duplicated troubleshooting instructions.
                </p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        ) : (
          <section className="empty-state empty-state-wide">
            <span className="empty-state-code">?</span>
            <div>
              <h2>No troubleshooting guide is published</h2>
              <p>
                This record remains a placeholder until a primary source and a
                safety review are attached.
              </p>
              <Link className="text-link" href="/dishwashers/troubleshooter">
                Use the information-gathering framework →
              </Link>
            </div>
          </section>
        )}

        <SourceList sources={sourceRecords} />
        <RelatedProblems problems={related} />
      </div>
    </main>
  );
}
