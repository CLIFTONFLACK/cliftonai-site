import Image from "next/image";
import { Clauses } from "./clauses";
import { Reveal } from "./reveal";
import { products, productCategories, type Product } from "./products-data";

/** Wordmark + divider + product suffix — the one lockup grammar for sub-brands. */
function ProductLockup({ product }: { product: Product }) {
  if (!product.shortName) {
    return (
      <h3 className="font-heading text-lg font-semibold text-fg">{product.name}</h3>
    );
  }
  return (
    <h3 className="flex items-baseline font-heading text-lg font-semibold text-fg">
      Brian
      <span
        aria-hidden="true"
        className="mx-2.5 inline-block h-[1em] w-0.5 self-center bg-brand-navy-bright"
      />
      <span className="font-medium tracking-tight text-fg-muted">
        {product.shortName}
      </span>
    </h3>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
      In development
    </span>
  );
}

/**
 * Screenshot plate. Aspect is locked to 16/9 to match what
 * scripts/gen-screenshots.mjs captures (header + hero, nothing of the section
 * below) — change one and you must change the other.
 *
 * The plate sits on the panel tint with its own inner border, so the captured
 * page reads as a separate object rather than bleeding into the card's own
 * white text block underneath.
 *
 * `fillHeight` is for ClientRow: its flex row stretches both columns to the
 * text column's height, so a fixed 16/9 box left the rest of the image
 * column as bare panel tint. At sm+ the aspect ratio is dropped in favor of
 * flex-1 filling the stretched parent, with object-cover doing the crop —
 * ProductCard's vertical stack has no such mismatch, so it keeps the plain
 * aspect box.
 */
function Screenshot({
  product,
  sizes,
  fillHeight = false,
}: {
  product: Product;
  sizes: string;
  fillHeight?: boolean;
}) {
  return (
    <div
      className={`border-b-2 border-border-strong bg-bg-panel ${fillHeight ? "flex flex-col sm:h-full" : ""}`}
    >
      {/* Chrome bar. The dots used to float loose over the screenshot, reading
          as an artefact; sitting them on a tinted strip makes the plate a
          window and gives the white text block below something to break
          against. */}
      <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
        <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
        <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
      </div>
      <div
        className={`relative aspect-[16/9] w-full overflow-hidden ${fillHeight ? "sm:aspect-auto sm:flex-1" : ""}`}
      >
        <Image
          src={product.screenshot}
          alt={`${product.name} product screenshot`}
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/**
 * The one call to action per card. Back to the glass treatment — the tinted
 * copy block behind it now supplies the separation the gold fill was doing.
 */
function VisitButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`glass glass-hover inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-bg px-5 text-sm font-semibold text-brand-navy-soft cursor-pointer ${className}`}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

/**
 * Own products: 2-up cards. The whole card used to be clickable and opened a
 * modal; both are gone. A single explicit link per card is the only thing that
 * navigates, which also means no nested-interactive markup and no keyboard trap.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={product.accent ? { borderTopColor: product.accent } : undefined}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl border-t-[3px]"
    >
      <Screenshot product={product} sizes="(max-width: 640px) 100vw, 50vw" />
      <div className="flex flex-1 flex-col bg-bg-tint p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <ProductLockup product={product} />
          {product.status === "in-development" && <StatusBadge />}
        </div>
        <p className="mt-1 text-xs font-medium tracking-wide text-brand-navy-soft uppercase">
          {product.tagline}
        </p>
        <p className="mt-3 text-base leading-relaxed text-fg">{product.hook}</p>
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-fg-muted">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-navy-soft" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-1 flex-wrap items-end gap-2">
          <VisitButton href={product.href}>
            See Brian&rsquo;s {product.shortName ?? product.name}
          </VisitButton>
        </div>
      </div>
    </div>
  );
}

/** Client work: case-study rows — their brand up front, our credit line. */
function ClientRow({ product }: { product: Product }) {
  return (
    <div className="glass group flex flex-col overflow-hidden rounded-2xl sm:flex-row">
      <div className="sm:w-72 sm:shrink-0 sm:border-r sm:border-border">
        <Screenshot
          product={product}
          sizes="(max-width: 640px) 100vw, 288px"
          fillHeight
        />
      </div>
      <div className="flex flex-1 flex-col bg-bg-tint p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-heading text-lg font-semibold text-fg">
            {product.name}
          </h3>
          {product.status === "in-development" && <StatusBadge />}
        </div>
        <p className="mt-1 text-xs font-medium tracking-wide text-brand-navy-soft uppercase">
          {product.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          {product.hook}
        </p>
        <div className="mt-5 flex flex-1 flex-wrap items-end justify-between gap-3">
          <span className="text-xs text-fg-subtle">
            Built by <span className="font-semibold text-fg-muted">Brian</span>
          </span>
          <VisitButton href={product.href}>Visit {product.name}</VisitButton>
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const selfCategory = productCategories.find((c) => c.key === "self")!;
  const clientCategory = productCategories.find((c) => c.key === "client")!;
  const selfProducts = products.filter((p) => p.category === "self");
  const clientProducts = products.filter((p) => p.category === "client");

  return (
    <section id="products" className="border-t border-border">
      {/* Own products — full inheritance, 2-up */}
      <div className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              <Clauses of={selfCategory.title} />
            </h2>
            <p className="mt-3 text-balance text-lg leading-relaxed text-fg-muted">
              {selfCategory.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {selfProducts.map((product, i) => (
              <Reveal key={product.name} delay={Math.min(i, 3) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Client work — endorsed, case-study rows on a panel band */}
      <div className="border-t border-border bg-bg-panel px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              <Clauses of={clientCategory.title} />
            </h2>
            <p className="mt-3 text-balance text-lg leading-relaxed text-fg-muted">
              {clientCategory.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {clientProducts.map((product, i) => (
              <Reveal key={product.name} delay={Math.min(i, 3) * 80}>
                <ClientRow product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
