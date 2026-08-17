"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getLocaleContent } from "@/lib/i18n";
import { defaultLocale, isSupportedLocale } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";

export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && isSupportedLocale(params.locale) ? params.locale : defaultLocale;
  const messages = getLocaleContent(locale).ui;
  return (
    <main className="page-main" id="main-content">
      <div className="site-shell empty-state empty-state-wide">
        <span className="empty-state-code">404</span>
        <div>
          <h1>{messages.notFoundTitle}</h1><p>{messages.notFoundBody}</p>
          <div className="recovery-actions">
            <Link className="button-primary" href={paths.home(locale)}>{messages.notFoundHome}</Link>
            <Link className="button-secondary" href={paths.devices(locale)}>{messages.notFoundDevices}</Link>
            <Link className="button-quiet" href={`${paths.home(locale)}#search`}>{messages.notFoundSearch}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
