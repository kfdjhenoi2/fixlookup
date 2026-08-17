import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SearchBox } from "@/components/search-box";
import {
  deviceCategories,
  manufacturers,
  problems,
  searchItems,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function Home() {
  const dishwasher = deviceCategories[0];

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "FixOrReplace",
          url: absoluteUrl("/"),
          description:
            "Structured, source-aware troubleshooting for household appliances.",
        }}
      />

      <section className="hero-section">
        <div className="site-shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-light">
              Evidence before answers
            </span>
            <h1>Find the right next step — not another guess.</h1>
            <p>
              Search by device, manufacturer, model, symptom, or error code.
              FixOrReplace keeps sources, safety, and uncertainty visible.
            </p>
            <SearchBox items={searchItems} />
            <div className="search-examples" aria-label="Example searches">
              <span>Try:</span>
              <Link href="/dishwashers/bosch">Bosch dishwasher</Link>
              <Link href="/dishwashers/problems/demo-not-starting">
                demo symptom
              </Link>
              <Link href="/dishwashers/bosch/error-codes/demo-01">
                DEMO-01
              </Link>
            </div>
          </div>
          <aside className="hero-proof" aria-label="Quality commitments">
            <div className="proof-topline">
              <span className="signal-dot" aria-hidden="true" />
              Quality gates active
            </div>
            <div className="proof-stack">
              <div>
                <span className="proof-index">01</span>
                <div>
                  <strong>Sources stay attached</strong>
                  <p>Technical claims are traceable to a reference record.</p>
                </div>
              </div>
              <div>
                <span className="proof-index">02</span>
                <div>
                  <strong>Safety changes the path</strong>
                  <p>High-risk work stops at a professional handoff.</p>
                </div>
              </div>
              <div>
                <span className="proof-index">03</span>
                <div>
                  <strong>Unknown means unknown</strong>
                  <p>Demo and unverified records are clearly marked.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-block site-shell" aria-labelledby="browse-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Browse by device</span>
            <h2 id="browse-heading">Start with the appliance in front of you</h2>
          </div>
          <Link className="text-link" href="/devices">
            View all devices →
          </Link>
        </div>
        <div className="device-feature-card">
          <div className="device-monogram" aria-hidden="true">
            DW
          </div>
          <div className="device-feature-copy">
            <div className="card-badges">
              <span className="badge badge-live">MVP category</span>
              <span className="muted-label">{manufacturers.length} manufacturers</span>
            </div>
            <h3>{dishwasher.name}</h3>
            <p>{dishwasher.description}</p>
            <div className="brand-row" aria-label="Included manufacturers">
              {manufacturers.map((manufacturer) => (
                <span key={manufacturer.id}>{manufacturer.name}</span>
              ))}
            </div>
          </div>
          <Link className="button-primary" href="/dishwashers">
            Browse dishwashers <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section-block section-tint">
        <div className="site-shell split-section">
          <div className="split-intro">
            <span className="eyebrow">Built for the moment</span>
            <h2>A calm path when the appliance is not.</h2>
            <p>
              Use the troubleshooting framework beside the device. It collects
              the right context and stops before unsupported repair advice.
            </p>
            <Link className="button-primary" href="/dishwashers/troubleshooter">
              Start demo troubleshooter
            </Link>
          </div>
          <ol className="method-list">
            <li>
              <span>1</span>
              <div>
                <strong>Identify</strong>
                <p>Capture the exact device, model, and visible symptom.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Check the evidence</strong>
                <p>Match guidance to a reviewed primary source.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Take the safe next step</strong>
                <p>Follow user-level guidance or hand off to qualified help.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section-block site-shell" aria-labelledby="problem-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Template preview</span>
            <h2 id="problem-heading">Small, deliberate problem cluster</h2>
          </div>
          <span className="section-note">Demo content — not repair advice</span>
        </div>
        <div className="card-grid card-grid-two">
          {problems.map((problem, index) => (
            <Link
              className="content-card problem-card"
              href={`/dishwashers/problems/${problem.slug}`}
              key={problem.id}
            >
              <span className="card-number">0{index + 1}</span>
              <span className="badge badge-demo">Demo record</span>
              <h3>{problem.title}</h3>
              <p>{problem.summary}</p>
              <span className="text-link">View structured record →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
