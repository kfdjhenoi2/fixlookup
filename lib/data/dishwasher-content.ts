import type {
  DeviceModel,
  ErrorCode,
  ModelFamily,
  Problem,
  TroubleshootingGuide,
} from "../types";

export const dishwasherModelFamilies: ModelFamily[] = [];
export const dishwasherModels: DeviceModel[] = [];

export const dishwasherProblems: Problem[] = [
  {
    id: "problem-dishwasher-not-draining",
    slug: "dishwasher-not-draining",
    title: "Dishwasher not draining or leaving standing water",
    categoryId: "category-dishwashers",
    summary:
      "Start with the removable filter, visible drain-hose route, and any recent sink or disposal work before arranging service.",
    symptomLabels: ["Standing water after a cycle", "Water not pumping out", "Drain-related code"],
    guideId: "guide-dishwasher-not-draining",
    sourceIds: [
      "source-bosch-not-draining",
      "source-electrolux-drain-i20",
      "source-whirlpool-not-draining",
    ],
    relatedProblemIds: [
      "problem-dishwasher-not-filling",
      "problem-dishwasher-leaking",
      "problem-dishwasher-not-starting",
    ],
    safetyLevel: "caution",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-not-filling",
    slug: "dishwasher-not-filling-with-water",
    title: "Dishwasher not filling with water",
    categoryId: "category-dishwashers",
    summary:
      "Check the water supply, the visible inlet hose, and whether the door closes before using model-specific support.",
    symptomLabels: ["No water enters", "Cycle starts without filling", "Water-supply code"],
    guideId: "guide-dishwasher-not-filling",
    sourceIds: ["source-electrolux-inlet-i10", "source-whirlpool-not-filling"],
    relatedProblemIds: [
      "problem-dishwasher-not-draining",
      "problem-dishwasher-not-starting",
      "problem-dishwasher-leaking",
    ],
    safetyLevel: "caution",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-leaking",
    slug: "dishwasher-leaking",
    title: "Dishwasher leaking or water underneath",
    categoryId: "category-dishwashers",
    summary:
      "Stop the water source first, then limit checks to visible connections, loading, and detergent foam before arranging service.",
    symptomLabels: ["Water under the appliance", "Water or foam at the door", "Leak-protection code"],
    guideId: "guide-dishwasher-leaking",
    sourceIds: [
      "source-electrolux-leaking",
      "source-electrolux-i30",
      "source-whirlpool-f8e4",
      "source-samsung-water-codes",
    ],
    relatedProblemIds: [
      "problem-dishwasher-not-filling",
      "problem-dishwasher-not-draining",
      "problem-dishwasher-not-starting",
    ],
    safetyLevel: "caution",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-not-starting",
    slug: "dishwasher-will-not-start",
    title: "Dishwasher will not start",
    categoryId: "category-dishwashers",
    summary:
      "Check door closure, program selection, delay or control-lock settings, and the exact model manual before resetting anything.",
    symptomLabels: ["Power is on but no cycle begins", "Start control does not begin a cycle", "Delay or lock indicator"],
    guideId: "guide-dishwasher-not-starting",
    sourceIds: [
      "source-bosch-troubleshooting",
      "source-electrolux-not-starting",
      "source-whirlpool-not-starting",
    ],
    relatedProblemIds: [
      "problem-dishwasher-not-filling",
      "problem-dishwasher-not-draining",
      "problem-dishwasher-leaking",
    ],
    safetyLevel: "caution",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-not-cleaning",
    slug: "dishwasher-not-cleaning",
    title: "Dishwasher not cleaning dishes",
    categoryId: "category-dishwashers",
    summary:
      "Review loading, the removable filter and spray arms, the selected program, and automatic dishwasher detergent.",
    symptomLabels: ["Food remains after a cycle", "Top or bottom rack cleans poorly", "Spray arms obstructed"],
    guideId: "guide-dishwasher-not-cleaning",
    sourceIds: [
      "source-bosch-not-cleaning",
      "source-electrolux-not-cleaning",
      "source-whirlpool-not-cleaning",
    ],
    relatedProblemIds: [
      "problem-white-residue",
      "problem-dishwasher-tablet-not-dissolving",
      "problem-dishwasher-not-drying",
    ],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-not-drying",
    slug: "dishwasher-not-drying",
    title: "Dishwasher not drying dishes",
    categoryId: "category-dishwashers",
    summary:
      "Check whether the cycle includes drying, whether rinse aid and a supported dry option are in use, and whether loading traps water.",
    symptomLabels: ["Dishes remain wet", "Water pools on dishware", "Plastic items remain wetter"],
    guideId: "guide-dishwasher-not-drying",
    sourceIds: [
      "source-bosch-wet-dishes",
      "source-electrolux-not-drying",
      "source-whirlpool-not-drying",
    ],
    relatedProblemIds: [
      "problem-white-residue",
      "problem-dishwasher-not-cleaning",
      "problem-dishwasher-tablet-not-dissolving",
    ],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
  },
  {
    id: "problem-white-residue",
    slug: "white-residue-on-dishes",
    title: "White residue, film, or cloudy glasses after dishwashing",
    categoryId: "category-dishwashers",
    summary:
      "Separate removable mineral or salt film from possible permanent glass etching before changing detergent, rinse-aid, or water-hardness settings.",
    symptomLabels: ["White coating on dishes", "Cloudy glassware", "Film wipes or dissolves with vinegar"],
    guideId: "guide-white-residue",
    sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"],
    relatedProblemIds: [
      "problem-dishwasher-not-cleaning",
      "problem-dishwasher-not-drying",
      "problem-dishwasher-tablet-not-dissolving",
    ],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
  },
  {
    id: "problem-dishwasher-tablet-not-dissolving",
    slug: "dishwasher-tablet-not-dissolving",
    title: "Dishwasher tablet not dissolving or detergent left behind",
    categoryId: "category-dishwashers",
    summary:
      "Keep the dispenser dry and unobstructed, match the detergent to a suitable cycle, and use service support if basic checks do not resolve it.",
    symptomLabels: ["Tablet remains in dispenser", "Detergent remains after cycle", "Dispenser door obstructed"],
    guideId: "guide-dishwasher-tablet-not-dissolving",
    sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"],
    relatedProblemIds: [
      "problem-dishwasher-not-cleaning",
      "problem-white-residue",
      "problem-dishwasher-not-drying",
    ],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
  },
];

export const dishwasherErrorCodes: ErrorCode[] = [
  {
    id: "error-bosch-e15",
    slug: "e15",
    code: "E15",
    aliases: [],
    title: "E15 error code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-bosch",
    modelFamilyIds: [],
    summary:
      "Bosch says E15 means the safety switch detected water in the dishwasher base and the leakage-protection system activated. Turn off the water inflow and contact Bosch support.",
    sourceScope: "Bosch US dishwasher support",
    applicabilityNote:
      "No model family is assigned. Confirm E15 in the official manual for the exact dishwasher before relying on this record.",
    guideId: "guide-dishwasher-leaking",
    sourceIds: ["source-bosch-e15"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-bosch-e24",
    slug: "e24",
    code: "E24",
    aliases: [],
    title: "E24 error code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-bosch",
    modelFamilyIds: [],
    summary:
      "Bosch describes E24 as a drainage problem associated with a blocked drain filter and lists the drain hose and sink or disposal connection among the checks.",
    sourceScope: "Bosch US dishwasher support",
    applicabilityNote:
      "No model family is assigned. Confirm E24 and the permitted checks in the official manual for the exact dishwasher.",
    guideId: "guide-dishwasher-not-draining",
    sourceIds: ["source-bosch-e24"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-siemens-e15",
    slug: "e15",
    code: "E15",
    aliases: [],
    title: "E15 error code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-siemens",
    modelFamilyIds: [],
    summary:
      "Siemens says E15 signals water in the floor tub. Its guidance is to turn off the tap and contact customer service.",
    sourceScope: "Siemens Home Ireland dishwasher support",
    applicabilityNote:
      "No model family is assigned. Confirm E15 in the official manual for the exact dishwasher and use support for the correct market.",
    guideId: "guide-dishwasher-leaking",
    sourceIds: ["source-siemens-error-codes"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-electrolux-i20",
    slug: "i20",
    code: "i20",
    aliases: ["C2", "F2", "AL6", "2 beeps", "2 LED flashes"],
    title: "i20 drainage error",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-electrolux",
    modelFamilyIds: [],
    summary:
      "Electrolux groups i20 with C2, F2, AL6, two beeps, or two LED flashes and says these signals indicate a dishwasher drainage problem.",
    sourceScope: "Electrolux UK freestanding and integrated dishwasher support",
    applicabilityNote:
      "These aliases are grouped by the cited support page, but no model family is assigned. Confirm the signal in the exact model manual.",
    guideId: "guide-dishwasher-not-draining",
    sourceIds: ["source-electrolux-drain-i20"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-electrolux-i30",
    slug: "i30",
    code: "i30",
    aliases: ["3 beeps", "3 LED flashes"],
    title: "i30 leak error",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-electrolux",
    modelFamilyIds: [],
    summary:
      "Electrolux says i30, three beeps, or three LED flashes may indicate an internal leak with water collecting in the appliance base. Close the tap and arrange service if it returns.",
    sourceScope: "Electrolux UK freestanding and integrated dishwasher support",
    applicabilityNote:
      "The signal grouping comes from the cited support page, but no model family is assigned. Confirm it in the exact model manual.",
    guideId: "guide-dishwasher-leaking",
    sourceIds: ["source-electrolux-i30"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-samsung-4c",
    slug: "4c-4e",
    code: "4C",
    aliases: ["4E"],
    title: "4C / 4E information code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-samsung",
    modelFamilyIds: [],
    summary:
      "Samsung UK groups 4C and 4E as dishwasher water-supply issue codes and lists the supply valve and visible supply hose among the checks.",
    sourceScope: "Samsung UK dishwasher support",
    applicabilityNote:
      "The alias is grouped by the cited support page, but no model family is assigned. Confirm the code in the exact model manual.",
    guideId: "guide-dishwasher-not-filling",
    sourceIds: ["source-samsung-water-codes"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-samsung-5c",
    slug: "5c-5e",
    code: "5C",
    aliases: ["5E"],
    title: "5C / 5E information code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-samsung",
    modelFamilyIds: [],
    summary:
      "Samsung UK groups 5C and 5E as dishwasher drainage issue codes and lists the drain hose and filter among the checks.",
    sourceScope: "Samsung UK dishwasher support",
    applicabilityNote:
      "The alias is grouped by the cited support page, but no model family is assigned. Confirm the code in the exact model manual.",
    guideId: "guide-dishwasher-not-draining",
    sourceIds: ["source-samsung-water-codes"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-samsung-lc",
    slug: "lc-le",
    code: "LC",
    aliases: ["LE"],
    title: "LC / LE information code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-samsung",
    modelFamilyIds: [],
    summary:
      "Samsung UK groups LC and LE as dishwasher leak issue codes and directs persistent cases to the Samsung service centre.",
    sourceScope: "Samsung UK dishwasher support",
    applicabilityNote:
      "The alias is grouped by the cited support page, but no model family is assigned. Confirm the code in the exact model manual.",
    guideId: "guide-dishwasher-leaking",
    sourceIds: ["source-samsung-water-codes"],
    verificationStatus: "verified",
    isFictional: false,
  },
  {
    id: "error-whirlpool-f8e4",
    slug: "f8e4",
    code: "F8E4",
    aliases: ["F8 E4"],
    title: "F8E4 error code",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-whirlpool",
    modelFamilyIds: [],
    summary:
      "Whirlpool's F8E4 support page focuses on water, installation, and excessive-suds checks. For a professionally installed unit it says operation is prevented and directs the user to turn off the water supply.",
    sourceScope: "Whirlpool US dishwasher support",
    applicabilityNote:
      "No model family is assigned. Confirm F8E4 in the exact model manual before following any model-specific procedure.",
    guideId: "guide-dishwasher-leaking",
    sourceIds: ["source-whirlpool-f8e4"],
    verificationStatus: "verified",
    isFictional: false,
  },
];

const reviewed = "2026-08-17";

export const dishwasherGuides: TroubleshootingGuide[] = [
  {
    id: "guide-dishwasher-not-draining",
    slug: "dishwasher-not-draining",
    title: "Safe dishwasher drainage checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-not-draining",
    problemIds: ["problem-dishwasher-not-draining"],
    errorCodeIds: ["error-bosch-e24", "error-electrolux-i20", "error-samsung-5c"],
    safetyLevel: "caution",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-bosch-not-draining",
      "source-bosch-e24",
      "source-electrolux-drain-i20",
      "source-whirlpool-not-draining",
      "source-samsung-water-codes",
    ],
    steps: [
      {
        id: "drain-stop-for-hazards",
        title: "Stop first if the situation is unsafe",
        instruction:
          "If water is outside the appliance, wiring appears damaged, there is a burning smell, or a breaker trips repeatedly, stop using the dishwasher and arrange qualified service. Otherwise, record the exact model and any displayed code before continuing.",
        sourceIds: ["source-whirlpool-not-draining"],
        safetyLevel: "caution",
      },
      {
        id: "drain-clean-filter",
        title: "Clean only the removable filter described in the manual",
        instruction:
          "Switch the appliance off. Use the exact model manual to remove, clean, and refit the user-removable filter. Do not open panels or access a pump unless that manual explicitly identifies the task as user maintenance.",
        sourceIds: [
          "source-bosch-not-draining",
          "source-electrolux-drain-i20",
          "source-whirlpool-not-draining",
        ],
        safetyLevel: "caution",
      },
      {
        id: "drain-check-visible-route",
        title: "Inspect the visible drain route",
        instruction:
          "With the appliance off, look for a kink or twist in the accessible drain hose. If the issue began after installation, disposal replacement, or sink work, compare the connection with the appliance installation instructions; do not disconnect plumbing unless the exact manual authorizes it.",
        sourceIds: [
          "source-bosch-e24",
          "source-electrolux-drain-i20",
          "source-whirlpool-not-draining",
        ],
        safetyLevel: "caution",
      },
      {
        id: "drain-escalate",
        title: "Escalate a persistent drainage problem",
        instruction:
          "If standing water or the code returns after the user-level checks, use the manufacturer's support or a qualified technician. Do not remove panels to test a pump, wiring, or controls.",
        sourceIds: [
          "source-bosch-not-draining",
          "source-electrolux-drain-i20",
          "source-whirlpool-not-draining",
          "source-samsung-water-codes",
        ],
        safetyLevel: "professional-only",
      },
    ],
  },
  {
    id: "guide-dishwasher-not-filling",
    slug: "dishwasher-not-filling",
    title: "Safe dishwasher water-supply checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-not-filling",
    problemIds: ["problem-dishwasher-not-filling"],
    errorCodeIds: ["error-samsung-4c"],
    safetyLevel: "caution",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-electrolux-inlet-i10",
      "source-whirlpool-not-filling",
      "source-samsung-water-codes",
    ],
    steps: [
      {
        id: "fill-check-tap",
        title: "Confirm the household water supply",
        instruction:
          "Check that the dishwasher supply tap is fully open, then confirm that another household tap has normal flow. If the household supply is unavailable, resolve that supply issue first.",
        sourceIds: ["source-electrolux-inlet-i10", "source-whirlpool-not-filling"],
        safetyLevel: "user-safe",
      },
      {
        id: "fill-check-visible-hose",
        title: "Inspect the visible inlet hose",
        instruction:
          "Look only at the accessible hose for a kink, twist, or visible damage. If it is damaged, disconnect power, close the water supply, and arrange service rather than trying to repair the hose in place.",
        sourceIds: ["source-electrolux-inlet-i10", "source-samsung-water-codes"],
        safetyLevel: "caution",
      },
      {
        id: "fill-check-door",
        title: "Make sure the door is fully closed",
        instruction:
          "A dishwasher may not continue filling when the door is open or unlatched. Check for a simple obstruction and close the door as the exact model manual describes.",
        sourceIds: ["source-whirlpool-not-filling"],
        safetyLevel: "user-safe",
      },
      {
        id: "fill-escalate",
        title: "Use model-specific support if it still will not fill",
        instruction:
          "If the supply is available, the hose is undamaged, and the door is closed but water still does not enter, stop at these external checks and contact manufacturer support or qualified service.",
        sourceIds: ["source-electrolux-inlet-i10", "source-whirlpool-not-filling", "source-samsung-water-codes"],
        safetyLevel: "professional-only",
      },
    ],
  },
  {
    id: "guide-dishwasher-leaking",
    slug: "dishwasher-leaking",
    title: "Safe dishwasher leak checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-leaking",
    problemIds: ["problem-dishwasher-leaking"],
    errorCodeIds: [
      "error-bosch-e15",
      "error-siemens-e15",
      "error-electrolux-i30",
      "error-samsung-lc",
      "error-whirlpool-f8e4",
    ],
    safetyLevel: "caution",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-bosch-e15",
      "source-siemens-error-codes",
      "source-electrolux-leaking",
      "source-electrolux-i30",
      "source-whirlpool-f8e4",
      "source-samsung-water-codes",
    ],
    steps: [
      {
        id: "leak-stop-water",
        title: "Stop use and close the water supply",
        instruction:
          "Stop the dishwasher and close its water-supply tap. If water is near electrical connections or cannot be contained safely, keep clear and arrange qualified help.",
        sourceIds: [
          "source-bosch-e15",
          "source-siemens-error-codes",
          "source-electrolux-i30",
          "source-whirlpool-f8e4",
        ],
        safetyLevel: "caution",
      },
      {
        id: "leak-check-suds",
        title: "Check for excessive foam",
        instruction:
          "If there are suds or foam, stop the cycle and use only detergent made for automatic dishwashers. Hand-washing liquid or too much detergent can contribute to foam and leaking.",
        sourceIds: ["source-whirlpool-f8e4", "source-samsung-water-codes"],
        safetyLevel: "user-safe",
      },
      {
        id: "leak-check-accessible-causes",
        title: "Limit checks to accessible areas",
        instruction:
          "Without removing panels or pulling a built-in appliance out, look for an obviously loose visible hose connection, damaged door gasket, or a large item blocking a spray arm. Compare loading and installation with the exact model manual.",
        sourceIds: ["source-electrolux-leaking", "source-electrolux-i30"],
        safetyLevel: "caution",
      },
      {
        id: "leak-escalate",
        title: "Treat an internal or recurring leak as a service issue",
        instruction:
          "If a leak code returns, the base contains water, or no accessible cause is found, leave the water supply closed and contact the manufacturer's service channel or a qualified technician.",
        sourceIds: [
          "source-bosch-e15",
          "source-siemens-error-codes",
          "source-electrolux-i30",
          "source-whirlpool-f8e4",
          "source-samsung-water-codes",
        ],
        safetyLevel: "professional-only",
      },
    ],
  },
  {
    id: "guide-dishwasher-not-starting",
    slug: "dishwasher-not-starting",
    title: "Safe dishwasher start checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-not-starting",
    problemIds: ["problem-dishwasher-not-starting"],
    errorCodeIds: [],
    safetyLevel: "caution",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-bosch-troubleshooting",
      "source-electrolux-not-starting",
      "source-whirlpool-not-starting",
    ],
    steps: [
      {
        id: "start-record-state",
        title: "Separate a no-power issue from a no-start issue",
        instruction:
          "Record whether the display or indicators have power, which program is selected, and any visible message. If the breaker trips repeatedly, stop and use qualified service.",
        sourceIds: ["source-bosch-troubleshooting"],
        safetyLevel: "caution",
      },
      {
        id: "start-check-door",
        title: "Check door closure and simple obstructions",
        instruction:
          "Make sure the door is fully closed and latched and that a rack or dish is not preventing closure. Do not dismantle or bypass the latch.",
        sourceIds: [
          "source-bosch-troubleshooting",
          "source-electrolux-not-starting",
          "source-whirlpool-not-starting",
        ],
        safetyLevel: "user-safe",
      },
      {
        id: "start-check-controls",
        title: "Review the selected controls",
        instruction:
          "Confirm that a program is selected and check for delay-start or control-lock indicators. Use the exact owner manual to cancel or unlock them because button names and layouts vary by model.",
        sourceIds: ["source-electrolux-not-starting", "source-whirlpool-not-starting"],
        safetyLevel: "user-safe",
      },
      {
        id: "start-model-reset",
        title: "Use only the reset procedure for the exact model",
        instruction:
          "Do not assume a universal reset sequence. Follow the model manual, then contact manufacturer support or qualified service if the dishwasher still will not start.",
        sourceIds: [
          "source-electrolux-not-starting",
          "source-whirlpool-not-starting",
        ],
        safetyLevel: "caution",
      },
    ],
  },
  {
    id: "guide-dishwasher-not-cleaning",
    slug: "dishwasher-not-cleaning",
    title: "Dishwasher cleaning-performance checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-not-cleaning",
    problemIds: ["problem-dishwasher-not-cleaning"],
    errorCodeIds: [],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-bosch-not-cleaning",
      "source-electrolux-not-cleaning",
      "source-whirlpool-not-cleaning",
    ],
    steps: [
      {
        id: "clean-check-loading",
        title: "Reload so water can reach every surface",
        instruction:
          "Space items as the rack guide shows and make sure no dish blocks a spray arm. Check that each spray arm can rotate freely before starting the cycle.",
        sourceIds: ["source-bosch-not-cleaning", "source-whirlpool-not-cleaning"],
        safetyLevel: "user-safe",
      },
      {
        id: "clean-filter-arms",
        title: "Clean user-removable filters and spray arms",
        instruction:
          "Switch the appliance off and follow the exact model manual to clean its user-removable filter and spray arms. Do not reach into a pump or remove service panels.",
        sourceIds: [
          "source-bosch-not-cleaning",
          "source-electrolux-not-cleaning",
          "source-whirlpool-not-cleaning",
        ],
        safetyLevel: "caution",
      },
      {
        id: "clean-program-detergent",
        title: "Match the program and detergent to the load",
        instruction:
          "Choose a program suitable for the soil level using the model manual, and use only automatic dishwasher detergent according to its package and the appliance instructions.",
        sourceIds: ["source-electrolux-not-cleaning", "source-whirlpool-not-cleaning"],
        safetyLevel: "user-safe",
      },
      {
        id: "clean-escalate",
        title: "Escalate persistent poor cleaning",
        instruction:
          "If loading, the user-maintainable parts, program, and detergent are correct but results remain poor, use the manufacturer's support or qualified service rather than testing internal components.",
        sourceIds: [
          "source-bosch-not-cleaning",
          "source-electrolux-not-cleaning",
          "source-whirlpool-not-cleaning",
        ],
        safetyLevel: "professional-only",
      },
    ],
  },
  {
    id: "guide-dishwasher-not-drying",
    slug: "dishwasher-not-drying",
    title: "Dishwasher drying-performance checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-not-drying",
    problemIds: ["problem-dishwasher-not-drying"],
    errorCodeIds: [],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: [
      "source-bosch-wet-dishes",
      "source-electrolux-not-drying",
      "source-whirlpool-not-drying",
    ],
    steps: [
      {
        id: "dry-check-cycle",
        title: "Confirm the selected cycle includes drying",
        instruction:
          "Use the exact model manual to check whether the program has a drying phase and whether a supported extra-dry option must be selected. Do not assume every model has the same options.",
        sourceIds: [
          "source-bosch-wet-dishes",
          "source-electrolux-not-drying",
          "source-whirlpool-not-drying",
        ],
        safetyLevel: "user-safe",
      },
      {
        id: "dry-check-rinse-aid",
        title: "Check rinse aid according to the manual",
        instruction:
          "Confirm that rinse aid is present and that its setting follows the appliance manual. Manufacturer guidance links rinse aid with improved water runoff and drying.",
        sourceIds: [
          "source-bosch-wet-dishes",
          "source-electrolux-not-drying",
          "source-whirlpool-not-drying",
        ],
        safetyLevel: "user-safe",
      },
      {
        id: "dry-check-loading",
        title: "Load items so water can drain",
        instruction:
          "Leave space between items and angle concave surfaces so they do not collect water. Plastic items may remain wetter and sometimes need towel drying.",
        sourceIds: [
          "source-bosch-wet-dishes",
          "source-electrolux-not-drying",
          "source-whirlpool-not-drying",
        ],
        safetyLevel: "user-safe",
      },
      {
        id: "dry-escalate",
        title: "Use service for persistent drying failure",
        instruction:
          "If the supported cycle, rinse aid, and loading checks do not improve drying, contact manufacturer support or qualified service instead of testing heating components yourself.",
        sourceIds: [
          "source-bosch-wet-dishes",
          "source-electrolux-not-drying",
          "source-whirlpool-not-drying",
        ],
        safetyLevel: "professional-only",
      },
    ],
  },
  {
    id: "guide-white-residue",
    slug: "white-residue",
    title: "Identify dishwasher film, residue, or etching",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-white-residue",
    problemIds: ["problem-white-residue"],
    errorCodeIds: [],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"],
    steps: [
      {
        id: "residue-test-film",
        title: "Test a small suitable area",
        instruction:
          "First see whether the coating wipes away with a finger. On material that is safe for vinegar, gently test a small area with a small amount: removable film may be mineral buildup, while a coating that does not come off may be etching or silica film.",
        sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"],
        safetyLevel: "user-safe",
      },
      {
        id: "residue-check-hardness",
        title: "Review water-hardness and salt settings",
        instruction:
          "If the film is removable, compare the water-hardness setting with the exact model manual. Add dishwasher salt only if the appliance has a salt system and its manual instructs you to use it.",
        sourceIds: ["source-electrolux-white-residue"],
        safetyLevel: "user-safe",
      },
      {
        id: "residue-check-dosing",
        title: "Check detergent and rinse-aid dosing",
        instruction:
          "Compare detergent and rinse-aid amounts with the appliance manual and product packaging. Change one setting at a time so the result can be observed.",
        sourceIds: ["source-electrolux-white-residue", "source-whirlpool-dull-dishes"],
        safetyLevel: "user-safe",
      },
      {
        id: "residue-recognize-etching",
        title: "Do not treat permanent etching as removable film",
        instruction:
          "If the cloudy surface does not come off, Whirlpool says it may be etching or silica film; etching is irreversible. Review the manual's glassware guidance before washing more affected items.",
        sourceIds: ["source-whirlpool-dull-dishes"],
        safetyLevel: "user-safe",
      },
    ],
  },
  {
    id: "guide-dishwasher-tablet-not-dissolving",
    slug: "dishwasher-tablet-not-dissolving",
    title: "Dishwasher detergent-dispensing checks",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-dishwasher-tablet-not-dissolving",
    problemIds: ["problem-dishwasher-tablet-not-dissolving"],
    errorCodeIds: [],
    safetyLevel: "user-safe",
    verificationStatus: "verified",
    lastReviewed: reviewed,
    sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"],
    steps: [
      {
        id: "tablet-dry-dispenser",
        title: "Start with a clean, dry dispenser",
        instruction:
          "Clean away caked detergent and dry the dispenser before adding a tablet or powder. Keep detergent sealed in a cool, dry place and follow its package instructions.",
        sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"],
        safetyLevel: "user-safe",
      },
      {
        id: "tablet-clear-door",
        title: "Make sure the dispenser can open",
        instruction:
          "Reload any tall plate, rack, or accessory that blocks the detergent-dispenser lid. Do not force or dismantle the dispenser.",
        sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"],
        safetyLevel: "user-safe",
      },
      {
        id: "tablet-match-cycle",
        title: "Match the detergent to a suitable cycle",
        instruction:
          "Electrolux notes that tablets may not dissolve fully in short cycles. Choose a detergent and program combination allowed by the detergent packaging and the exact model manual.",
        sourceIds: ["source-electrolux-tablet"],
        safetyLevel: "user-safe",
      },
      {
        id: "tablet-escalate",
        title: "Escalate if the basic checks do not resolve it",
        instruction:
          "If detergent still remains after the dispenser, loading, detergent, and cycle checks, contact manufacturer support or qualified service. Do not test heaters, wiring, or the dispenser mechanism yourself.",
        sourceIds: ["source-electrolux-tablet", "source-whirlpool-detergent-remains"],
        safetyLevel: "professional-only",
      },
    ],
  },
];
