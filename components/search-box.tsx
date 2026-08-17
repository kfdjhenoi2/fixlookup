"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";
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
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return items
      .map((item) => {
        const haystack = [item.label, item.description, typeLabels[item.type], ...item.keywords]
          .join(" ")
          .toLocaleLowerCase(locale);
        const startsWithLabel = item.label.toLocaleLowerCase(locale).startsWith(normalizedQuery);
        return { item, rank: startsWithLabel ? 0 : haystack.includes(normalizedQuery) ? 1 : 2 };
      })
      .filter(({ rank }) => rank < 2)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 6)
      .map(({ item }) => item);
  }, [items, locale, normalizedQuery, typeLabels]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) router.push(results[0].href);
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
                  <Link href={result.href}>
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
