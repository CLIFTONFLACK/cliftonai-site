import Link from "next/link";
import { buyHref, gradeLabels, type EvidenceGrade, type Product } from "./data";

/** Shared reading column for prose pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-fg-muted [&_a]:text-brand-navy-bright [&_a]:underline [&_h2]:mt-12 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      {children}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">{eyebrow}</p>
      )}
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-brand-navy text-balance sm:text-5xl">
        {title}
      </h1>
      {lead && <p className="mt-5 text-xl leading-relaxed text-fg-muted text-pretty">{lead}</p>}
    </div>
  );
}

/**
 * Written out beside every Buy button, because FTC guidance expects the
 * disclosure where the endorsement is, not only in a footer.
 */
export const AFFILIATE_DISCLOSURE =
  "If you buy through this link, GetBrian may earn a commission at no extra cost to you. It never decides which products we pick.";

/**
 * The Buy button goes through our own /healthy/go redirect while it points at
 * a plain brand URL, so clicks are counted from day one. Once a programme
 * issues an affiliate link it goes direct, unless that programme's terms allow
 * redirects (see `usesRedirect` in data.ts).
 */
export function BuyButton({ product, from }: { product: Product; from: string }) {
  return (
    <div className="flex flex-col gap-3">
      <a
        href={buyHref(product, from)}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-gold px-6 py-3 font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
      >
        Check price at {product.retailer}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="text-sm leading-relaxed text-fg-subtle" data-affiliate-disclosure>
        {AFFILIATE_DISCLOSURE}
      </p>
    </div>
  );
}

export function GradeBadge({ grade }: { grade: EvidenceGrade }) {
  const tone: Record<EvidenceGrade, string> = {
    strong: "bg-brand-navy text-white",
    moderate: "bg-bg-tint text-brand-navy-soft",
    early: "bg-bg-panel text-fg-muted",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${tone[grade]}`}
      title={gradeLabels[grade].meaning}
    >
      {gradeLabels[grade].label}
    </span>
  );
}

/** Rendered wherever a figure is still `null` in data.ts. Never a guess. */
export function Pending() {
  return <span className="text-fg-subtle italic">Being verified</span>;
}

export function DraftBanner() {
  return (
    <div
      role="note"
      className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-5 py-4 text-base text-fg"
    >
      <strong className="font-semibold">Draft review.</strong> Label figures, prices and citations
      on this page are still being checked against the manufacturer and the published research.
    </div>
  );
}

/**
 * Required alongside structure/function statements on supplements (DSHEA,
 * 21 U.S.C. 343(r)(6)).
 */
export function FdaDisclaimer() {
  return (
    <p className="rounded-xl border border-border bg-bg-panel px-5 py-4 text-sm leading-relaxed text-fg-muted" data-fda-disclaimer>
      These statements have not been evaluated by the Food and Drug Administration. These
      products are not intended to diagnose, treat, cure, or prevent any disease. This page is
      general information, not medical advice. Talk to your doctor before starting a supplement,
      especially if you are pregnant, have a medical condition or take medication.
    </p>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-border bg-bg p-6 shadow-[0_4px_28px_rgba(20,23,43,0.06)] transition-colors duration-200 hover:border-brand-navy-bright/40">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
        {product.category}
      </p>
      <h3 className="mt-2 font-heading text-2xl font-semibold text-brand-navy">
        <Link
          href={`/healthy/products/${product.slug}`}
          className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
        >
          {product.brand} {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-base text-fg-subtle">{product.format}</p>
      <p className="mt-4 flex-1 leading-relaxed text-fg-muted">{product.summary}</p>
      <p className="mt-6 font-semibold text-brand-navy-bright">Read the full review &rarr;</p>
    </article>
  );
}
