import type {
  EvidenceClaimKnowledge,
  ProblemKnowledge,
  SafetyLevel,
  TroubleshootingGuideKnowledge,
} from "../../types";
import {
  dishwasherCategoryId,
  existingReviewIntervalDays,
  mutableHtmlReviewIntervalDays,
  reviewedOn,
} from "./constants";

interface StepDefinition {
  id: string;
  sourceIds: string[];
  safetyLevel: SafetyLevel;
}

interface GuideDefinition {
  id: string;
  canonicalProblemId: string;
  problemIds: string[];
  safetyLevel: SafetyLevel;
  reviewIntervalDays?: number;
  steps: StepDefinition[];
}

const problemDefinitions: Array<{ id: string; safetyLevel: SafetyLevel }> = [
  { id: "problem-dishwasher-not-draining", safetyLevel: "caution" },
  { id: "problem-dishwasher-not-filling", safetyLevel: "caution" },
  { id: "problem-dishwasher-leaking", safetyLevel: "caution" },
  { id: "problem-dishwasher-not-starting", safetyLevel: "caution" },
  { id: "problem-dishwasher-not-cleaning", safetyLevel: "user-safe" },
  { id: "problem-dishwasher-not-drying", safetyLevel: "user-safe" },
  { id: "problem-white-residue", safetyLevel: "user-safe" },
  { id: "problem-dishwasher-tablet-not-dissolving", safetyLevel: "user-safe" },
  { id: "problem-dishwasher-unusual-noise", safetyLevel: "caution" },
  { id: "problem-dishwasher-door-not-closing", safetyLevel: "caution" },
  { id: "problem-dishwasher-no-power", safetyLevel: "caution" },
  { id: "problem-dishwasher-not-heating", safetyLevel: "caution" },
  { id: "problem-dishwasher-excessive-foam", safetyLevel: "caution" },
  { id: "problem-dishwasher-smells", safetyLevel: "caution" },
];

// Store each editorial relationship once. The reciprocal problem links used by
// the UI are derived below, avoiding mirrored arrays that can drift apart.
const relatedProblemPairs: Array<[string, string]> = [
  ["problem-dishwasher-not-draining", "problem-dishwasher-not-filling"],
  ["problem-dishwasher-not-draining", "problem-dishwasher-leaking"],
  ["problem-dishwasher-not-draining", "problem-dishwasher-not-starting"],
  ["problem-dishwasher-not-filling", "problem-dishwasher-not-starting"],
  ["problem-dishwasher-not-filling", "problem-dishwasher-leaking"],
  ["problem-dishwasher-leaking", "problem-dishwasher-not-starting"],
  ["problem-dishwasher-not-cleaning", "problem-white-residue"],
  ["problem-dishwasher-not-cleaning", "problem-dishwasher-tablet-not-dissolving"],
  ["problem-dishwasher-not-cleaning", "problem-dishwasher-not-drying"],
  ["problem-dishwasher-not-drying", "problem-white-residue"],
  ["problem-dishwasher-not-drying", "problem-dishwasher-tablet-not-dissolving"],
  ["problem-white-residue", "problem-dishwasher-tablet-not-dissolving"],
  ["problem-dishwasher-unusual-noise", "problem-dishwasher-not-draining"],
  ["problem-dishwasher-unusual-noise", "problem-dishwasher-not-cleaning"],
  ["problem-dishwasher-door-not-closing", "problem-dishwasher-not-starting"],
  ["problem-dishwasher-door-not-closing", "problem-dishwasher-no-power"],
  ["problem-dishwasher-no-power", "problem-dishwasher-not-starting"],
  ["problem-dishwasher-not-heating", "problem-dishwasher-not-drying"],
  ["problem-dishwasher-not-heating", "problem-dishwasher-not-cleaning"],
  ["problem-dishwasher-excessive-foam", "problem-dishwasher-leaking"],
  ["problem-dishwasher-excessive-foam", "problem-dishwasher-tablet-not-dissolving"],
  ["problem-dishwasher-smells", "problem-dishwasher-not-draining"],
  ["problem-dishwasher-smells", "problem-dishwasher-not-cleaning"],
];

export const problemKnowledge: ProblemKnowledge[] = problemDefinitions.map((problem) => ({
  ...problem,
  categoryId: dishwasherCategoryId,
  relatedProblemIds: relatedProblemPairs.flatMap(([left, right]) =>
    left === problem.id ? [right] : right === problem.id ? [left] : [],
  ),
  verificationStatus: "verified",
}));

const guideDefinitions: GuideDefinition[] = [
  {
    id: "guide-dishwasher-not-draining",
    canonicalProblemId: "problem-dishwasher-not-draining",
    problemIds: ["problem-dishwasher-not-draining"],
    safetyLevel: "caution",
    steps: [
      { id: "drain-stop-for-hazards", sourceIds: ["source-whirlpool-not-draining"], safetyLevel: "caution" },
      { id: "drain-clean-filter", sourceIds: ["source-bosch-not-draining", "source-electrolux-drain-i20", "source-whirlpool-not-draining"], safetyLevel: "caution" },
      { id: "drain-check-visible-route", sourceIds: ["source-bosch-e24", "source-electrolux-drain-i20", "source-whirlpool-not-draining"], safetyLevel: "caution" },
      { id: "drain-escalate", sourceIds: ["source-bosch-not-draining", "source-electrolux-drain-i20", "source-whirlpool-not-draining", "source-samsung-water-codes"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-not-filling",
    canonicalProblemId: "problem-dishwasher-not-filling",
    problemIds: ["problem-dishwasher-not-filling"],
    safetyLevel: "caution",
    steps: [
      { id: "fill-check-tap", sourceIds: ["source-electrolux-inlet-i10", "source-whirlpool-not-filling"], safetyLevel: "user-safe" },
      { id: "fill-check-visible-hose", sourceIds: ["source-electrolux-inlet-i10", "source-samsung-water-codes"], safetyLevel: "caution" },
      { id: "fill-check-door", sourceIds: ["source-whirlpool-not-filling"], safetyLevel: "user-safe" },
      { id: "fill-escalate", sourceIds: ["source-electrolux-inlet-i10", "source-whirlpool-not-filling", "source-samsung-water-codes"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-leaking",
    canonicalProblemId: "problem-dishwasher-leaking",
    problemIds: ["problem-dishwasher-leaking"],
    safetyLevel: "caution",
    steps: [
      { id: "leak-stop-water", sourceIds: ["source-bosch-e15", "source-siemens-error-codes", "source-electrolux-i30", "source-whirlpool-f8e4"], safetyLevel: "caution" },
      { id: "leak-check-suds", sourceIds: ["source-whirlpool-f8e4", "source-samsung-water-codes"], safetyLevel: "user-safe" },
      { id: "leak-check-accessible-causes", sourceIds: ["source-electrolux-leaking", "source-electrolux-i30"], safetyLevel: "caution" },
      { id: "leak-escalate", sourceIds: ["source-bosch-e15", "source-siemens-error-codes", "source-electrolux-i30", "source-whirlpool-f8e4", "source-samsung-water-codes"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-not-starting",
    canonicalProblemId: "problem-dishwasher-not-starting",
    problemIds: ["problem-dishwasher-not-starting"],
    safetyLevel: "caution",
    steps: [
      { id: "start-record-state", sourceIds: ["source-bosch-troubleshooting"], safetyLevel: "caution" },
      { id: "start-check-door", sourceIds: ["source-bosch-troubleshooting", "source-electrolux-not-starting", "source-whirlpool-not-starting"], safetyLevel: "user-safe" },
      { id: "start-check-controls", sourceIds: ["source-electrolux-not-starting", "source-whirlpool-not-starting"], safetyLevel: "user-safe" },
      { id: "start-model-reset", sourceIds: ["source-electrolux-not-starting", "source-whirlpool-not-starting"], safetyLevel: "caution" },
    ],
  },
  {
    id: "guide-dishwasher-not-cleaning",
    canonicalProblemId: "problem-dishwasher-not-cleaning",
    problemIds: ["problem-dishwasher-not-cleaning"],
    safetyLevel: "user-safe",
    steps: [
      { id: "clean-check-loading", sourceIds: ["source-bosch-not-cleaning", "source-whirlpool-not-cleaning"], safetyLevel: "user-safe" },
      { id: "clean-filter-arms", sourceIds: ["source-bosch-not-cleaning", "source-electrolux-not-cleaning", "source-whirlpool-not-cleaning"], safetyLevel: "caution" },
      { id: "clean-program-detergent", sourceIds: ["source-electrolux-not-cleaning", "source-whirlpool-not-cleaning"], safetyLevel: "user-safe" },
      { id: "clean-escalate", sourceIds: ["source-bosch-not-cleaning", "source-electrolux-not-cleaning", "source-whirlpool-not-cleaning"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-not-drying",
    canonicalProblemId: "problem-dishwasher-not-drying",
    problemIds: ["problem-dishwasher-not-drying"],
    safetyLevel: "user-safe",
    steps: [
      { id: "dry-check-cycle", sourceIds: ["source-bosch-wet-dishes", "source-electrolux-not-drying", "source-whirlpool-not-drying"], safetyLevel: "user-safe" },
      { id: "dry-check-rinse-aid", sourceIds: ["source-bosch-wet-dishes", "source-electrolux-not-drying", "source-whirlpool-not-drying"], safetyLevel: "user-safe" },
      { id: "dry-check-loading", sourceIds: ["source-bosch-wet-dishes", "source-electrolux-not-drying", "source-whirlpool-not-drying"], safetyLevel: "user-safe" },
      { id: "dry-escalate", sourceIds: ["source-bosch-wet-dishes", "source-electrolux-not-drying", "source-whirlpool-not-drying"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-white-residue",
    canonicalProblemId: "problem-white-residue",
    problemIds: ["problem-white-residue"],
    safetyLevel: "user-safe",
    steps: [
      { id: "residue-test-film", sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"], safetyLevel: "user-safe" },
      { id: "residue-check-hardness", sourceIds: ["source-electrolux-white-residue"], safetyLevel: "user-safe" },
      { id: "residue-check-dosing", sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"], safetyLevel: "user-safe" },
      { id: "residue-recognize-etching", sourceIds: ["source-whirlpool-dull-dishes"], safetyLevel: "user-safe" },
    ],
  },
  {
    id: "guide-dishwasher-tablet-not-dissolving",
    canonicalProblemId: "problem-dishwasher-tablet-not-dissolving",
    problemIds: ["problem-dishwasher-tablet-not-dissolving"],
    safetyLevel: "user-safe",
    steps: [
      { id: "tablet-dry-dispenser", sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"], safetyLevel: "user-safe" },
      { id: "tablet-clear-door", sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"], safetyLevel: "user-safe" },
      { id: "tablet-match-cycle", sourceIds: ["source-electrolux-tablet"], safetyLevel: "user-safe" },
      { id: "tablet-escalate", sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-unusual-noise",
    canonicalProblemId: "problem-dishwasher-unusual-noise",
    problemIds: ["problem-dishwasher-unusual-noise"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "noise-identify-cycle-stage", sourceIds: ["source-whirlpool-normal-noise", "source-electrolux-unusual-noise"], safetyLevel: "user-safe" },
      { id: "noise-secure-load", sourceIds: ["source-whirlpool-normal-noise", "source-electrolux-unusual-noise"], safetyLevel: "user-safe" },
      { id: "noise-check-user-maintenance", sourceIds: ["source-whirlpool-normal-noise"], safetyLevel: "caution" },
      { id: "noise-escalate", sourceIds: ["source-electrolux-unusual-noise"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-door-not-closing",
    canonicalProblemId: "problem-dishwasher-door-not-closing",
    problemIds: ["problem-dishwasher-door-not-closing"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "door-remove-obstructions", sourceIds: ["source-whirlpool-door-not-close"], safetyLevel: "user-safe" },
      { id: "door-seat-racks", sourceIds: ["source-whirlpool-door-not-close"], safetyLevel: "user-safe" },
      { id: "door-visible-latch-check", sourceIds: ["source-whirlpool-door-not-close"], safetyLevel: "caution" },
      { id: "door-escalate", sourceIds: ["source-whirlpool-door-not-close", "source-electrolux-door-not-close"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-no-power",
    canonicalProblemId: "problem-dishwasher-no-power",
    problemIds: ["problem-dishwasher-no-power"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "power-stop-for-damage", sourceIds: ["source-whirlpool-not-draining"], safetyLevel: "professional-only" },
      { id: "power-check-accessible-supply", sourceIds: ["source-whirlpool-no-power"], safetyLevel: "caution" },
      { id: "power-check-breaker-once", sourceIds: ["source-whirlpool-no-power", "source-electrolux-no-power"], safetyLevel: "caution" },
      { id: "power-escalate", sourceIds: ["source-electrolux-no-power", "source-whirlpool-no-power"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-not-heating",
    canonicalProblemId: "problem-dishwasher-not-heating",
    problemIds: ["problem-dishwasher-not-heating"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "heat-check-program", sourceIds: ["source-electrolux-not-heating"], safetyLevel: "user-safe" },
      { id: "heat-clean-filter", sourceIds: ["source-electrolux-not-heating"], safetyLevel: "caution" },
      { id: "heat-check-foam", sourceIds: ["source-electrolux-not-heating"], safetyLevel: "caution" },
      { id: "heat-escalate", sourceIds: ["source-electrolux-not-heating", "source-siemens-error-codes"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-excessive-foam",
    canonicalProblemId: "problem-dishwasher-excessive-foam",
    problemIds: ["problem-dishwasher-excessive-foam"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "foam-stop-overflow", sourceIds: ["source-electrolux-foam"], safetyLevel: "caution" },
      { id: "foam-check-detergent", sourceIds: ["source-electrolux-foam", "source-lg-error-codes"], safetyLevel: "user-safe" },
      { id: "foam-remove-visible", sourceIds: ["source-electrolux-foam"], safetyLevel: "caution" },
      { id: "foam-rinse-escalate", sourceIds: ["source-electrolux-foam"], safetyLevel: "professional-only" },
    ],
  },
  {
    id: "guide-dishwasher-smells",
    canonicalProblemId: "problem-dishwasher-smells",
    problemIds: ["problem-dishwasher-smells"],
    safetyLevel: "caution",
    reviewIntervalDays: mutableHtmlReviewIntervalDays,
    steps: [
      { id: "smell-stop-if-burning", sourceIds: ["source-whirlpool-not-draining"], safetyLevel: "professional-only" },
      { id: "smell-clean-filter", sourceIds: ["source-bosch-smells", "source-whirlpool-odors"], safetyLevel: "caution" },
      { id: "smell-clean-accessible-parts", sourceIds: ["source-bosch-smells", "source-whirlpool-odors"], safetyLevel: "user-safe" },
      { id: "smell-check-drain-escalate", sourceIds: ["source-whirlpool-odors", "source-bosch-smells"], safetyLevel: "professional-only" },
    ],
  },
];

const stepClaimId = (stepId: string) => `claim-guide-step-${stepId}`;

export const guideKnowledge: TroubleshootingGuideKnowledge[] = guideDefinitions.map((guide) => ({
  id: guide.id,
  categoryId: dishwasherCategoryId,
  canonicalProblemId: guide.canonicalProblemId,
  problemIds: guide.problemIds,
  safetyLevel: guide.safetyLevel,
  verificationStatus: "verified",
  lastReviewed: reviewedOn,
  reviewIntervalDays: guide.reviewIntervalDays ?? existingReviewIntervalDays,
  steps: guide.steps.map((step) => ({
    id: step.id,
    evidenceClaimIds: [stepClaimId(step.id)],
    safetyLevel: step.safetyLevel,
  })),
}));

export const sharedEvidenceClaimKnowledge: EvidenceClaimKnowledge[] = guideDefinitions.flatMap((guide) =>
  guide.steps.map((step) => ({
    id: stepClaimId(step.id),
    kind: step.safetyLevel === "professional-only" ? "safety-boundary" : "guide-step",
    sourceIds: step.sourceIds,
    verificationStatus: "verified",
  })),
);
