import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { LAUNCHED, PROGRAM_NAME } from "./data";

/**
 * "Kinetic Longevity" type system, scoped to /healthy only — loaded here
 * rather than the root layout so the rest of the site keeps its own
 * Space Grotesk / DM Sans fonts untouched. Exposed as font-kinetic-heading /
 * font-kinetic-body Tailwind utilities via the matching entries in
 * globals.css's @theme block.
 */
const sora = Sora({
  variable: "--font-kinetic-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-kinetic-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const description =
  "Brian's Human Longevity Program for adults over 40: support your energy, strengthen your body, support your focus and find your calm, with supplement picks explained from the clinical research.";

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
  { href: "/healthy#picks", label: "3 Pillars" },
  { href: "/healthy/method", label: "How We Choose" },
  { href: "/healthy/about", label: "Research & About" },
];

const linkClass =
  "inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-fg-muted transition-colors duration-200 hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright";

export default function HealthyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${sora.variable} ${plusJakartaSans.variable} flex min-h-full flex-1 flex-col text-[1.0625rem] sm:text-lg`}
    >
      {/* Material Symbols Outlined, used only within /healthy markup. Next
          hoists this <link> into <head> automatically. */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* FTC guidance and iHerb's terms both want the disclosure up front, above the fold.
          The legal sentence and its link are unchanged from before this reskin. */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Brian may earn a commission when you buy through links on these pages.</span>
            <Link href="/healthy/disclosures" className="font-semibold text-white underline hover:text-amber-400">
              How that works
            </Link>
            <span className="text-slate-600">&middot;</span>
            <Link href="/healthy/method" className="font-semibold text-white underline hover:text-amber-400">
              Evidence-first pledge
            </Link>
          </div>
          <div className="hidden items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-300 lg:flex">
            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-0.5 text-emerald-300">
              <span className="material-symbols-outlined text-[13px]">verified</span> Peer-Reviewed Thresholds
            </span>
            <span className="inline-flex items-center gap-1 text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" /> Protocol Live 2026
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
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

          <Link
            href="/healthy#picks"
            className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(217,119,6,0.35)] transition-all hover:-translate-y-0.5 hover:from-amber-600 hover:to-amber-700 hover:shadow-[0_6px_20px_rgba(217,119,6,0.45)] sm:inline-flex"
          >
            Start Today
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

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

      <footer className="border-t border-border bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 py-10 text-base sm:px-6">
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-5">
            <span className="material-symbols-outlined mt-0.5 shrink-0 text-[22px] text-amber-400">shield</span>
            <div className="space-y-1">
              <p className="font-kinetic-heading text-xs font-extrabold uppercase tracking-wider text-white">
                Statutory disclaimers &amp; clinical context
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                General information only, not medical advice. Supplements are not a substitute for a
                varied diet or for care from your doctor. Statements about supplements have not been
                evaluated by the Food and Drug Administration.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-center">
            <div className="space-y-1">
              <span className="font-kinetic-heading text-xl font-extrabold text-white">GetBrian Healthy</span>
              <p className="text-sm text-slate-400">An independent, evidence-first review of longevity supplements.</p>
            </div>
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/healthy/disclosures" className={`${linkClass} text-slate-300! hover:text-white!`}>
                  Disclosures
                </Link>
              </li>
              <li>
                <Link href="/healthy/about" className={`${linkClass} text-slate-300! hover:text-white!`}>
                  About and contact
                </Link>
              </li>
              <li>
                <Link href="/" className={`${linkClass} text-slate-300! hover:text-white!`}>
                  GetBrian home
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-slate-500 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} GetBrian. An independent project, not affiliated with
              Human Longevity, Inc.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>Re-checked every 6 months</span>
              <span className="text-slate-700">&middot;</span>
              <span className="text-emerald-400">0% brand sponsorship</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
