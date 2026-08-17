import type { MetadataRoute } from "next";
import {
  errorCodes,
  getManufacturerById,
  isErrorCodeIndexable,
  isModelIndexable,
  isProblemIndexable,
  manufacturerHasIndexableContent,
  manufacturers,
  models,
  problems,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/devices", "/dishwashers"];
  const manufacturerRoutes = manufacturers
    .filter((manufacturer) => manufacturerHasIndexableContent(manufacturer.id))
    .map((manufacturer) => `/dishwashers/${manufacturer.slug}`);
  const modelRoutes = models.flatMap((model) => {
    const manufacturer = getManufacturerById(model.manufacturerId);
    return manufacturer && isModelIndexable(model)
      ? [`/dishwashers/${manufacturer.slug}/models/${model.slug}`]
      : [];
  });
  const problemRoutes = problems
    .filter(isProblemIndexable)
    .map((problem) => `/dishwashers/problems/${problem.slug}`);
  const errorCodeRoutes = errorCodes.flatMap((errorCode) => {
    const manufacturer = getManufacturerById(errorCode.manufacturerId);
    return manufacturer && isErrorCodeIndexable(errorCode)
      ? [`/dishwashers/${manufacturer.slug}/error-codes/${errorCode.slug}`]
      : [];
  });

  return [
    ...staticRoutes,
    ...manufacturerRoutes,
    ...modelRoutes,
    ...problemRoutes,
    ...errorCodeRoutes,
  ].map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/dishwashers" ? 0.9 : 0.7,
  }));
}
