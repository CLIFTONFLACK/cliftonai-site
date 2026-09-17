import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "./components";
import { PROGRAM_NAME, pillars, products } from "./data";

export const metadata: Metadata = {
  title: { absolute: `${PROGRAM_NAME} | GetBrian Healthy` },
  alternates: { canonical: "/healthy" },
};

export default function HealthyHome() {
  return (
    <>
      <section className="bg-bg-tint px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
            GetBrian Healthy
          </p>
          <h1 className="mt-3 max-w-4xl font-heading text-4xl font-semibold tracking-tight text-brand-navy text-balance sm:text-6xl">
            {PROGRAM_NAME}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-fg-muted text-pretty">
            Straight answers on which supplements are worth your money after 40. Brian starts with
            the clinical research, checks every label against it, and recommends only what holds
            up. Right now that is three products.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#picks"
              className="inline-flex min-h-12 items-center rounded-xl bg-brand-navy px-6 font-semibold text-white transition-colors duration-200 hover:bg-brand-navy-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
            >
              See the picks
            </Link>
            <Link
              href="/healthy/method"
              className="inline-flex min-h-12 items-center rounded-xl border border-border-strong bg-bg px-6 font-semibold text-brand-navy transition-colors duration-200 hover:border-brand-navy-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright"
            >
              How we choose
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="method-heading" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="method-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            Three steps before anything makes the list
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <li key={pillar.title} className="rounded-2xl border border-border bg-bg p-6">
                <p className="font-heading text-sm font-semibold text-brand-gold-deep">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-brand-navy">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-fg-muted">{pillar.description}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8">
            <Link href="/healthy/method" className="font-semibold text-brand-navy-bright underline underline-offset-4">
              Read the full method
            </Link>
          </p>
        </div>
      </section>

      <section id="picks" aria-labelledby="picks-heading" className="bg-bg-panel px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="picks-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            Current picks
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            Two ways to take creatine, the most studied supplement for strength as you age, and one
            magnesium. Each review shows the evidence grade, the dose, the cost per serving and who
            should skip it.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
