import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              F/R
            </span>
            <span>FixOrReplace</span>
          </Link>
          <p className="footer-note">
            Structured troubleshooting built around sources, safety, and clear
            uncertainty.
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/devices">Browse devices</Link>
          <Link href="/dishwashers">Dishwashers</Link>
          <Link href="/dishwashers/troubleshooter">Try the framework</Link>
        </nav>
        <div className="footer-status">
          <span className="status-dot" aria-hidden="true" />
          MVP content is clearly marked as demo or pending review.
        </div>
      </div>
    </footer>
  );
}
