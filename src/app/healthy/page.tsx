import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FdaDisclaimer, GoalChooser, ProductCard } from "./components";
import { PROGRAM_NAME, TAGLINE, TRIO_INTRO, faqs, pillars, products, supplements } from "./data";

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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from our own data file only, and "<" is escaped so no value can close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="bg-bg-tint px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
              {PROGRAM_NAME} &middot; supplement guides for adults 40 and up
            </p>
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-semibold tracking-tight text-brand-navy text-balance sm:text-5xl">
              {TAGLINE}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-fg-muted text-pretty">
              Three supplements, one clear job each. Brian grades the evidence honestly, so you can
              see where it's strong and where it isn't.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#start" className={primaryCta}>
                Find where to start
              </Link>
              <Link href="#picks" className={secondaryCta}>
                See the picks
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[16/10] overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(10,29,59,0.35)] sm:block">
            <Image
              src="/healthy/hero-couple.jpg"
              alt="A couple in their fifties hiking a coastal trail at sunrise, representing an active, well-researched approach to aging"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="trio-heading" className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/healthy/trio-lifestyle.jpg"
              alt="Green tea, a glass of water and a dumbbell laid out on a sunlit terrace table"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">
              {TRIO_INTRO.eyebrow}
            </p>
            <h2 id="trio-heading" className="mt-2 font-heading text-2xl font-semibold text-brand-navy text-balance sm:text-3xl">
              {TRIO_INTRO.headline}
            </h2>
            <p className="mt-3 leading-relaxed text-fg-muted">{TRIO_INTRO.body}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {supplements.map((s) => (
                <li key={s.id} className="rounded-xl bg-bg-tint p-4">
                  <p className="font-heading font-semibold text-brand-navy">{s.tagline}</p>
                  <p className="mt-1 text-sm leading-relaxed text-fg-muted">{s.value}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-fg-subtle">{TRIO_INTRO.disclaimer}</p>
          </div>
        </div>
      </section>

      <section id="start" aria-labelledby="start-heading" className="scroll-mt-6 bg-bg-panel px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 id="start-heading" className="font-heading text-2xl font-semibold text-brand-navy sm:text-3xl">
            What do you want more of?
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
            Pick the one that matters most right now. Each answer links straight to that review.
          </p>
          <div className="mt-8">
            <GoalChooser />
          </div>
        </div>
      </section>

      <section id="picks" aria-labelledby="picks-heading" className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 id="picks-heading" className="font-heading text-2xl font-semibold text-brand-navy sm:text-3xl">
            Current picks
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
            One pick per job. Price, cost per serving, why it's the pick and its drawback, right on
            the card.
          </p>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="why-heading" className="bg-bg-panel px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="why-heading" className="font-heading text-2xl font-semibold text-brand-navy sm:text-3xl">
            Why these picks
          </h2>
          <p className="mt-3 leading-relaxed text-fg-muted">
            Every pick is graded on the ingredient first, the label second. See the brand's own
            claims next to the independent evidence, and the named alternatives each pick beat.
          </p>
          <Link
            href="/healthy/why-these-picks"
            className="mt-5 inline-flex font-semibold text-brand-navy-bright underline underline-offset-4"
          >
            See the full comparison &rarr;
          </Link>
        </div>
      </section>

      <section aria-labelledby="method-heading" className="px-4 py-14 sm:px-6 sm:py-16">
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
            <h2 id="method-heading" className="font-heading text-2xl font-semibold text-brand-navy sm:text-3xl">
              Three steps before anything makes the list
            </h2>
            <ol className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className="rounded-2xl border border-border bg-bg p-6">
                  <p className="font-heading text-sm font-semibold text-brand-gold-deep">Step {i + 1}</p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-brand-navy">{pillar.title}</h3>
                  <p className="mt-3 leading-relaxed text-fg-muted">{pillar.description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 leading-relaxed text-fg-muted">
              Research is gathered with the help of AI tools, then checked and signed off by a
              person before anything publishes.{" "}
              <Link href="/healthy/about" className="font-semibold text-brand-navy-bright underline underline-offset-4">
                Read the full policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="bg-bg-panel px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-heading" className="font-heading text-2xl font-semibold text-brand-navy sm:text-3xl">
            Questions
          </h2>
          <dl className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-border bg-bg p-5">
                <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-brand-navy marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {f.question}
                    <span aria-hidden="true" className="text-brand-gold-deep group-open:rotate-45 transition-transform duration-200">
                      +
                    </span>
                  </span>
                </summary>
                <dd className="mt-3 leading-relaxed text-fg-muted">{f.answer}</dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="close-heading" className="bg-brand-navy px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="close-heading" className="font-heading text-2xl font-semibold text-white text-balance sm:text-3xl">
            Ready? Pick the one that matches your goal.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            One job, not a cabinet full of bottles. Check with your doctor first if you take
            medication.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="#start" className="inline-flex min-h-12 items-center rounded-xl bg-brand-gold px-6 font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-light">
              Find where to start
            </Link>
            <Link href="/healthy/disclosures" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-6 font-semibold text-white transition-colors duration-200 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              How we earn money
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
