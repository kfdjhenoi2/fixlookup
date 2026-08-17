import type { SearchItem } from "./types";

export function compactSearchValue(value: string, locale?: string): string;
export function searchRank(item: SearchItem, query: string, typeLabel?: string, locale?: string): number | null;
export function searchKnowledgeItems(
  items: SearchItem[],
  query: string,
  typeLabels?: Partial<Record<SearchItem["type"], string>>,
  limit?: number,
  locale?: string,
): SearchItem[];
