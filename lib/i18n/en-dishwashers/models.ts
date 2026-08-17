import type {
  ManufacturerTranslation,
  ModelTranslation,
  SourceTranslation,
} from "../../types";

export const modelLayerManufacturers: Record<string, ManufacturerTranslation> = {
  "manufacturer-ge": {
    slug: "ge",
    name: "GE Appliances",
    overview: "This GE Appliances index publishes exact dishwasher model records only when official model documentation supports the relationship. No compatibility is inherited from similar names.",
  },
  "manufacturer-miele": {
    slug: "miele",
    name: "Miele",
    overview: "This Miele index publishes exact dishwasher model records only when official model documentation supports the relationship. No compatibility is inherited from a product range.",
  },
  "manufacturer-beko": {
    slug: "beko",
    name: "Beko",
    overview: "This Beko index publishes exact dishwasher model records only when official product and manual evidence supports the relationship. Regional identifiers are preserved.",
  },
};

export const dishwasherModelTranslations: Record<string, ModelTranslation> = {
  "model-bosch-shx78cm5n-01": {
    slug: "shx78cm5n-01",
    name: "Bosch SHX78CM5N/01",
    note: "Bosch's US service record identifies this exact E-Nr and attaches the cited use-and-care manual. The manual supports the linked shared problem topics, but it does not list FixLookup's current Bosch E15–E25 records for this model.",
  },
  "model-siemens-sn25m889eu-55": {
    slug: "sn25m889eu-55",
    name: "Siemens SN25M889EU/55",
    note: "Siemens Home Ireland identifies this exact E-Nr and exposes its manual and model-specific self-help topics. Only codes and problems listed on that exact service record are linked here.",
  },
  "model-siemens-sn25m244eu-b3": {
    slug: "sn25m244eu-b3",
    name: "Siemens SN25M244EU/B3",
    note: "Siemens Home Ireland identifies this exact E-Nr, its instruction manual, and model-specific self-help topics. The full /B3 suffix remains part of the canonical identifier.",
  },
  "model-whirlpool-wdf550safw": {
    slug: "wdf550safw",
    name: "Whirlpool WDF550SAFW",
    note: "Whirlpool identifies this model on its US owner page, but no exact manual or current FixLookup troubleshooting relationship was verified during this pilot. This record is not publicly indexed.",
  },
  "model-samsung-dw60dg760b00u1": {
    slug: "dw60dg760b00u1",
    name: "Samsung DW60DG760B00U1",
    note: "Samsung UK's exact support record attaches the cited manual. That manual specifically lists 4C, 5C, and LC; other aliases on the shared Samsung code pages are not asserted for this model.",
  },
  "model-samsung-dw60a6090bb-ef": {
    slug: "dw60a6090bb-ef",
    name: "Samsung DW60A6090BB/EF",
    note: "Samsung UK's exact support record attaches the cited manual. That manual specifically lists 4C and LC; the /EF suffix is preserved and no unlisted code alias is inferred.",
  },
  "model-samsung-dw60m5050fw-eu": {
    slug: "dw60m5050fw-eu",
    name: "Samsung DW60M5050FW/EU",
    note: "Samsung Ireland's exact support record attaches the cited manual. That manual specifically lists 4C and LC; the /EU suffix is preserved and no unlisted code alias is inferred.",
  },
  "model-lg-ldph7972s-assesna": {
    slug: "ldph7972s-assesna",
    name: "LG LDPH7972S.ASSESNA",
    note: "LG USA identifies this full model identifier and attaches the cited online manual. The manual specifically supports AE, FE, IE, and OE; it does not establish the other aliases found on LG's broader code page for this model.",
  },
  "model-ge-pdt715synfs": {
    slug: "pdt715synfs",
    name: "GE Appliances PDT715SYNFS",
    note: "GE Appliances identifies PDT715SYNFS on its exact support record and provides the cited owner manual. No current FixLookup GE error-code entity is linked; only manual-supported shared problem topics are shown.",
  },
  "model-miele-g-5150-scvi-active": {
    slug: "g-5150-scvi-active",
    name: "Miele G 5150 SCVi Active",
    note: "Miele UK's exact product page attaches the cited operating instructions. No model family or current Miele error-code relationship is inferred; only manual-supported shared problem topics are shown.",
  },
  "model-beko-bdin16n30s": {
    slug: "bdin16n30s",
    name: "Beko BDIN16N30S",
    note: "Beko's official product sheet identifies BDIN16N30S and stock number 7694503977, and the cited manual names this model. Only the problem topics verified in that manual are linked.",
  },
  "model-beko-bdis38050q": {
    slug: "bdis38050q",
    name: "Beko BDIS38050Q",
    note: "Beko Slovakia's exact product page identifies BDIS38050Q and product number 7650193935, and attaches the cited English manual. Only the problem topics verified in that manual are linked.",
  },
};

export const dishwasherModelSources: Record<string, SourceTranslation> = {
  "source-model-bosch-shx78cm5n-01-support": { title: "Bosch SHX78CM5N/01 service record", note: "Verifies the exact E-Nr and provides model-specific documentation." },
  "source-model-bosch-shx78cm5n-01-manual": { title: "Bosch SHX78CM5N/01 use and care manual", note: "Supports the model-linked problem topics; its displayed fault format differs from FixLookup's current Bosch code set." },
  "source-model-siemens-sn25m889eu-55-support": { title: "Siemens SN25M889EU/55 service, manual, and self-help record", note: "Verifies the exact E-Nr and the code and problem options exposed for it." },
  "source-model-siemens-sn25m244eu-b3-support": { title: "Siemens SN25M244EU/B3 service and self-help record", note: "Verifies the exact E-Nr and the code and problem options exposed for it." },
  "source-model-siemens-sn25m244eu-b3-manual": { title: "Siemens SN25M244EU/B3 instruction manual", note: "Official instruction manual attached to the exact Siemens service record." },
  "source-model-whirlpool-wdf550safw-support": { title: "Whirlpool WDF550SAFW owner record", note: "Verifies the exact model identity. No exact manual or troubleshooting relationship was available for publication in this pilot." },
  "source-model-samsung-dw60dg760b00u1-support": { title: "Samsung DW60DG760B00U1 support record", note: "Verifies the exact identifier and attaches the cited manual." },
  "source-model-samsung-dw60dg760b00u1-manual": { title: "Samsung DW60DG760B00U1 user manual", note: "Specifically lists 4C, 5C, and LC in its information-code table." },
  "source-model-samsung-dw60a6090bb-ef-support": { title: "Samsung DW60A6090BB/EF support record", note: "Verifies the full /EF identifier and attaches the cited manual." },
  "source-model-samsung-dw60a6090bb-ef-manual": { title: "Samsung DW60A6090BB/EF user manual", note: "Specifically lists 4C and LC in its English information-code table." },
  "source-model-samsung-dw60m5050fw-eu-support": { title: "Samsung DW60M5050FW/EU support record", note: "Verifies the full /EU identifier and attaches the cited manual." },
  "source-model-samsung-dw60m5050fw-eu-manual": { title: "Samsung DW60M5050FW/EU user manual", note: "Specifically lists 4C and LC in its information-code table." },
  "source-model-lg-ldph7972s-assesna-support": { title: "LG LDPH7972S.ASSESNA support record", note: "Verifies the complete USA model identifier and attaches the cited online manual." },
  "source-model-lg-ldph7972s-assesna-manual": { title: "LG LDPH7972S.ASSESNA online owner manual", note: "Supports the exact code identifiers and shared problem relationships shown on the model page." },
  "source-model-ge-pdt715synfs-support": { title: "GE Appliances PDT715SYNFS support record", note: "Verifies the exact model identifier and links its owner manual." },
  "source-model-ge-pdt715synfs-manual": { title: "GE Appliances PDT715SYNFS owner manual", note: "Supports the shared problem relationships shown on the model page." },
  "source-model-miele-g-5150-scvi-active-product": { title: "Miele G 5150 SCVi Active product record", note: "Verifies the exact product name and attaches its operating instructions." },
  "source-model-miele-g-5150-scvi-active-manual": { title: "Miele G 5150 SCVi Active operating instructions", note: "Supports the shared problem relationships shown on the model page; no family compatibility is asserted." },
  "source-model-beko-bdin16n30s-product-sheet": { title: "Beko BDIN16N30S product information sheet", note: "Verifies the exact model identifier and stock number 7694503977." },
  "source-model-beko-bdin16n30s-manual": { title: "Beko BDIN16N30S user manual", note: "Names the exact model and supports the shared problem relationships shown on the model page." },
  "source-model-beko-bdis38050q-product": { title: "Beko BDIS38050Q product record", note: "Verifies the exact model identifier and product number 7650193935." },
  "source-model-beko-bdis38050q-manual": { title: "Beko BDIS38050Q user manual", note: "Names the exact model and supports the shared problem relationships shown on the model page." },
};
