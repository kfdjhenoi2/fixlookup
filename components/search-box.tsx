"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import { searchKnowledgeItems } from "@/lib/search.mjs";
import type { SearchItem } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

export function SearchBox({
  items,
  locale,
  messages,
  typeLabels,
  compact = false,
  anchorId,
}: {
  items: SearchItem[];
  locale: Locale;
  messages: Record<string, string>;
  typeLabels: Record<SearchItem["type"], string>;
  compact?: boolean;
  anchorId?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputId = useId();
  const resultsId = useId();
  const lastZeroResultQuery = useRef("");
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchKnowledgeItems(items, normalizedQuery, typeLabels, 10, locale);
  }, [items, locale, normalizedQuery, typeLabels]);

  useEffect(() => {
    if (normalizedQuery.length < 2 || results.length) return;
    const timer = window.setTimeout(() => {
      if (lastZeroResultQuery.current === normalizedQuery) return;
      lastZeroResultQuery.current = normalizedQuery;
      trackAnalyticsEvent("zero_result_search", {
        locale,
        query_length: normalizedQuery.length,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [locale, normalizedQuery, results.length]);

  function trackSearch(interaction: "submit" | "result_click", result?: SearchItem) {
    trackAnalyticsEvent("search_performed", {
      interaction,
      locale,
      query_length: normalizedQuery.length,
      result_count: results.length,
      result_type: result?.type,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) {
      trackSearch("submit", results[0]);
      router.push(results[0].href);
    }
  }

  return (
    <div className={`search-module ${compact ? "search-module-compact" : ""}`} id={anchorId}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <span className="search-symbol" aria-hidden="true" />
        <label className="sr-only" htmlFor={inputId}>{messages.searchLabel}</label>
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          placeholder={messages.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-controls={normalizedQuery ? resultsId : undefined}
        />
        <button type="submit" disabled={!results.length}>{messages.searchButton}</button>
      </form>
      {normalizedQuery ? (
        <div className="search-results" id={resultsId}>
          <p className="sr-only" aria-live="polite">
            {results.length ? `${results.length} ${results.length === 1 ? messages.searchResult : messages.searchResults}` : messages.noSearchResults}
          </p>
          {results.length ? (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <Link href={result.href} onClick={() => trackSearch("result_click", result)}>
                    <span className="result-copy">
                      <strong>{result.label}</strong>
                      <small>{result.description}</small>
                    </span>
                    <span className="result-type">
                      {typeLabels[result.type]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-search">
              <strong>{messages.noSearchMatch}</strong>
              <span>{messages.searchSuggestion}</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
