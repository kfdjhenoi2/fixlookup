import { sendGAEvent } from "@next/third-parties/google";

type SearchResultType = "device" | "manufacturer" | "model" | "problem" | "errorCode";

export interface AnalyticsEventMap {
  search_performed: {
    interaction: "submit" | "result_click";
    locale: string;
    query_length: number;
    result_count: number;
    result_type?: SearchResultType;
  };
  zero_result_search: {
    locale: string;
    query_length: number;
  };
  troubleshooter_started: {
    category_id: string;
    locale: string;
  };
  troubleshooter_completed: {
    category_id: string;
    locale: string;
    outcome_id: string;
    safety_level: "user-safe" | "caution" | "professional-only";
    step_count: number;
  };
  problem_solved: {
    problem_id: string;
    confirmation_method: "explicit_user_confirmation";
  };
  source_clicked: {
    source_domain: string;
    source_id: string;
    source_type: string;
  };
  affiliate_click: {
    destination_domain: string;
    partner_id: string;
    placement: string;
  };
}

declare global {
  interface Window {
    __fixlookupAnalyticsEnabled?: boolean;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent<EventName extends keyof AnalyticsEventMap>(
  eventName: EventName,
  parameters: AnalyticsEventMap[EventName],
) {
  if (typeof window === "undefined" || window.__fixlookupAnalyticsEnabled !== true) return false;
  const pagePath = window.location.pathname;
  sendGAEvent("event", eventName, {
    ...parameters,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    page_title: document.title,
  });
  return true;
}
