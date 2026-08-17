import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Record not found",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="page-main" id="main-content">
      <div className="site-shell not-found">
        <span className="eyebrow">404 / Record not found</span>
        <h1>That troubleshooting record is not here.</h1>
        <p>
          It may not have been researched yet, or the device identifier may be
          different. Browse the current dishwasher index instead.
        </p>
        <Link className="button-primary" href="/dishwashers">
          Browse dishwashers
        </Link>
      </div>
    </main>
  );
}
