import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { deviceCategories, manufacturers } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Browse devices",
  description:
    "Browse the household device categories currently covered by FixOrReplace.",
  path: "/devices",
});

export default function DevicesPage() {
  return (
    <main className="page-main" id="main-content">
      <div className="site-shell">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Devices" }]} />
        <header className="page-hero page-hero-compact">
          <span className="eyebrow">Device library</span>
          <h1>Browse troubleshooting by device</h1>
          <p>
            The MVP begins with one focused category. The same structure can
            support additional appliance and consumer-device categories later.
          </p>
        </header>
        <section className="section-block section-block-first">
          <div className="card-grid">
            {deviceCategories.map((category) => (
              <Link className="content-card category-card" href={`/${category.slug}`} key={category.id}>
                <div className="category-card-top">
                  <span className="device-monogram device-monogram-small" aria-hidden="true">DW</span>
                  <span className="badge badge-live">Available</span>
                </div>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <span className="muted-label">{manufacturers.length} manufacturer indexes</span>
                <span className="text-link">Browse category →</span>
              </Link>
            ))}
            <div className="content-card category-card category-card-disabled">
              <div className="category-card-top">
                <span className="device-monogram device-monogram-small" aria-hidden="true">+</span>
                <span className="badge badge-neutral">Later</span>
              </div>
              <h2>More device categories</h2>
              <p>
                The schema is ready to expand after the dishwasher content model
                and editorial workflow are validated.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
