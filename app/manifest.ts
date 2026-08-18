import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: "Look up dishwasher error codes, exact models, and common symptoms to find practical troubleshooting guidance.",
    start_url: "/en/",
    display: "standalone",
    background_color: "#f7f6f1",
    theme_color: "#092f2c",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
