"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { SearchItem } from "@/lib/types";

export function SearchBox({
  items,
  compact = false,
}: {
  items: SearchItem[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputId = useId();
  const resultsId = useId();
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return items
      .map((item) => {
        const haystack = [
          item.label,
          item.description,
          item.type,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase();
        const startsWithLabel = item.label.toLowerCase().startsWith(normalizedQuery);
        return { item, rank: startsWithLabel ? 0 : haystack.includes(normalizedQuery) ? 1 : 2 };
      })
      .filter(({ rank }) => rank < 2)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 6)
      .map(({ item }) => item);
  }, [items, normalizedQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (results[0]) router.push(results[0].href);
  }

  return (
    <div className={`search-module ${compact ? "search-module-compact" : ""}`}>
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <span className="search-symbol" aria-hidden="true" />
        <label className="sr-only" htmlFor={inputId}>
          Search for a device, model, problem, or error code
        </label>
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          placeholder="Try a brand, model, symptom, or code"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-controls={normalizedQuery ? resultsId : undefined}
        />
        <button type="submit" disabled={!results.length}>
          Search
        </button>
      </form>

      {normalizedQuery ? (
        <div className="search-results" id={resultsId}>
          <p className="sr-only" aria-live="polite">
            {results.length
              ? `${results.length} search ${results.length === 1 ? "result" : "results"}`
              : "No reviewed search results"}
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
                      {result.isDemo ? "Demo · " : ""}
                      {result.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-search">
              <strong>No reviewed match yet</strong>
              <span>Try a manufacturer name, a symptom such as “not draining,” or a code such as “E15.”</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
