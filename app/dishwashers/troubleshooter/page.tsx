import { Breadcrumbs } from "@/components/breadcrumbs";
import { Troubleshooter } from "@/components/troubleshooter";
import { troubleshooterNodes } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Interactive dishwasher troubleshooter",
  description:
    "Try the FixOrReplace safety-first interactive troubleshooting framework.",
  path: "/dishwashers/troubleshooter",
  noIndex: true,
});

export default function TroubleshooterPage() {
  return (
    <main className="page-main troubleshooter-page" id="main-content">
      <div className="site-shell">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Dishwashers", href: "/dishwashers" },
            { label: "Troubleshooter" },
          ]}
        />
        <div className="troubleshooter-layout">
          <header className="troubleshooter-intro">
            <span className="eyebrow">Interactive framework</span>
            <h1>Get oriented before you act.</h1>
            <p>
              This framework branches by safety and evidence, then points toward
              reviewed guidance. It does not diagnose a device or suggest an
              internal repair.
            </p>
            <div className="trust-note">
              <span aria-hidden="true">i</span>
              <p>
                <strong>Scope boundary</strong>
                No model compatibility is assumed; confirm manufacturer guidance
                in the manual for the exact appliance.
              </p>
            </div>
          </header>
          <Troubleshooter nodes={troubleshooterNodes} />
        </div>
      </div>
    </main>
  );
}
