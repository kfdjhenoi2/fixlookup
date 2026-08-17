import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";
import type { DeviceCategory, Problem } from "@/lib/types";
import { SafetyBadge, VerificationBadge } from "./status-badge";

export function RelatedProblems({
  locale, category, problems, messages, verificationLabels, safetyLabels,
}: {
  locale: Locale;
  category: DeviceCategory;
  problems: Problem[];
  messages: Record<string, string>;
  verificationLabels: Record<string, string>;
  safetyLabels: Record<string, string>;
}) {
  if (!problems.length) return null;
  return (
    <section className="section-block" aria-labelledby="related-problems-heading">
      <div className="section-heading"><div>
        <span className="eyebrow">{messages.relatedEyebrow}</span>
        <h2 id="related-problems-heading">{messages.relatedProblems}</h2>
      </div></div>
      <div className="card-grid card-grid-two">
        {problems.map((problem) => (
          <Link className="content-card related-card" href={paths.problem(locale, category, problem)} key={problem.id}>
            <div className="card-badges">
              <VerificationBadge status={problem.verificationStatus} labels={verificationLabels} />
              <SafetyBadge level={problem.safetyLevel} labels={safetyLabels} />
            </div>
            <h3>{problem.title}</h3>
            <p>{problem.summary}</p>
            <span className="text-link">{messages.openProblem}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
