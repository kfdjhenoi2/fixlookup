import Link from "next/link";
import type { DeviceCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { paths } from "@/lib/i18n/routing";

export function SiteHeader({
  locale,
  category,
  messages,
}: {
  locale: Locale;
  category: DeviceCategory;
  messages: Record<string, string>;
}) {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href={paths.home(locale)} aria-label={messages.homeAria}>
          <span className="brand-mark" aria-hidden="true">F/R</span>
          <span>FixOrReplace</span>
        </Link>
        <nav className="primary-nav" aria-label={messages.primaryNavigation}>
          <Link href={paths.devices(locale)}>{messages.navDevices}</Link>
          <Link href={paths.category(locale, category)}>{messages.navDishwashers}</Link>
          <Link className="nav-action" href={paths.troubleshooter(locale, category)}>
            {messages.navTroubleshooter}
          </Link>
        </nav>
      </div>
    </header>
  );
}
