import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SearchBox } from "@/components/search-box";
import { VerificationBadge } from "@/components/status-badge";
import {
  deviceCategories,
  manufacturers,
  problems,
  searchItems,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dishwasher troubleshooting",
  description:
    "Browse source-reviewed dishwasher problem guides and manufacturer error-code records with claim-level references.",
  path: "/dishwashers",
});

export default function DishwashersPage() {
  const category = deviceCategories[0];

  return (
    <main className="page-main" id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Dishwasher troubleshooting",
          url: absoluteUrl("/dishwashers"),
          description: category.description,
        }}
      />
      <div className="site-shell">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Devices", href: "/devices" },
            { label: "Dishwashers" },
          ]}
        />
        <header className="category-hero">
          <div>
            <span className="eyebrow">Device category</span>
            <h1>Dishwasher troubleshooting</h1>
            <p>
              Search source-reviewed symptom guides and manufacturer error-code
              records, or begin with the name on your appliance.
            </p>
          </div>
          <div className="category-code" aria-hidden="true">DW / 01</div>
        </header>
        <SearchBox items={searchItems} compact />

        <section className="section-block" aria-labelledby="manufacturers-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Browse by manufacturer</span>
              <h2 id="manufacturers-heading">Choose the name on your appliance</h2>
            </div>
            <span className="section-note">{manufacturers.length} manufacturer indexes</span>
          </div>
          <div className="manufacturer-grid">
            {manufacturers.map((manufacturer, index) => (
              <Link href={`/dishwashers/${manufacturer.slug}`} key={manufacturer.id}>
                <span className="manufacturer-index">0{index + 1}</span>
                <strong>{manufacturer.name}</strong>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block" aria-labelledby="symptoms-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Browse by symptom</span>
              <h2 id="symptoms-heading">Shared troubleshooting guides</h2>
            </div>
            <span className="section-note">{problems.length} reviewed topics</span>
          </div>
          <div className="record-list">
            {problems.map((problem) => (
              <Link href={`/dishwashers/problems/${problem.slug}`} key={problem.id}>
                <div>
                  <VerificationBadge status={problem.verificationStatus} />
                  <h3>{problem.title}</h3>
                  <p>{problem.summary}</p>
                </div>
                <span className="record-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="framework-callout">
          <div>
            <span className="eyebrow eyebrow-light">Not sure where to begin?</span>
            <h2>Use the interactive framework.</h2>
            <p>
              It gathers identifiers, checks for safety concerns, and makes the
              evidence boundary explicit.
            </p>
          </div>
          <Link className="button-light" href="/dishwashers/troubleshooter">
            Start troubleshooting →
          </Link>
        </section>
      </div>
    </main>
  );
}
