const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string | null | undefined): value is string {
  if (!value || !ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
}

export function reviewDueDate(lastReviewed: string, reviewIntervalDays: number) {
  const date = new Date(`${lastReviewed}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + reviewIntervalDays);
  return date.toISOString().slice(0, 10);
}

export function latestReviewDate(values: Array<string | null | undefined>) {
  return values.filter(isIsoDate).sort().at(-1);
}
