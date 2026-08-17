"use client";

import type { ReactNode } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

export function TrackedSourceLink({
  children,
  href,
  sourceId,
  sourceType,
}: {
  children: ReactNode;
  href: string;
  sourceId: string;
  sourceType: string;
}) {
  function trackSourceClick() {
    trackAnalyticsEvent("source_clicked", {
      source_domain: new URL(href).hostname,
      source_id: sourceId,
      source_type: sourceType,
    });
  }

  return (
    <a href={href} rel="noreferrer" target="_blank" onClick={trackSourceClick}>
      {children}
    </a>
  );
}
