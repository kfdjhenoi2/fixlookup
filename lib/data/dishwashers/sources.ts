import type { SourceKnowledge, SourceKind } from "../../types";
import {
  existingReviewIntervalDays,
  mutableHtmlReviewIntervalDays,
  reviewedOn,
} from "./constants";

const source = (
  id: string,
  publisher: string,
  url: string,
  marketIds: string[],
  language: string,
  options: {
    kind?: SourceKind;
    publishedAt?: string;
    documentIdentifier?: string;
    revision?: string;
    reviewIntervalDays?: number;
  } = {},
): SourceKnowledge => ({
  id,
  publisher,
  kind: options.kind ?? "manufacturer-support",
  marketIds,
  language,
  url,
  publishedAt: options.publishedAt,
  documentIdentifier: options.documentIdentifier,
  revision: options.revision,
  accessedAt: reviewedOn,
  lastReviewed: reviewedOn,
  reviewIntervalDays: options.reviewIntervalDays ?? existingReviewIntervalDays,
  verificationStatus: "verified",
});

export const sourceKnowledge: SourceKnowledge[] = [
  source("source-bosch-not-draining", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-not-drain", ["market-us"], "en"),
  source("source-bosch-troubleshooting", "Bosch US", "https://www.bosch-home.com/us/owner-support/dishwashers/troubleshooting", ["market-us"], "en"),
  source("source-bosch-not-cleaning", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-not-cleaning-dishes", ["market-us"], "en"),
  source("source-bosch-wet-dishes", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwashers-with-dishes-wet", ["market-us"], "en"),
  source("source-bosch-e15", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-error-e15", ["market-us"], "en"),
  source("source-bosch-e24", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-error-e24", ["market-us"], "en"),
  source("source-bosch-error-codes", "Bosch US", "https://www.bosch-home.com/us/owner-support/error-codes/dishwashers", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-bosch-smells", "Bosch US", "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-dishwasher-smells", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-siemens-error-codes", "Siemens Home Ireland", "https://www.siemens-home.bsh-group.com/ie/customer-service/support/troubleshooting/problems/dishcare/dishcare-error-codes", ["market-ie"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-electrolux-inlet-i10", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i10-i11-al5-c1-beeps-once-or-the-warning-light-flashes-once", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-drain-i20", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i20-c2-f2-or-al6-or-beeps-twice-not-draining", ["market-uk"], "en"),
  source("source-electrolux-leaking", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-is-leaking", ["market-uk"], "en"),
  source("source-electrolux-i30", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i30", ["market-uk"], "en"),
  source("source-electrolux-i40", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i40-i43-or-i44", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-if0", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-if0-ifo-or-if1", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-not-starting", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-does-not-will-not-start-but-the-power-is-on", ["market-uk"], "en"),
  source("source-electrolux-not-cleaning", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-not-cleaning-properly", ["market-uk"], "en"),
  source("source-electrolux-not-drying", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-does-not-dry-or-dries-poorly", ["market-uk"], "en"),
  source("source-electrolux-white-residue", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-leaves-white-residue-on-dishes-and-cutlery", ["market-uk"], "en"),
  source("source-electrolux-tablet", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-tablets-do-not-fully-dissolve-left-in-the-base", ["market-uk"], "en"),
  source("source-electrolux-unusual-noise", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-is-making-unusual-noises", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-door-not-close", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-door-does-not-close", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-no-power", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-does-not-switch-on-no-light-on-the-control-panel", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-not-heating", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/dishwasher-is-not-heating-up-water", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-electrolux-foam", "Electrolux UK", "https://support.electrolux.co.uk/support-articles/article/there-is-a-lot-of-foam-in-my-dishwasher", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-whirlpool-not-draining", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Product_Assistance/Dishwasher_Not_Draining", ["market-us"], "en"),
  source("source-whirlpool-not-filling", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Cycle_Concerns/Cycle_Not_Advancing/Will_Not_Fill_with_Water/Will_Not_Fill_With_Water_-_Dishwasher", ["market-us"], "en"),
  source("source-whirlpool-not-starting", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Product_Assistance/Dishwasher_Not_Starting_or_Not_Operating", ["market-us"], "en"),
  source("source-whirlpool-not-cleaning", "Whirlpool US", "https://www.whirlpool.com/blog/kitchen/dishwasher-not-cleaning.html", ["market-us"], "en"),
  source("source-whirlpool-not-drying", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Drying_Performance/Not_Drying_-_Dishwasher", ["market-us"], "en"),
  source("source-whirlpool-dull-dishes", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Wash_Performance/Other_Cookware_and_Dishes/Dull_Surfaces_on_Dishes", ["market-us"], "en"),
  source("source-whirlpool-detergent-remains", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Dispenser_Concerns/Dispenser_Concerns/Detergent_Remains_at_End_of_Cycle_-_Dishwasher", ["market-us"], "en"),
  source("source-whirlpool-f8e4", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Leaking/Underneath_or_Behind/F8E4_-_Error_Code_-_Dishwasher", ["market-us"], "en"),
  source("source-whirlpool-error-codes", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Product_Assistance/Dishwasher_Error_Codes_-_Reading", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-whirlpool-h2o", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Error_Code_or_Flashing_Lights/Error_Codes/H2O_-_Dishwasher", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-whirlpool-normal-noise", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Product_Assistance/Normal_Dishwasher_Sounds_and_Noise", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-whirlpool-no-power", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Operation/No_Power/No_Power_-_Not_Turning_On_-_Dishwasher", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-whirlpool-odors", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Cleaning_and_Care/Removing_Odors_in_your_Dishwasher", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-whirlpool-door-not-close", "Whirlpool US", "https://producthelp.whirlpool.com/Dishwashers/Dishwasher/Door_Concerns/Door_Will_Not_Close/Door_Will_Not_Close_-_Dishwasher", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-samsung-water-codes", "Samsung UK", "https://www.samsung.com/uk/support/home-appliances/5c-5e-4c-4e-and-lc-le-information-codes-on-my-dishwasher/", ["market-uk"], "en", { publishedAt: "2021-09-23" }),
  source("source-samsung-error-codes-mx", "Samsung Mexico", "https://www.samsung.com/mx/support/home-appliances/samsung-dishwasher-error-codes/", ["market-mx"], "es", { publishedAt: "2024-07-05", reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-lg-error-codes", "LG USA", "https://www.lg.com/us/support/help-library/lg-dishwasher-guide-to-error-codes-CT10000009-20154464775480", ["market-us"], "en", { publishedAt: "2025-04-23", reviewIntervalDays: mutableHtmlReviewIntervalDays }),
];
