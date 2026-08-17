import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href="/" aria-label="FixOrReplace home">
          <span className="brand-mark" aria-hidden="true">
            F/R
          </span>
          <span>FixOrReplace</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary navigation">
          <Link href="/devices">Devices</Link>
          <Link href="/dishwashers">Dishwashers</Link>
          <Link className="nav-action" href="/dishwashers/troubleshooter">
            Troubleshooter
          </Link>
        </nav>
      </div>
    </header>
  );
}
