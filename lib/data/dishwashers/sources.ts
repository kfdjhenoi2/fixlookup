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

  source("source-model-bosch-shx78cm5n-01-support", "Bosch US", "https://www.bosch-home.com/us/en/productservice/SHX78CM5N-01", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-bosch-shx78cm5n-01-manual", "Bosch US", "https://media3.bosch-home.com/Documents/9001642005_B.pdf", ["market-us"], "en", { kind: "manufacturer-manual", documentIdentifier: "9001642005_B" }),

  source("source-model-siemens-sn25m889eu-55-support", "Siemens Home Ireland", "https://www.siemens-home.bsh-group.com/ie/supportdetail/product/SN25M889EU/55", ["market-ie"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-siemens-sn25m244eu-b3-support", "Siemens Home Ireland", "https://www.siemens-home.bsh-group.com/ie/supportdetail/product/SN25M244EU/B3", ["market-ie"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-siemens-sn25m244eu-b3-manual", "Siemens Home", "https://media3.bsh-group.com/Documents/9000911442_H.pdf", ["market-ie"], "en", { kind: "manufacturer-manual", documentIdentifier: "9000911442_H" }),

  source("source-model-whirlpool-wdf550safw-support", "Whirlpool US", "https://www.whirlpool.com/owners-center-pdp.WDF550SAFW.html", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),

  source("source-model-samsung-dw60dg760b00u1-support", "Samsung UK", "https://www.samsung.com/uk/support/model/DW60DG760B00U1/", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-samsung-dw60dg760b00u1-manual", "Samsung", "https://downloadcenter.samsung.com/content/UM/202605/20260514112444633/OID78626_IB_DW7700B_EN_250512.pdf", ["market-uk"], "en", { kind: "manufacturer-manual", documentIdentifier: "OID78626", revision: "1.0, 2026-05-14" }),
  source("source-model-samsung-dw60a6090bb-ef-support", "Samsung UK", "https://www.samsung.com/uk/support/model/DW60A6090BB/EF/", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-samsung-dw60a6090bb-ef-manual", "Samsung", "https://downloadcenter.samsung.com/content/UM/202307/20230706135852850/DW6500AM_DW60A6092FW_EF_DD81-04050A-02_FR_ES_PT_EN.pdf", ["market-uk"], "en", { kind: "manufacturer-manual", documentIdentifier: "DD81-04050A-02", revision: "01, 2023-07-06" }),
  source("source-model-samsung-dw60m5050fw-eu-support", "Samsung Ireland", "https://www.samsung.com/ie/support/model/DW60M5050FW/EU/", ["market-ie"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-samsung-dw60m5050fw-eu-manual", "Samsung", "https://downloadcenter.samsung.com/content/UM/202307/20230706135559990/DW5500M_DD81-02615E-05_EN.pdf", ["market-ie"], "en", { kind: "manufacturer-manual", documentIdentifier: "DD81-02615E-05", revision: "1.0, 2023-07-06" }),

  source("source-model-lg-ldph7972s-assesna-support", "LG USA", "https://www.lg.com/us/support/product/lg-LDPH7972S.ASSESNA?tab=1", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-lg-ldph7972s-assesna-manual", "LG USA", "https://gscs-manual.lge.com/CDZ/MFL71917413/en-us/main.html", ["market-us"], "en", { kind: "manufacturer-manual", documentIdentifier: "MFL71917413", revision: "02" }),

  source("source-model-ge-pdt715synfs-support", "GE Appliances", "https://products.geappliances.com/appliance/gea-specs/PDT715SYNFS/support", ["market-us"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-ge-pdt715synfs-manual", "GE Appliances", "https://images.salsify.com/image/upload/s--sdJa7sbq--/36ad4624ca7e5f44fdf2157a66dd9a951db34305.pdf", ["market-us"], "en", { kind: "manufacturer-manual", documentIdentifier: "49-4000270", revision: "Rev 0" }),

  source("source-model-miele-g-5150-scvi-active-product", "Miele UK", "https://www.miele.co.uk/product/12153240/fully-integrated-dishwashers-g-5150-scvi-active-stainless-steel", ["market-uk"], "en", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-miele-g-5150-scvi-active-manual", "Miele", "https://media.miele.com/downloads/97/54/03_C7F12828550E1EDF9EFF2C7C8F4A9754.pdf", ["market-uk"], "en", { kind: "manufacturer-manual", documentIdentifier: "M.-Nr. 12 211 760" }),

  source("source-model-beko-bdin16n30s-product-sheet", "Beko Germany", "https://www.beko.com/content/dam/germany-de-aem/germany-de-aemProductCatalog/product-documents/7694503977-BDIN16N30S/en-US-7694503977-PRODUCTFICHEEU2021-7694503977-en-US20230927-105809-765.pdf", ["market-de"], "en", { kind: "official-service-document", documentIdentifier: "7694503977" }),
  source("source-model-beko-bdin16n30s-manual", "Beko Germany", "https://www.beko.com/content/dam/germany-de-aem/germany-de-aemProductCatalog/product-documents/7694503977-BDIN16N30S/en-US-7694503977-202309141651969-User-Manual---File-Longen-US.pdf", ["market-de"], "en", { kind: "manufacturer-manual", documentIdentifier: "15 7878 0200", revision: "AA, 2023-08-03" }),
  source("source-model-beko-bdis38050q-product", "Beko Slovakia", "https://www.beko.com/sk-sk/produkty/volne-stojace-umyvacky/volne-stojaca-umyvacka-10-sad-riadu-sirka-45-cm-bdis38050q", ["market-sk"], "sk", { reviewIntervalDays: mutableHtmlReviewIntervalDays }),
  source("source-model-beko-bdis38050q-manual", "Beko Slovakia", "https://www.beko.com/content/dam/slovakia-sk-aem/slovakia-sk-aemProductCatalog/product-documents/7650193935-BDIS38050Q/en-GB-7650193935-MDM2-USER-MANUAL-FILE-en-GB.pdf", ["market-sk"], "en", { kind: "manufacturer-manual", documentIdentifier: "15 3062 0100", revision: "AA, 2025-06-25" }),
];
