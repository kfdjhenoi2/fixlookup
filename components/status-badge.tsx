import type { SafetyLevel, VerificationStatus } from "@/lib/types";

const verificationLabels: Record<VerificationStatus, string> = {
  demo: "Demo record",
  "needs-review": "Source review needed",
  verified: "Source verified",
};

const safetyLabels: Record<SafetyLevel, string> = {
  "user-safe": "User-level",
  caution: "Use caution",
  "professional-only": "Professional help",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return (
    <span className={`badge badge-${status}`}>{verificationLabels[status]}</span>
  );
}

export function SafetyBadge({ level }: { level: SafetyLevel }) {
  return <span className={`badge safety-${level}`}>{safetyLabels[level]}</span>;
}
