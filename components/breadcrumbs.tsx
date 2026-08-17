import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  ariaLabel,
  currentPath,
}: {
  items: BreadcrumbItem[];
  ariaLabel: string;
  currentPath: string;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absoluteUrl(item.href ?? currentPath),
          })),
        }}
      />
      <nav className="breadcrumbs" aria-label={ariaLabel}>
        <ol>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
