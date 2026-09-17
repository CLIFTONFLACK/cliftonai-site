import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LAUNCHED, PROGRAM_NAME } from "./data";

const description =
  "Brian's Human Longevity Program: supplement picks for adults over 40, chosen from the clinical research, checked label by label, and kept to a short list.";

/**
 * Next merges metadata one level deep, so a page that sets `openGraph` replaces
 * this whole object. Every page spreads it and adds its own title, description
 * and url, or shares lose the image and site name and point og:url at /healthy.
 */
export const healthyOpenGraph = {
  siteName: "GetBrian Healthy",
  type: "website",
  locale: "en_US",
  images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GetBrian" }],
} satisfies NonNullable<Metadata["openGraph"]>;

export const metadata: Metadata = {
  title: {
    default: `${PROGRAM_NAME} | GetBrian Healthy`,
    template: `%s | ${PROGRAM_NAME}`,
  },
  description,
  alternates: { canonical: "/healthy" },
  // Draft figures must not be indexed. See LAUNCHED in data.ts.
  robots: LAUNCHED ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { ...healthyOpenGraph, title: PROGRAM_NAME, description, url: "/healthy" },
};

const nav = [
  { href: "/healthy#picks", label: "Picks" },
  { href: "/healthy/method", label: "How we choose" },
  { href: "/healthy/compare/creatine", label: "Compare" },
  { href: "/healthy/about", label: "About" },
];

const linkClass =
  "inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-fg-muted transition-colors duration-200 hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright";

export default function HealthyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col text-[1.0625rem] sm:text-lg">
      {/* FTC guidance and iHerb's terms both want the disclosure up front, above the fold. */}
      <p className="bg-brand-navy px-4 py-2 text-center text-sm text-white">
        Brian may earn a commission when you buy through links on these pages.{" "}
        <Link href="/healthy/disclosures" className="underline underline-offset-2">
          How that works
        </Link>
      </p>

      <header className="border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/healthy"
            className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
          >
            <Image src="/brand/brian-mark-compact.svg" alt="" aria-hidden="true" width={38} height={30} />
            <span className="font-heading text-lg leading-tight font-semibold text-brand-navy">
              GetBrian <span className="text-brand-gold-deep">Healthy</span>
            </span>
          </Link>

          <nav aria-label="Healthy" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* No-JS disclosure menu for small screens. */}
          <details className="group relative md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg border border-border-strong px-4 font-medium text-brand-navy [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav
              aria-label="Healthy"
              className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-bg p-2 shadow-lg"
            >
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={`${linkClass} w-full`}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-bg-panel">
        <div className="mx-auto max-w-6xl px-4 py-10 text-base text-fg-muted sm:px-6">
          <p className="max-w-3xl leading-relaxed">
            General information only, not medical advice. Supplements are not a substitute for a
            varied diet or for care from your doctor. Statements about supplements have not been
            evaluated by the Food and Drug Administration.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1">
            <li>
              <Link href="/healthy/disclosures" className={linkClass}>
                Disclosures
              </Link>
            </li>
            <li>
              <Link href="/healthy/about" className={linkClass}>
                About and contact
              </Link>
            </li>
            <li>
              <Link href="/" className={linkClass}>
                GetBrian home
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-sm text-fg-subtle">
            &copy; {new Date().getFullYear()} GetBrian. An independent project, not affiliated with
            Human Longevity, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
