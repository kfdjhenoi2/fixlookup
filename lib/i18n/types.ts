import type {
  CategoryTranslation,
  ErrorCodeTranslation,
  GuideTranslation,
  ManufacturerTranslation,
  ModelFamilyTranslation,
  ModelTranslation,
  ProblemTranslation,
  SourceTranslation,
  TroubleshooterTranslation,
} from "../types";

export interface LocaleContent {
  routes: {
    devices: string;
    problems: string;
    models: string;
    troubleshooter: string;
    about: string;
    editorial: string;
    safety: string;
    privacy: string;
    contact: string;
  };
  categories: Record<string, CategoryTranslation>;
  manufacturers: Record<string, ManufacturerTranslation>;
  modelFamilies: Record<string, ModelFamilyTranslation>;
  models: Record<string, ModelTranslation>;
  problems: Record<string, ProblemTranslation>;
  errorCodes: Record<string, ErrorCodeTranslation>;
  guides: Record<string, GuideTranslation>;
  sources: Record<string, SourceTranslation>;
  troubleshooter: Record<string, TroubleshooterTranslation>;
  ui: Record<string, string>;
  pages: Record<string, Record<string, string>>;
  searchTypeLabels: Record<"device" | "manufacturer" | "model" | "problem" | "errorCode", string>;
  sourceTypeLabels: Record<string, string>;
  verificationLabels: Record<string, string>;
  safetyLabels: Record<string, string>;
}
