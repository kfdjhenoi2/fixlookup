import type {
  ApplicabilityScopeTranslation,
  ErrorInterpretationTranslation,
  ErrorSignalTranslation,
  GuideTranslation,
  ManufacturerTranslation,
  ProblemTranslation,
  SourceTranslation,
} from "../../types";

export const phase1aManufacturers: Record<string, ManufacturerTranslation> = {
  "manufacturer-lg": {
    slug: "lg",
    name: "LG",
    overview: "This LG index contains only source-reviewed dishwasher records from LG's official support material. Error codes can differ by model, so compatibility is never inferred.",
  },
};

export const phase1aProblems: Record<string, ProblemTranslation> = {
  "problem-dishwasher-unusual-noise": {
    slug: "dishwasher-making-unusual-noise",
    title: "Dishwasher making an unusual noise",
    summary: "Compare the sound with the cycle stage, secure the load, and check only user-maintainable parts before arranging service for a persistent or abnormal noise.",
    symptomLabels: ["Unexpected humming or grinding", "Dishes or spray arms knocking", "Noise when draining"],
  },
  "problem-dishwasher-door-not-closing": {
    slug: "dishwasher-door-will-not-close",
    title: "Dishwasher door will not close",
    summary: "Remove visible obstructions, make sure the racks are fully seated, and leave damaged or misaligned latch and hinge work to an installer or technician.",
    symptomLabels: ["Door will not latch", "Rack blocks the door", "Door appears crooked"],
  },
  "problem-dishwasher-no-power": {
    slug: "dishwasher-has-no-power",
    title: "Dishwasher has no power or display",
    summary: "Check only the accessible plug, switch, fuse, or breaker, and stop if there is damage, a burning smell, or repeated electrical tripping.",
    symptomLabels: ["No lights on the control panel", "On button does nothing", "Display is dark"],
  },
  "problem-dishwasher-not-heating": {
    slug: "dishwasher-not-heating-water",
    title: "Dishwasher is not heating water",
    summary: "Confirm the selected programme, clean only user-maintainable filters, and use professional service rather than testing a heater or electrical component.",
    symptomLabels: ["Water remains cold", "No steam at the end", "Poor washing with no heat"],
  },
  "problem-dishwasher-excessive-foam": {
    slug: "dishwasher-excessive-foam-suds",
    title: "Dishwasher has excessive foam or suds",
    summary: "Stop an overflowing cycle, remove accessible foam, and correct detergent or rinse-aid use before running a detergent-free rinse.",
    symptomLabels: ["Foam inside the tub", "Suds leaking from the door", "Hand-washing liquid used"],
  },
  "problem-dishwasher-smells": {
    slug: "dishwasher-smells-bad",
    title: "Dishwasher smells bad",
    summary: "Clean the user-removable filter and accessible interior, then check for standing water while treating a burning smell as a stop-and-service condition.",
    symptomLabels: ["Food or stale-water smell", "Odour from the filter", "Dishwasher interior smells"],
  },
};

export const dishwasherErrorSignals: Record<string, ErrorSignalTranslation> = {
  "error-bosch-e15": { slug: "e15", title: "E15 error code", signalLabels: [] },
  "error-bosch-e24": { slug: "e24", title: "E24 error code", signalLabels: [] },
  "error-bosch-e12": { slug: "e12", title: "E12 error code", signalLabels: [] },
  "error-bosch-e16": { slug: "e16", title: "E16 / E17 error codes", signalLabels: [] },
  "error-bosch-e18": { slug: "e18", title: "E18 error code", signalLabels: [] },
  "error-bosch-e22": { slug: "e22", title: "E22 error code", signalLabels: [] },
  "error-bosch-e25": { slug: "e25", title: "E25 error code", signalLabels: [] },

  "error-siemens-e15": { slug: "e15", title: "E15 error code", signalLabels: [] },
  "error-siemens-e12": { slug: "e12", title: "E12 error code", signalLabels: [] },
  "error-siemens-e14": { slug: "e14", title: "E14 error code", signalLabels: [] },
  "error-siemens-e16": { slug: "e16", title: "E16 error code", signalLabels: [] },
  "error-siemens-e18": { slug: "e18", title: "E18 error code", signalLabels: [] },
  "error-siemens-e22": { slug: "e22", title: "E22 error code", signalLabels: [] },
  "error-siemens-e24": { slug: "e24", title: "E24 / E25 error codes", signalLabels: [] },

  "error-electrolux-i20": { slug: "i20", title: "i20 drainage error", signalLabels: ["2 beeps", "2 LED flashes"] },
  "error-electrolux-i30": { slug: "i30", title: "i30 leak error", signalLabels: ["3 beeps", "3 LED flashes"] },
  "error-electrolux-i10": { slug: "i10", title: "i10 water-inlet error", signalLabels: ["1 beep", "1 LED flash"] },
  "error-electrolux-i40": { slug: "i40", title: "i40 water-level error group", signalLabels: ["4 beeps", "4 LED flashes"] },
  "error-electrolux-if0": { slug: "if0", title: "iF0 water-level error group", signalLabels: [] },

  "error-whirlpool-f8e4": { slug: "f8e4", title: "F8E4 error code", signalLabels: [] },
  "error-whirlpool-f9e1": { slug: "f9e1", title: "F9E1 error code", signalLabels: [] },
  "error-whirlpool-h2o": { slug: "h2o", title: "H2O error code", signalLabels: [] },

  "error-samsung-4c": { slug: "4c-4e", title: "4C / 4E information code", signalLabels: [] },
  "error-samsung-5c": { slug: "5c-5e", title: "5C / 5E information code", signalLabels: [] },
  "error-samsung-lc": { slug: "lc-le", title: "LC / LE information code", signalLabels: [] },
  "error-samsung-oc": { slug: "oc", title: "OC / 0C / oE water-level code", signalLabels: [] },

  "error-lg-ae": { slug: "ae", title: "AE / EI / FE / RE error cluster", signalLabels: [] },
  "error-lg-ie": { slug: "ie", title: "IE water-inlet error", signalLabels: [] },
  "error-lg-oe": { slug: "oe", title: "OE water-outlet error", signalLabels: [] },
};

export const dishwasherErrorInterpretations: Record<string, ErrorInterpretationTranslation> = {
  "interpretation-bosch-e15": {
    summary: "Bosch says E15 means the safety switch detected water in the dishwasher base and the leakage-protection system activated.",
    guidance: "Turn off the water inflow and contact Bosch support. Do not pull out a built-in appliance or open service panels.",
  },
  "interpretation-bosch-e24": {
    summary: "Bosch describes E24 as a drainage problem and lists the drain pump path, hose, air gap, and sink connection among possible causes.",
    guidance: "Use the exact manual for filter maintenance and limit checks to the visible hose and sink connection. Arrange support if the code remains.",
  },
  "interpretation-bosch-e12": {
    summary: "Bosch defines E12 as limescale buildup in the heat pump.",
    guidance: "Follow Bosch's descaling instructions and the exact model manual. Use dishwasher salt only if the appliance has a supported water-softener system.",
  },
  "interpretation-bosch-e16": {
    summary: "Bosch groups E16 and E17 as a water-flow or filling-system issue in which water may not enter the dishwasher.",
    guidance: "Check the visible inlet hose for a kink or damage. Close the water supply and arrange support if the hose is damaged or the code persists.",
  },
  "interpretation-bosch-e18": {
    summary: "Bosch says E18 indicates a water-flow problem: the water level is too low or water is not being pumped correctly.",
    guidance: "Confirm the water supply is on and inspect the visible inlet hose for damage or kinks. Use Bosch support if the condition remains.",
  },
  "interpretation-bosch-e22": {
    summary: "Bosch associates E22 with a blocked filter or another obstruction in the dishwasher's drain path.",
    guidance: "Clean only the user-removable filter described in the exact manual and inspect the visible drain hose. Do not access internal pump parts unless the manual expressly treats that as user maintenance.",
  },
  "interpretation-bosch-e25": {
    summary: "Bosch lists E25 as a drainage-path condition involving the drain pump area, hose, air gap, or sink connection.",
    guidance: "Use the shared drainage checks and exact model manual. Stop before panel removal or internal pump diagnosis and contact Bosch if the code remains.",
  },

  "interpretation-siemens-e15": {
    summary: "Siemens says E15 signals water in the floor tub.",
    guidance: "Turn off the water tap and contact Siemens service rather than trying to clear water from inside the appliance.",
  },
  "interpretation-siemens-e12": {
    summary: "Siemens says E12 means the dishwasher's heating element is calcified or soiled.",
    guidance: "Descale the dishwasher according to Siemens guidance and the exact model manual. Do not test or access the heating element.",
  },
  "interpretation-siemens-e14": {
    summary: "Siemens says E14 indicates that water protection activated because of a filling-system or water-supply fault.",
    guidance: "Check the external water inflow and visible inlet hose for a kink. Contact Siemens service if the condition repeats.",
  },
  "interpretation-siemens-e16": {
    summary: "Siemens defines E16 as a fault in the filling system or water inflow.",
    guidance: "Turn off the water tap, inspect only the external inflow and visible hose, and use Siemens service for a recurring fault.",
  },
  "interpretation-siemens-e18": {
    summary: "Siemens says E18 is a water-inlet fault that may involve the supply hose, tap, or inlet filter.",
    guidance: "Confirm the tap is open and the visible hose is not kinked. Use the exact manual before any filter work and arrange service if the code remains.",
  },
  "interpretation-siemens-e22": {
    summary: "Siemens says E22 means the dishwasher filter system is soiled or clogged.",
    guidance: "Clean and refit only the filter system described as user-maintainable in the exact model manual.",
  },
  "interpretation-siemens-e24": {
    summary: "Siemens groups E24 and E25 with a dishwasher drainage problem.",
    guidance: "Follow the shared external drainage checks and exact model manual. Contact Siemens if the code persists rather than diagnosing the wastewater pump internally.",
  },

  "interpretation-electrolux-i20": {
    summary: "Electrolux groups i20 with C2, F2, AL6, two beeps, or two LED flashes and says the signals indicate a drainage problem.",
    guidance: "Clean the user-removable filters, inspect the visible drain hose and recent sink connection work, then arrange service if drainage does not resume.",
  },
  "interpretation-electrolux-i30": {
    summary: "Electrolux says i30, three beeps, or three LED flashes may indicate an internal leak with water in the appliance base.",
    guidance: "Close the water tap and arrange authorized service if the signal returns. Do not open the base or service panels.",
  },
  "interpretation-electrolux-i10": {
    summary: "Electrolux groups i10, i11, AL5, C1, F1, one beep, and one flash as a water-inlet problem in which the dishwasher does not fill.",
    guidance: "Confirm the tap and household supply, then inspect the visible inlet hose. If the hose is damaged, unplug the dishwasher, close the water, and arrange service.",
  },
  "interpretation-electrolux-i40": {
    summary: "Electrolux groups i40, i41, i43, i44, four beeps, and four flashes and says i40 can indicate a pressure-sensor or water-level-control fault.",
    guidance: "After isolating power, check the user-removable filters and sump for visible foam or debris. Arrange approved service if the signal returns.",
  },
  "interpretation-electrolux-if0": {
    summary: "Electrolux groups iF0, iFo, and iF1 as a water-level problem.",
    guidance: "After isolating power, clean the user-removable filters and clear visible foam or debris from the sump. Arrange approved service if the signal remains.",
  },

  "interpretation-whirlpool-f8e4": {
    summary: "Whirlpool's F8E4 guidance concerns water detected in the drip tray and includes checks for leaks and excessive suds.",
    guidance: "Turn off the water supply when directed and use the leak and foam guides. Internal drip-tray and float-switch procedures are intentionally not reproduced.",
  },
  "interpretation-whirlpool-f9e1": {
    summary: "Whirlpool defines F9E1 as a long-drain or not-draining condition.",
    guidance: "Clean the user-removable filter and inspect the visible drain hose, air gap, and recent disposer connection work. Use service if the code returns.",
  },
  "interpretation-whirlpool-h2o": {
    summary: "Whirlpool defines H2O as the dishwasher not detecting water.",
    guidance: "Ensure the water supply is on and the visible inlet hose is not kinked. Press Start only after the supply issue is corrected and arrange service if the alert remains.",
  },

  "interpretation-samsung-4c": {
    summary: "Samsung UK groups 4C and 4E as dishwasher water-supply issue codes.",
    guidance: "Check that the supply valve is open and the visible supply hose is not kinked. Use Samsung support if the signal remains.",
  },
  "interpretation-samsung-5c": {
    summary: "Samsung UK groups 5C and 5E as dishwasher drainage issue codes.",
    guidance: "Check the user-removable filter and visible drain hose, then use Samsung service if the dishwasher still cannot drain.",
  },
  "interpretation-samsung-lc": {
    summary: "Samsung UK groups LC and LE as dishwasher leak issue codes.",
    guidance: "Stop the leak safely, close the water supply when needed, and use Samsung service if the signal persists.",
  },
  "interpretation-samsung-oc": {
    summary: "Samsung Mexico groups OC, 0C, and oE as a water-level condition in which the dishwasher contains more water than expected, often related to drainage.",
    guidance: "Inspect the visible drain connection and hose and clean the user-removable filter. Arrange Samsung service if the signal persists.",
  },

  "interpretation-lg-ae": {
    summary: "LG groups AE, EI, FE, and RE under leakage or overfilling guidance and notes that oversudsing can contribute.",
    guidance: "Use only automatic dishwasher detergent, stop if water is leaking, and request service if the signal persists. Do not pull out a built-in appliance.",
  },
  "interpretation-lg-ie": {
    summary: "LG says IE appears when the specified amount of water is not supplied to the tub.",
    guidance: "Check the household water supply, open the inlet valve, and straighten only visible kinks in the inlet hose. Use installation support or service if it remains.",
  },
  "interpretation-lg-oe": {
    summary: "LG says OE appears when the dishwasher tub is not fully drained.",
    guidance: "Wait for the tub to cool, clean the user-removable filter, and inspect the visible drain hose for kinks. Use installation support or service if it remains.",
  },
};

const scope = (sourceScope: string, applicabilityNote: string): ApplicabilityScopeTranslation => ({
  sourceScope,
  applicabilityNote,
});

export const dishwasherApplicabilityScopes: Record<string, ApplicabilityScopeTranslation> = {
  "scope-bosch-e15": scope("Bosch US dishwasher support", "Bosch's US support describes this signal generally; confirm E15 in the official manual for the exact dishwasher."),
  "scope-bosch-e24": scope("Bosch US dishwasher support", "Bosch's US support describes E24 and E-24; confirm the code and permitted maintenance in the exact model manual."),
  "scope-bosch-e12": scope("Bosch US dishwasher support", "No model family is assigned. Confirm E12 and the supported descaling procedure in the exact model manual."),
  "scope-bosch-e16": scope("Bosch US dishwasher support", "Bosch groups E16 and E17 on its US support index. No model-family compatibility is inferred."),
  "scope-bosch-e18": scope("Bosch US dishwasher support", "No model family is assigned. Confirm E18 for the exact dishwasher."),
  "scope-bosch-e22": scope("Bosch US dishwasher support", "Bosch groups E22 and E-22. The exact manual controls which filter or drain checks are user maintenance."),
  "scope-bosch-e25": scope("Bosch US dishwasher support", "Bosch groups E25 and E-25. No relationship to a specific model family is asserted."),

  "scope-siemens-e15": scope("Siemens Home Ireland dishwasher support", "Use Siemens support for the correct market and confirm E15 in the exact dishwasher manual."),
  "scope-siemens-e12": scope("Siemens Home Ireland dishwasher support", "No model family is assigned. Confirm E12 and descaling instructions in the exact manual."),
  "scope-siemens-e14": scope("Siemens Home Ireland dishwasher support", "This meaning is limited to the cited Siemens Ireland support page; other BSH documents must not be used to broaden it."),
  "scope-siemens-e16": scope("Siemens Home Ireland dishwasher support", "No model family is assigned. Confirm E16 in the exact model manual."),
  "scope-siemens-e18": scope("Siemens Home Ireland dishwasher support", "No model family is assigned. Confirm E18 in the exact model manual."),
  "scope-siemens-e22": scope("Siemens Home Ireland dishwasher support", "No model family is assigned. Use the exact model manual for filter removal and refitting."),
  "scope-siemens-e24": scope("Siemens Home Ireland dishwasher support", "The cited page groups E24 and E25. No F-code or model-family equivalence is inferred."),

  "scope-electrolux-i20": scope("Electrolux UK freestanding and integrated dishwasher support", "The aliases and signals are grouped by the cited article; confirm them in the exact model or PNC manual."),
  "scope-electrolux-i30": scope("Electrolux UK dishwasher support", "The signal grouping comes from the cited article; confirm it in the exact model or PNC manual."),
  "scope-electrolux-i10": scope("Electrolux UK freestanding and integrated dishwasher support", "The cited article explicitly groups the codes and one-beep/one-flash signals. Exact model compatibility is not inferred."),
  "scope-electrolux-i40": scope("Electrolux UK freestanding and integrated dishwasher support", "The cited article groups i40, i41, i43, i44, four beeps, and four flashes. Confirm the group for the exact PNC."),
  "scope-electrolux-if0": scope("Electrolux UK freestanding and integrated dishwasher support", "The cited article groups iF0, iFo, and iF1. Confirm the display in the exact model or PNC manual."),

  "scope-whirlpool-f8e4": scope("Whirlpool US dishwasher support", "Whirlpool says exact codes vary by model. Confirm F8E4 in the exact model manual."),
  "scope-whirlpool-f9e1": scope("Whirlpool US dishwasher support", "Whirlpool says exact codes vary by model. Confirm F9E1 in the exact model manual."),
  "scope-whirlpool-h2o": scope("Whirlpool US H2O dishwasher support", "The official H2O article provides general dishwasher guidance; exact model confirmation remains required."),

  "scope-samsung-4c": scope("Samsung UK dishwasher support", "The 4C/4E grouping is limited to the cited UK article. Confirm it in the exact model manual."),
  "scope-samsung-5c": scope("Samsung UK dishwasher support", "The 5C/5E grouping is limited to the cited UK article. Confirm it in the exact model manual."),
  "scope-samsung-lc": scope("Samsung UK dishwasher support", "The LC/LE grouping is limited to the cited UK article. Confirm it in the exact model manual."),
  "scope-samsung-oc": scope("Samsung Mexico dishwasher support", "The OC/0C/oE grouping and meaning are limited to the cited Mexico support article; no model family is assigned."),

  "scope-lg-ae": scope("LG USA dishwasher support", "LG says codes can differ by model. This record preserves LG's grouped AE/EI/FE/RE presentation without asserting exact-model compatibility."),
  "scope-lg-ie": scope("LG USA dishwasher support", "LG says codes can differ by model. Confirm IE in the exact model manual."),
  "scope-lg-oe": scope("LG USA dishwasher support", "LG says codes can differ by model. Confirm OE and filter-removal instructions in the exact model manual."),
};

export const phase1aGuides: Record<string, GuideTranslation> = {
  "guide-dishwasher-unusual-noise": {
    slug: "dishwasher-making-unusual-noise",
    title: "Safe checks for unusual dishwasher noises",
    steps: {
      "noise-identify-cycle-stage": { title: "Record when the noise happens", instruction: "Note whether the sound occurs during filling, washing, draining, or drying and compare it with the exact model manual. Water movement, a steady pump hum, and a detergent-dispenser click can be normal at the matching cycle stage." },
      "noise-secure-load": { title: "Reload items that can rattle or block a spray arm", instruction: "Switch the dishwasher off, secure lightweight items, separate dishes that touch, and reposition long utensils or handles that may contact a spray arm. Do not force a spray arm or remove internal parts." },
      "noise-check-user-maintenance": { title: "Check only user-maintainable parts", instruction: "Use the exact model manual to clean and refit its removable filter and inspect accessible spray-arm openings. Do not reach into a pump or remove panels to investigate a sound." },
      "noise-escalate": { title: "Escalate a persistent or off-cycle noise", instruction: "Arrange qualified service if the sound continues after loading and manual-approved maintenance, occurs while the appliance is switched off, or is accompanied by leaking, burning smells, or visible damage." },
    },
  },
  "guide-dishwasher-door-not-closing": {
    slug: "dishwasher-door-will-not-close",
    title: "Safe dishwasher door-closing checks",
    steps: {
      "door-remove-obstructions": { title: "Remove visible obstructions", instruction: "Check for an item between the door and cabinet, a utensil protruding from a rack, or debris around the opening. Remove only what is plainly accessible." },
      "door-seat-racks": { title: "Check both racks for protruding items", instruction: "Make sure both racks are fully seated and reload silverware, utensils, or large items that protrude beyond a rack and prevent the door from closing." },
      "door-visible-latch-check": { title: "Inspect the visible latch area without adjustment", instruction: "Look for an obvious obstruction or visible damage at the latch area. Do not bend, realign, dismantle, or force the latch." },
      "door-escalate": { title: "Use installation or service help for misalignment", instruction: "If the door is crooked, the latch or hinge appears damaged, or the basic checks do not resolve it, contact the installer or a qualified technician." },
    },
  },
  "guide-dishwasher-no-power": {
    slug: "dishwasher-has-no-power",
    title: "Safe dishwasher power-supply checks",
    steps: {
      "power-stop-for-damage": { title: "Stop for electrical warning signs", instruction: "Do not reset or continue if there is a burning smell, damaged wiring or plug, water near an electrical connection, or a breaker that trips repeatedly. Arrange qualified electrical or appliance service." },
      "power-check-accessible-supply": { title: "Check only the accessible supply", instruction: "If the dishwasher has an accessible plug, confirm it is fully inserted and that any ordinary wall switch controlling the outlet is on. Do not touch direct wiring or remove a panel." },
      "power-check-breaker-once": { title: "Check the household fuse or breaker", instruction: "Check the labelled household fuse or breaker once. If it trips again, leave it off and contact a qualified electrician or service technician rather than repeatedly resetting it." },
      "power-escalate": { title: "Arrange service when the supply is working", instruction: "If the accessible supply and household circuit work but the control panel remains dark, use manufacturer support or qualified service. Do not test internal wiring, controls, or power modules." },
    },
  },
  "guide-dishwasher-not-heating": {
    slug: "dishwasher-not-heating-water",
    title: "Safe dishwasher water-heating checks",
    steps: {
      "heat-check-program": { title: "Confirm the programme is appropriate", instruction: "Use the exact model manual to confirm that the selected programme suits the load and includes the expected wash and drying behaviour. A short programme may give different results." },
      "heat-clean-filter": { title: "Clean only the user-removable filter", instruction: "Switch the dishwasher off and use the exact manual to clean and refit its user-removable filter. Do not open the sump, heater area, or service panels." },
      "heat-check-foam": { title: "Check for excessive foam", instruction: "Visible foam can interfere with operation. Remove it using the excessive-foam guide and correct detergent use before reassessing the dishwasher." },
      "heat-escalate": { title: "Treat a persistent no-heat condition as a service issue", instruction: "Stop using the appliance and arrange qualified service if it remains cold or repeatedly reports a heating fault. Do not test the heater, temperature sensor, relays, wiring, or control board." },
    },
  },
  "guide-dishwasher-excessive-foam": {
    slug: "dishwasher-excessive-foam-suds",
    title: "Safe dishwasher foam and suds checks",
    steps: {
      "foam-stop-overflow": { title: "Stop a cycle if foam is escaping", instruction: "Stop the cycle and contain water or foam that has reached the floor. Keep clear of electrical connections and close the water supply if leaking cannot be controlled safely." },
      "foam-check-detergent": { title: "Check the detergent type and amount", instruction: "Use only detergent formulated for automatic dishwashers. Do not use hand-washing liquid, and compare the dose with the detergent packaging and exact model manual." },
      "foam-remove-visible": { title: "Remove accessible foam and spilled rinse aid", instruction: "With the appliance off, remove visible foam using a cup, sponge, or towels. Wipe up spilled rinse aid and make sure its cap is closed without dismantling the dispenser." },
      "foam-rinse-escalate": { title: "Run a detergent-free rinse, then escalate if needed", instruction: "When foam is contained, run a rinse-only cycle without detergent and repeat only if the manufacturer guidance allows it. Arrange service if foam persists or leaking returns." },
    },
  },
  "guide-dishwasher-smells": {
    slug: "dishwasher-smells-bad",
    title: "Safe dishwasher odour checks",
    steps: {
      "smell-stop-if-burning": { title: "Stop if the smell is burning or electrical", instruction: "Stop using the dishwasher if the odour is burning or is accompanied by damaged wiring or repeated breaker trips. Arrange qualified service rather than trying to locate an internal source." },
      "smell-clean-filter": { title: "Clean the user-removable filter", instruction: "Switch the appliance off and use the exact model manual to remove, rinse, and refit its user-removable filter. Trapped food and standing residue can cause odours." },
      "smell-clean-accessible-parts": { title: "Clean accessible interior surfaces", instruction: "Clean the accessible spray arms, door seals, and interior using only products and methods allowed by the exact manual. Do not mix cleaning products or access internal hoses and pumps." },
      "smell-check-drain-escalate": { title: "Check for standing water and escalate", instruction: "If water remains after a cycle, continue with the shared drainage guide. If the odour persists after manual-approved cleaning and normal drainage, contact manufacturer support or qualified service." },
    },
  },
};

export const phase1aSources: Record<string, SourceTranslation> = {
  "source-bosch-error-codes": { title: "Bosch dishwasher error codes", note: "Defines the approved Bosch Batch A signals, meanings, and manufacturer-recommended user checks on the US support site." },
  "source-bosch-smells": { title: "Dishwasher troubleshooting: dishwasher smells", note: "Supports manual-led filter and spray-arm cleaning for food and debris odours." },
  "source-electrolux-i40": { title: "Dishwasher displays i40, i41, i43, i44, four beeps, or four flashes", note: "Defines the grouped signals and supports reset, visible foam/debris, filter, and service guidance." },
  "source-electrolux-if0": { title: "Dishwasher displays iF0, iFo, or iF1", note: "Defines the grouped signals as a water-level problem and supports filter, visible foam/debris, and service guidance." },
  "source-electrolux-unusual-noise": { title: "Dishwasher is making unusual noises", note: "Supports distinguishing normal cycle sounds, correcting load or spray-arm contact, and service escalation." },
  "source-electrolux-door-not-close": { title: "Dishwasher door does not close", note: "Supports exact-manual and professional help when a door remains misaligned or will not close." },
  "source-electrolux-no-power": { title: "Dishwasher does not switch on; no control-panel light", note: "Supports external power-supply checks and professional service when the household supply works." },
  "source-electrolux-not-heating": { title: "Dishwasher is not heating up water", note: "Supports programme, user-maintainable filter, over-foaming, and service-only heater boundaries." },
  "source-electrolux-foam": { title: "Dishwasher over-foaming: causes and solutions", note: "Supports detergent, rinse-aid, visible foam removal, rinse-cycle, leak, and service boundaries." },
  "source-whirlpool-error-codes": { title: "Reading and understanding Whirlpool dishwasher error codes", note: "Defines F9E1 and states that exact codes vary by model." },
  "source-whirlpool-h2o": { title: "H2O dishwasher error code", note: "Defines H2O as not detecting water and supports water-supply and visible inlet-hose checks." },
  "source-whirlpool-normal-noise": { title: "Normal dishwasher sounds and noise", note: "Supports cycle-stage sounds, securing the load, and accessible maintenance distinctions." },
  "source-whirlpool-no-power": { title: "No power or not turning on: dishwasher", note: "Supports accessible plug, fuse, and circuit-breaker checks without reproducing wiring instructions." },
  "source-whirlpool-odors": { title: "Removing odours in a dishwasher", note: "Supports filter, accessible interior, standing-water, and regular maintenance guidance." },
  "source-whirlpool-door-not-close": { title: "Door will not close: dishwasher", note: "Supports checking for items around the seal, protruding rack items, visible latch damage, and service escalation." },
  "source-samsung-error-codes-mx": { title: "Samsung dishwasher error-code meanings", note: "The official Mexico article groups OC, 0C, and oE as a high-water-level condition often related to drainage." },
  "source-lg-error-codes": { title: "LG dishwasher guide to error codes", note: "Defines the approved LG Batch A clusters and explicitly says codes can differ by model." },
};
