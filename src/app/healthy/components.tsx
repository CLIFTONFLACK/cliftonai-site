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
  topGrade,
  type EvidenceGrade,
  type GoalAccent,
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
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-bold text-white shadow-[0_4px_14px_rgba(217,119,6,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-600 hover:to-amber-700 hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-electric"
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
    strong: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    moderate: "bg-blue-100 text-blue-800 border border-blue-200",
    early: "bg-amber-100 text-amber-900 border border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${tone[grade]}`}
      title={gradeLabels[grade].meaning}
    >
      <span className="material-symbols-outlined text-[15px]">verified</span>
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
export function FdaDisclaimer({ dark = false }: { dark?: boolean } = {}) {
  const toneClass = dark
    ? "border-slate-800 bg-slate-900/90 text-slate-400"
    : "border-border bg-bg-panel text-fg-muted";
  return (
    <p className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${toneClass}`} data-fda-disclaimer>
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
  const grade = topGrade(product);
  const gradeRibbonTone: Record<EvidenceGrade, string> = {
    strong: "bg-emerald-600",
    moderate: "bg-kinetic-primary-electric",
    early: "bg-amber-600",
  };
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {product.image && (
        <div className="relative flex min-h-[220px] items-center justify-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-slate-100/70 p-6">
          {grade && (
            <span
              className={`absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-extrabold tracking-wide text-white shadow-sm ${gradeRibbonTone[grade]}`}
            >
              <span className="material-symbols-outlined text-[15px]">verified</span>
              {gradeLabels[grade].label}
            </span>
          )}
          <div className="relative h-40 w-40">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 768px) 33vw, 90vw"
              className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-1.5 block text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
          {product.category}
          {role && <span className="font-medium normal-case text-slate-400"> &middot; {role}</span>}
        </span>
        <h3 className="font-kinetic-heading text-xl font-bold tracking-tight text-slate-950">
          <Link href={`/healthy/products/${product.slug}`} className="hover:underline">
            {product.brand} {product.name}
          </Link>
        </h3>
        <p className="mb-4 text-xs font-semibold text-slate-500">{product.format}</p>

        <div className="mb-4 flex items-baseline gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
          {product.priceUsd !== null ? (
            <span className="font-kinetic-heading text-2xl font-extrabold text-slate-950">{usd(product.priceUsd)}</span>
          ) : (
            <Pending />
          )}
          {perServing !== null && (
            <span className="text-xs font-semibold text-slate-500">({usd(perServing)}/serving)</span>
          )}
        </div>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-700">{product.summary}</p>

        <dl className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-xs">
          {product.pros[0] && (
            <div className="flex items-start gap-2">
              <dt className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">Why</dt>
              <dd className="font-medium text-slate-700">{product.pros[0]}</dd>
            </div>
          )}
          {product.cons[0] && (
            <>
              <div className="h-px w-full bg-slate-200" />
              <div className="flex items-start gap-2">
                <dt className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800 uppercase">Drawback</dt>
                <dd className="font-medium text-slate-700">{product.cons[0]}</dd>
              </div>
            </>
          )}
        </dl>

        <div className="mt-5">
          <BuyButton product={product} from="picks" />
        </div>
        <Link
          href={`/healthy/products/${product.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-kinetic-primary hover:text-kinetic-amber-hover"
        >
          Read the full review
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
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

const GOAL_ACCENT_CHIP: Record<GoalAccent, string> = {
  amber: "bg-amber-500/90",
  primary: "bg-kinetic-primary-electric/90",
  purple: "bg-purple-600/90",
  cyan: "bg-cyan-600/90",
};

const GOAL_ACCENT_TEXT: Record<GoalAccent, string> = {
  amber: "text-amber-400 group-hover:text-amber-200",
  primary: "text-blue-400 group-hover:text-blue-200",
  purple: "text-purple-300 group-hover:text-purple-200",
  cyan: "text-cyan-300 group-hover:text-cyan-200",
};

/** "What do you want more of?" Each tile links straight to that goal's review. */
export function GoalChooser() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => {
        const s = getSupplement(goal.supplement);
        const href = supplementHref(s) ?? `#${s.id}`;
        return (
          <li key={goal.id}>
            <Link
              href={href}
              className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kinetic-primary-electric"
            >
              <Image
                src={goal.image}
                alt={goal.imageAlt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
                className="absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="relative z-10">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm backdrop-blur-md ${GOAL_ACCENT_CHIP[goal.accent]}`}>
                  <span className="material-symbols-outlined text-[20px]">{goal.icon}</span>
                </div>
                <span className={`mb-1 block text-[11px] font-extrabold tracking-wider uppercase ${GOAL_ACCENT_TEXT[goal.accent]}`}>
                  {s.name} &middot; {goal.eyebrowDetail}
                </span>
                <span className="mb-2 block font-kinetic-heading text-xl font-bold leading-tight text-white">{goal.label}</span>
                <p className="mb-4 text-sm leading-relaxed text-slate-300">{goal.hook}</p>
                <span className={`inline-flex items-center text-xs font-bold uppercase tracking-wider transition-colors ${GOAL_ACCENT_TEXT[goal.accent]}`}>
                  {s.name} Review
                  <span className="material-symbols-outlined ml-1 text-[16px] transition-transform group-hover:translate-x-1.5">arrow_forward</span>
                </span>
              </div>
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
