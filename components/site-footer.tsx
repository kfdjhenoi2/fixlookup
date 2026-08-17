import Link from "next/link";
import type { DeviceCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";
import { siteConfig } from "@/lib/site";

export function SiteFooter({
  locale,
  category,
  messages,
}: {
  locale: Locale;
  category: DeviceCategory;
  messages: Record<string, string>;
}) {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <Link className="brand footer-brand" href={paths.home(locale)}>
            <span className="brand-mark" aria-hidden="true">F/L</span>
            <span>{siteConfig.name}</span>
          </Link>
          <p className="footer-note">{messages.footerNote}</p>
        </div>
        <nav className="footer-links" aria-label={messages.footerNavigation}>
          <Link href={paths.devices(locale)}>{messages.footerBrowseDevices}</Link>
          <Link href={paths.category(locale, category)}>{messages.navDishwashers}</Link>
          <Link href={paths.troubleshooter(locale, category)}>{messages.footerTryFramework}</Link>
          <Link href={paths.about(locale)}>{messages.footerAbout}</Link>
          <Link href={paths.editorial(locale)}>{messages.footerEditorial}</Link>
          <Link href={paths.safety(locale)}>{messages.footerSafety}</Link>
          <Link href={paths.contact(locale)}>{messages.footerContact}</Link>
        </nav>
        <div className="footer-status">
          <span className="status-dot" aria-hidden="true" />
          {messages.footerStatus}
        </div>
      </div>
    </footer>
  );
}
