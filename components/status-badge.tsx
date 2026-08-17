import type { SafetyLevel, VerificationStatus } from "@/lib/types";

export function VerificationBadge({
  status,
  labels,
}: {
  status: VerificationStatus;
  labels: Record<string, string>;
}) {
  return <span className={`badge badge-${status}`}>{labels[status]}</span>;
}

export function SafetyBadge({
  level,
  labels,
}: {
  level: SafetyLevel;
  labels: Record<string, string>;
}) {
  return <span className={`badge safety-${level}`}>{labels[level]}</span>;
}
