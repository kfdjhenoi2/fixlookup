import Link from "next/link";
import type { Problem } from "@/lib/types";
import { SafetyBadge, VerificationBadge } from "./status-badge";

export function RelatedProblems({ problems }: { problems: Problem[] }) {
  if (!problems.length) return null;

  return (
    <section className="section-block" aria-labelledby="related-problems-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Keep exploring</span>
          <h2 id="related-problems-heading">Related problems</h2>
        </div>
      </div>
      <div className="card-grid card-grid-two">
        {problems.map((problem) => (
          <Link
            className="content-card related-card"
            href={`/dishwashers/problems/${problem.slug}`}
            key={problem.id}
          >
            <div className="card-badges">
              <VerificationBadge status={problem.verificationStatus} />
              <SafetyBadge level={problem.safetyLevel} />
            </div>
            <h3>{problem.title}</h3>
            <p>{problem.summary}</p>
            <span className="text-link">Open problem record →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
