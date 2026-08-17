import type { SourceReference } from "@/lib/types";
import { reviewDueDate } from "@/lib/review";
import { VerificationBadge } from "./status-badge";

export function ClaimSources({
  sourceIds,
  sources,
  messages,
}: {
  sourceIds: string[];
  sources: SourceReference[];
  messages: Record<string, string>;
}) {
  const linkedSources = [...new Set(sourceIds)]
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is SourceReference => Boolean(source));
  if (!linkedSources.length) return null;
  return (
    <p className="claim-sources">
      <span>{messages.sources}:</span>{" "}
      {linkedSources.map((source, index) => {
        const sourceNumber = sources.findIndex((candidate) => candidate.id === source.id) + 1;
        return (
          <span key={source.id}>
            {index ? " " : null}
            <a href={`#source-${source.id}`} aria-label={`${source.title}, ${messages.sourceRecord} ${sourceNumber}`}>
              [{sourceNumber}]
            </a>
          </span>
        );
      })}
    </p>
  );
}

export function SourceList({
  sources,
  messages,
  sourceTypeLabels,
  verificationLabels,
}: {
  sources: SourceReference[];
  messages: Record<string, string>;
  sourceTypeLabels: Record<string, string>;
  verificationLabels: Record<string, string>;
}) {
  return (
    <section className="source-panel" aria-labelledby="sources-heading">
      <div className="section-heading section-heading-compact">
        <div>
          <span className="eyebrow">{messages.traceability}</span>
          <h2 id="sources-heading">{messages.sourcesReferences}</h2>
        </div>
        <span className="source-count">
          {sources.length} {sources.length === 1 ? messages.sourceRecord : messages.sourceRecords}
        </span>
      </div>
      <div className="source-list">
        {sources.length ? sources.map((source) => (
          <article className="source-item" id={`source-${source.id}`} key={source.id}>
            <div>
              <span className="source-type">{sourceTypeLabels[source.type]}</span>
              <h3>
                {source.url ? (
                  <a href={source.url} rel="noreferrer" target="_blank">
                    {source.title}<span className="sr-only"> ({messages.opensNewTab})</span>
                  </a>
                ) : source.title}
              </h3>
              <p>
                {source.publisher}
                {source.publishedAt ? <>{" · "}{messages.published} <time dateTime={source.publishedAt}>{source.publishedAt}</time></> : null}
                {source.accessedAt ? <>{" · "}{messages.accessed} <time dateTime={source.accessedAt}>{source.accessedAt}</time></> : null}
              </p>
              {source.lastReviewed && source.reviewIntervalDays ? (
                <p>
                  {messages.lastReviewed} <time dateTime={source.lastReviewed}>{source.lastReviewed}</time>
                  {" · "}{messages.reviewDue} <time dateTime={reviewDueDate(source.lastReviewed, source.reviewIntervalDays)}>{reviewDueDate(source.lastReviewed, source.reviewIntervalDays)}</time>
                </p>
              ) : null}
              {source.note ? <p className="source-note">{source.note}</p> : null}
            </div>
            <VerificationBadge status={source.verificationStatus} labels={verificationLabels} />
          </article>
        )) : <div className="source-empty">{messages.noSource}</div>}
      </div>
    </section>
  );
}
