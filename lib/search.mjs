function words(value, locale = "en") {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase(locale)
    .match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function compactSearchValue(value, locale = "en") {
  return words(value, locale).join("");
}

function valuesToForms(values, locale) {
  return [...new Set(values.flatMap((value) => {
    const tokens = words(value, locale);
    return [tokens.join(""), ...tokens];
  }).filter(Boolean))];
}

function canCover(queryWords, forms) {
  const reachable = new Array(queryWords.length + 1).fill(false);
  reachable[0] = true;
  for (let start = 0; start < queryWords.length; start += 1) {
    if (!reachable[start]) continue;
    let phrase = "";
    for (let end = start; end < queryWords.length; end += 1) {
      phrase += queryWords[end];
      if (forms.some((form) => form === phrase || (phrase.length >= 2 && form.startsWith(phrase)))) {
        reachable[end + 1] = true;
      }
    }
  }
  return reachable[queryWords.length];
}

export function searchRank(item, query, typeLabel = "", locale = "en") {
  const queryWords = words(query, locale);
  if (!queryWords.length) return null;
  const compactQuery = queryWords.join("");
  const identifiers = valuesToForms(item.identifiers, locale);
  const aliases = valuesToForms(item.aliases, locale);
  const applicability = valuesToForms(item.applicabilityIdentifiers, locale);
  const manufacturer = item.manufacturer ? compactSearchValue(item.manufacturer, locale) : "";

  const mentionsIdentifier = [...identifiers, ...aliases].some((form) =>
    form.length <= 2 ? queryWords.includes(form) : compactQuery.includes(form),
  );
  const mentionsApplicability = applicability.some((form) =>
    form.length <= 2 ? queryWords.includes(form) : compactQuery.includes(form),
  );
  if (mentionsIdentifier && mentionsApplicability) {
    const hasVerifiedCombination = (item.verifiedApplicabilityCombinations ?? []).some((combination) => {
      const combinationWords = words(combination, locale);
      return combinationWords.length > 1 && combinationWords.every((word) => queryWords.includes(word));
    });
    if (!hasVerifiedCombination) return null;
    return 2;
  }

  if (identifiers.includes(compactQuery)) return 0;
  if (aliases.includes(compactQuery)) return 1;
  if (applicability.includes(compactQuery)) return 2;

  if (manufacturer && compactQuery.startsWith(manufacturer)) {
    const remainder = compactQuery.slice(manufacturer.length);
    if (remainder && (identifiers.includes(remainder) || aliases.includes(remainder))) return 2;
  }

  const identityForms = [manufacturer, ...identifiers, ...aliases, ...applicability].filter(Boolean);
  const titleForms = valuesToForms([item.label, ...item.titleTerms, ...item.aliases, typeLabel], locale);
  const descriptionForms = valuesToForms([item.description, ...item.descriptionTerms], locale);

  if (canCover(queryWords, [...identityForms, ...titleForms])) return 3;
  if (canCover(queryWords, [...identityForms, ...titleForms, ...descriptionForms])) return 4;
  return null;
}

export function searchKnowledgeItems(items, query, typeLabels = {}, limit = 10, locale = "en") {
  return items
    .map((item, index) => ({ item, index, rank: searchRank(item, query, typeLabels[item.type] ?? "", locale) }))
    .filter((result) => result.rank !== null)
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .slice(0, limit)
    .map((result) => result.item);
}
