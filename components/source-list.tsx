import type { SourceReference } from "@/lib/types";
import { VerificationBadge } from "./status-badge";

const sourceTypeLabels: Record<SourceReference["type"], string> = {
  "manufacturer-manual": "Manufacturer manual",
  "manufacturer-support": "Manufacturer support",
  "official-service-document": "Official service document",
  "reputable-technical": "Technical source",
  "editorial-placeholder": "Source placeholder",
};

export function ClaimSources({
  sourceIds,
  sources,
  label = "Sources",
}: {
  sourceIds: string[];
  sources: SourceReference[];
  label?: string;
}) {
  const linkedSources = [...new Set(sourceIds)]
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is SourceReference => Boolean(source));

  if (!linkedSources.length) return null;

  return (
    <p className="claim-sources">
      <span>{label}:</span>{" "}
      {linkedSources.map((source, index) => {
        const sourceNumber = sources.findIndex(
          (candidate) => candidate.id === source.id,
        ) + 1;
        return (
          <span key={source.id}>
            {index ? " " : null}
            <a
              href={`#source-${source.id}`}
              aria-label={`${source.title}, source ${sourceNumber}`}
            >
              [{sourceNumber}]
            </a>
          </span>
        );
      })}
    </p>
  );
}

export function SourceList({ sources }: { sources: SourceReference[] }) {
  return (
    <section className="source-panel" aria-labelledby="sources-heading">
      <div className="section-heading section-heading-compact">
        <div>
          <span className="eyebrow">Traceability</span>
          <h2 id="sources-heading">Sources &amp; references</h2>
        </div>
        <span className="source-count">
          {sources.length} {sources.length === 1 ? "record" : "records"}
        </span>
      </div>
      <div className="source-list">
        {sources.length ? sources.map((source) => (
          <article
            className="source-item"
            id={`source-${source.id}`}
            key={source.id}
          >
            <div>
              <span className="source-type">{sourceTypeLabels[source.type]}</span>
              <h3>
                {source.url ? (
                  <a href={source.url} rel="noreferrer" target="_blank">
                    {source.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  source.title
                )}
              </h3>
              <p>
                {source.publisher}
                {source.publishedAt ? (
                  <>
                    {" · Published "}
                    <time dateTime={source.publishedAt}>{source.publishedAt}</time>
                  </>
                ) : null}
                {source.accessedAt ? (
                  <>
                    {" · Accessed "}
                    <time dateTime={source.accessedAt}>{source.accessedAt}</time>
                  </>
                ) : null}
              </p>
              {source.note ? <p className="source-note">{source.note}</p> : null}
            </div>
            <VerificationBadge status={source.verificationStatus} />
          </article>
        )) : (
          <div className="source-empty">
            No source is attached. This record is not eligible for publication.
          </div>
        )}
      </div>
    </section>
  );
}
