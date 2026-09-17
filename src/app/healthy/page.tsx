import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FdaDisclaimer, GoalChooser, ProductCard, SupplementCard } from "./components";
import { PROGRAM_NAME, TAGLINE, pillars, products, supplements } from "./data";

export const metadata: Metadata = {
  title: { absolute: `${PROGRAM_NAME} | GetBrian Healthy` },
  alternates: { canonical: "/healthy" },
  other: {
    "impact-site-verification": "76ada0e2-8897-4f30-b9ef-80aebec89d38",
  },
};

const primaryCta =
  "inline-flex min-h-12 items-center rounded-xl bg-brand-navy px-6 font-semibold text-white transition-colors duration-200 hover:bg-brand-navy-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright";
const secondaryCta =
  "inline-flex min-h-12 items-center rounded-xl border border-border-strong bg-bg px-6 font-semibold text-brand-navy transition-colors duration-200 hover:border-brand-navy-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy-bright";

export default function HealthyHome() {
  return (
    <>
      <section className="bg-bg-tint px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">{PROGRAM_NAME}</p>
            <p className="mt-4 max-w-xl font-heading text-lg font-semibold text-brand-navy-soft text-balance">
              Nobody hands you the research. Brian already read all of it, so you do not have to.
            </p>
            <h1 className="mt-3 max-w-4xl font-heading text-4xl font-semibold tracking-tight text-brand-navy text-balance sm:text-6xl">
              {TAGLINE}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-fg-muted text-pretty">
              Three supplements, each with one clear job, explained in plain English for adults over
              40. Brian starts with the clinical research and tells you where it is strong, and where
              it is not.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="#start" className={primaryCta}>
                Find where to start
              </Link>
              <Link href="#picks" className={secondaryCta}>
                See the picks
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(10,29,59,0.35)] lg:aspect-[3/4]">
            <Image
              src="/healthy/hero-longevity.jpg"
              alt="A healthy adult in her fifties on a coastal trail at golden hour, representing an active, well-researched approach to aging"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section id="picks" aria-labelledby="picks-heading" className="bg-bg-panel px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="picks-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            Current picks
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            One pick per job: magnesium, creatine and L-theanine, all from Thorne. Each review shows
            the evidence grade, the dose against what was studied, the cost per serving and who
            should skip it.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/healthy/thorne" className="font-semibold text-brand-navy-bright underline underline-offset-4">
              Why all three picks are Thorne, and the clinical reference behind them
            </Link>
          </p>
        </div>
      </section>

      <section id="start" aria-labelledby="start-heading" className="scroll-mt-6 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="start-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            What do you want more of?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            Pick the one that matters most to you right now. Each answer takes you to the supplement
            that does that job.
          </p>
          <div className="mt-10">
            <GoalChooser />
          </div>
        </div>
      </section>

      <section aria-labelledby="jobs-heading" className="bg-bg-panel px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 id="jobs-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
            Three supplements, three jobs
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-muted">
            Each one covers a different part of healthy aging. Take the one you need, not all three
            because a list says so.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {supplements.map((s) => (
              <li key={s.id}>
                <SupplementCard supplement={s} />
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl font-heading text-2xl font-semibold text-brand-navy text-balance">
            Together: {TAGLINE.charAt(0).toLowerCase() + TAGLINE.slice(1)}
          </p>
        </div>
      </section>

      <section aria-labelledby="method-heading" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-3xl lg:block">
            <Image
              src="/healthy/research-desk.jpg"
              alt="A desk with research papers, handwritten notes and reading glasses under warm lamp light"
              fill
              sizes="30vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 id="method-heading" className="font-heading text-3xl font-semibold text-brand-navy sm:text-4xl">
              Three steps before anything makes the list
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className="rounded-2xl border border-border bg-bg p-6">
                  <p className="font-heading text-sm font-semibold text-brand-gold-deep">Step {i + 1}</p>
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
        </div>
      </section>

      <section aria-labelledby="close-heading" className="bg-brand-navy px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="close-heading" className="font-heading text-3xl font-semibold text-white text-balance sm:text-4xl">
            You will probably wish you had started sooner. Today is a good day to.
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-white/85">
            Start with one job, not a cabinet full of bottles. Choose the goal that matters most,
            read the review, and check with your doctor if you take medication. That is the whole
            program.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#start"
              className="inline-flex min-h-12 items-center rounded-xl bg-brand-gold px-6 font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light"
            >
              Find where to start
            </Link>
          </div>
        </div>
      </section>

      <div className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <FdaDisclaimer />
        </div>
      </div>
    </>
  );
}
