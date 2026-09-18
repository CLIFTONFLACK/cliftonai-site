import Image from "next/image";
import Link from "next/link";
import {
  buyHref,
  costPerServing,
  getSupplement,
  goals,
  gradeLabels,
  products,
  supplementFor,
  type EvidenceGrade,
  type Product,
  type Supplement,
} from "./data";

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

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
  const perServing = costPerServing(product);
  const role = supplementFor(product)?.role;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-bg p-6 shadow-[0_4px_28px_rgba(20,23,43,0.06)] transition-colors duration-200 hover:border-brand-navy-bright/40">
      {product.image && (
        <div className="relative -mx-6 -mt-6 mb-2 aspect-[4/3] overflow-hidden rounded-t-2xl bg-bg-tint">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 768px) 33vw, 90vw"
            className="object-contain p-6"
          />
        </div>
      )}
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
        {product.category}
        {role && <span className="font-normal normal-case text-fg-subtle"> &middot; {role}</span>}
      </p>
      <h3 className="mt-2 font-heading text-2xl font-semibold text-brand-navy">
        <Link href={`/healthy/products/${product.slug}`} className="hover:underline">
          {product.brand} {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-base text-fg-subtle">{product.format}</p>

      <div className="mt-4 flex items-baseline gap-2">
        {product.priceUsd !== null ? (
          <span className="text-2xl font-semibold text-fg">{usd(product.priceUsd)}</span>
        ) : (
          <Pending />
        )}
        {perServing !== null && (
          <span className="text-sm text-fg-subtle">({usd(perServing)}/serving)</span>
        )}
      </div>

      <p className="mt-4 leading-relaxed text-fg-muted">{product.summary}</p>

      <dl className="mt-4 space-y-2 border-t border-dashed border-border pt-4 text-sm">
        {product.pros[0] && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-brand-navy-soft">Why:</dt>
            <dd className="text-fg-muted">{product.pros[0]}</dd>
          </div>
        )}
        {product.cons[0] && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold text-fg-subtle">Drawback:</dt>
            <dd className="text-fg-muted">{product.cons[0]}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6">
        <BuyButton product={product} from="picks" />
      </div>
      <Link
        href={`/healthy/products/${product.slug}`}
        className="mt-4 font-semibold text-brand-navy-bright underline underline-offset-4"
      >
        Read the full review &rarr;
      </Link>
    </article>
  );
}

/**
 * Where a supplement's review lives: its product page once a pick exists,
 * nothing yet when there is none. The program keeps one pick per category on
 * purpose (see "How we choose"), so there is no separate comparison route.
 */
export function supplementHref(s: Supplement): string | null {
  const picks = products.filter((p) => p.category === s.category);
  return picks.length >= 1 ? `/healthy/products/${picks[0].slug}` : null;
}

/** "What do you want more of?" Each tile links straight to that goal's review. */
export function GoalChooser() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => {
        const s = getSupplement(goal.supplement);
        const href = supplementHref(s) ?? `#${s.id}`;
        return (
          <li key={goal.id}>
            <Link
              href={href}
              className="flex h-full min-h-44 flex-col rounded-2xl border border-border bg-bg p-6 transition-colors duration-200 hover:border-brand-navy-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
            >
              <span className="font-heading text-xl font-semibold text-brand-navy">{goal.label}</span>
              <span className="mt-3 flex-1 leading-relaxed text-fg-muted">{goal.hook}</span>
              <span className="mt-4 font-semibold text-brand-navy-bright">{s.name} &rarr;</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SupplementCard({
  supplement,
  headingLevel = 3,
  currentHref,
}: {
  supplement: Supplement;
  headingLevel?: 2 | 3;
  /** The page this card sits on. Its link is dropped rather than pointing back at the same page. */
  currentHref?: string;
}) {
  const href = supplementHref(supplement);
  const isSelf = href !== null && href === currentHref;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article id={supplement.id} className="flex h-full scroll-mt-6 flex-col rounded-2xl border border-border bg-bg p-6">
      <Heading className="font-heading text-2xl font-semibold text-brand-navy">{supplement.name}</Heading>
      <dl className="mt-4 flex-1 space-y-4">
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">Primary role</dt>
          <dd className="mt-1 font-medium text-fg">{supplement.role}</dd>
        </div>
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
            Contribution to healthy aging
          </dt>
          <dd className="mt-1 leading-relaxed text-fg-muted">{supplement.contribution}</dd>
          {supplement.caveat && (
            <dd className="mt-2 rounded-lg bg-bg-panel px-3 py-2 text-base leading-relaxed text-fg-muted">
              <strong className="font-semibold text-fg">Honest caveat:</strong> {supplement.caveat}
            </dd>
          )}
        </div>
      </dl>
      {isSelf ? null : href ? (
        <a
          href={href}
          className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand-navy-bright underline underline-offset-4"
        >
          Read the {supplement.name.toLowerCase()} review
        </a>
      ) : (
        <p className="mt-6 text-base text-fg-subtle">Brian&apos;s review is in progress.</p>
      )}
    </article>
  );
}
