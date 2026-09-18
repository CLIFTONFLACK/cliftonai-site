import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteUrl } from "../../../layout";
import { healthyOpenGraph } from "../../layout";
import {
  BuyButton,
  DraftBanner,
  FdaDisclaimer,
  GradeBadge,
  Pending,
  SupplementCard,
  supplementHref,
} from "../../components";
import { buyHref, costPerServing, getProduct, goals, products, supplementFor, supplements } from "../../data";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/healthy/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.brand} ${product.name} review`;
  return {
    title,
    description: product.summary,
    alternates: { canonical: `/healthy/products/${product.slug}` },
    openGraph: {
      ...healthyOpenGraph,
      title,
      description: product.summary,
      url: `/healthy/products/${product.slug}`,
    },
  };
}

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="font-heading text-2xl font-semibold text-brand-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ProductPage(props: PageProps<"/healthy/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const perServing = costPerServing(product);
  const supplement = supplementFor(product);
  const jobs = supplement ? goals.filter((g) => g.supplement === supplement.id) : [];
  const others = supplements.filter((s) => s.id !== supplement?.id);

  // No rating or review markup: we have no real ratings, and Google treats
  // invented ones as spam.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`,
    brand: { "@type": "Brand", name: product.brand },
    description: product.summary,
    url: `${siteUrl}/healthy/products/${product.slug}`,
  };

  return (
    <article className="px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        // Built from our own data file only, and "<" is escaped so no value can close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-base">
          <Link href="/healthy#picks" className="text-brand-navy-bright underline underline-offset-4">
            All picks
          </Link>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="min-w-0 space-y-10">
            {!product.verified && <DraftBanner />}

            <header>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
                {product.category} &middot; {product.format}
              </p>
              <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-brand-navy text-balance sm:text-5xl">
                {product.brand} {product.name}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-fg-muted text-pretty">{product.verdict}</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-bg-tint p-6">
                <h2 className="font-heading text-xl font-semibold text-brand-navy">Best for</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-fg-muted">
                  {product.bestFor.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl bg-bg-panel p-6">
                <h2 className="font-heading text-xl font-semibold text-brand-navy">Not for</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-fg-muted">
                  {product.notFor.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>

            {supplement && (
              <Section title="Where it fits in the program">
                <SupplementCard supplement={supplement} currentHref={`/healthy/products/${product.slug}`} />
                <div className="mt-6 rounded-2xl bg-bg-tint p-6">
                  <h3 className="font-heading text-lg font-semibold text-brand-navy">The rest of the program</h3>
                  <p className="mt-2 leading-relaxed text-fg-muted">
                    Each supplement covers a different job. You only need the ones that match your goals.
                  </p>
                  <ul className="mt-4 space-y-3">
                    {others.map((o) => {
                      const href = supplementHref(o);
                      const hook = goals.find((g) => g.supplement === o.id);
                      return (
                        <li key={o.id} className="leading-relaxed">
                          <strong className="font-semibold text-fg">{hook?.label ?? o.name}:</strong>{" "}
                          <span className="text-fg-muted">{hook?.hook ?? o.contribution}</span>{" "}
                          {href ? (
                            <Link href={href} className="font-semibold text-brand-navy-bright underline underline-offset-4">
                              {o.name}
                            </Link>
                          ) : (
                            <span className="text-fg-subtle">({o.name} review in progress)</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Section>
            )}

            <Section title="What is in it">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left">
                  <thead>
                    <tr className="border-b border-border-strong text-base text-fg">
                      <th scope="col" className="py-3 pr-4 font-semibold">Ingredient</th>
                      <th scope="col" className="py-3 pr-4 font-semibold">Per serving</th>
                      <th scope="col" className="py-3 font-semibold">Dose used in research</th>
                    </tr>
                  </thead>
                  <tbody className="text-fg-muted">
                    {product.ingredients.map((ing) => (
                      <tr key={ing.name} className="border-b border-border">
                        <th scope="row" className="py-3 pr-4 font-medium text-fg">{ing.name}</th>
                        <td className="py-3 pr-4">{ing.amount ?? <Pending />}</td>
                        <td className="py-3">{ing.studiedDose ?? "Not established"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-fg-muted">
                Serving size: {product.servingSize ?? <Pending />}
              </p>
            </Section>

            <Section title="What the research says">
              <ul className="space-y-6">
                {product.evidence.map((ev) => (
                  <li key={ev.claim} className="rounded-2xl border border-border p-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-xl font-semibold text-fg">{ev.claim}</h3>
                      <GradeBadge grade={ev.grade} />
                    </div>
                    <p className="mt-3 leading-relaxed text-fg-muted">{ev.summary}</p>
                    {ev.citations.length > 0 ? (
                      <ul className="mt-3 space-y-1 text-base">
                        {ev.citations.map((c) => (
                          <li key={c.url}>
                            <a href={c.url} className="text-brand-navy-bright underline underline-offset-4" rel="noopener">
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-base"><Pending /> (citations)</p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-base text-fg-subtle">
                What the grades mean is explained in{" "}
                <Link href="/healthy/method" className="text-brand-navy-bright underline">how we choose</Link>.
              </p>
            </Section>

            <Section title="Quality and testing">
              {product.testing.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-fg-muted">
                  {product.testing.map((t) => <li key={t}>{t}</li>)}
                </ul>
              ) : (
                <p className="text-fg-muted"><Pending /></p>
              )}
              <p className="mt-4 text-base">
                <Link href="/healthy/why-these-picks" className="text-brand-navy-bright underline underline-offset-4">
                  See what the brand itself claims about this ingredient, and how Brian grades each claim
                </Link>
              </p>
            </Section>

            <Section title="Safety">
              <ul className="list-disc space-y-2 pl-5 text-fg-muted">
                {product.safety.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Section>

            <Section title="Pros and cons">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-fg">Pros</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-fg-muted">
                    {product.pros.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-fg">Cons</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-fg-muted">
                    {product.cons.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>
            </Section>

            <FdaDisclaimer />
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-border bg-bg p-6 shadow-[0_4px_28px_rgba(20,23,43,0.06)]">
              {jobs.length > 0 && (
                <p className="mb-5 border-b border-border pb-5 text-base text-fg-muted">
                  <span className="block text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
                    Its job in the program
                  </span>
                  {jobs.map((j) => (
                    <span key={j.id} className="mt-1 block font-heading text-lg font-semibold text-brand-navy">
                      {j.label}
                      {/* Focus never appears without its caveat, even here, far from the card on phones. */}
                      {supplement?.caveat && j.id === "focus" && (
                        <span className="block font-body text-sm font-normal text-fg-muted">
                          Promising, but not yet established
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              )}
              <h2 className="font-heading text-xl font-semibold text-brand-navy">Cost</h2>
              <dl className="mt-4 space-y-3 text-base">
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">Price</dt>
                  <dd className="text-right font-semibold text-fg">
                    {product.priceUsd !== null ? usd(product.priceUsd) : <Pending />}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">Servings</dt>
                  <dd className="text-right font-semibold text-fg">
                    {product.servingsPerContainer ?? <Pending />}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">Per serving</dt>
                  <dd className="text-right font-semibold text-fg">
                    {perServing !== null ? usd(perServing) : <Pending />}
                  </dd>
                </div>
              </dl>
              {product.priceCheckedAt && (
                <p className="mt-3 text-sm text-fg-subtle">
                  Price checked {product.priceCheckedAt}. Prices change; the retailer&apos;s page is current.
                </p>
              )}
              <div className="mt-6">
                <BuyButton product={product} from="product" />
              </div>
              <p className="mt-4 text-sm text-fg-subtle">
                Last reviewed: {product.lastReviewed ?? "not yet"}
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Compact purchase bar: same buyHref as the sidebar BuyButton, just reachable without
          scrolling back up on a phone. The sidebar keeps the full disclosure sentence; this bar
          links to it rather than repeating it in a strip this narrow. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">{product.brand} {product.name}</p>
            {product.priceUsd !== null && (
              <p className="text-sm text-fg-muted">
                {usd(product.priceUsd)}
                {perServing !== null && <span> &middot; {usd(perServing)}/serving</span>}
              </p>
            )}
          </div>
          <a
            href={buyHref(product, "product-mobile-bar")}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-brand-gold px-4 font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
          >
            Check price
          </a>
        </div>
        <Link href="/healthy/disclosures" className="mt-1 block text-xs text-fg-subtle underline underline-offset-2">
          May earn a commission &mdash; how that works
        </Link>
      </div>
      {/* Keeps the fixed bar from covering the FDA disclaimer / footer on small screens. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </article>
  );
}
