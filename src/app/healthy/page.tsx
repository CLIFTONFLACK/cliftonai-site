import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FdaDisclaimer, GoalChooser, ProductCard, GradeBadge } from "./components";
import {
  PROGRAM_NAME,
  TAGLINE,
  TRIO_INTRO,
  faqs,
  pillars,
  products,
  supplements,
  topGrade,
  totalDailyCost,
} from "./data";

export const metadata: Metadata = {
  title: { absolute: `${PROGRAM_NAME} | GetBrian Healthy` },
  alternates: { canonical: "/healthy" },
  other: {
    "impact-site-verification": "76ada0e2-8897-4f30-b9ef-80aebec89d38",
  },
};

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const primaryCta =
  "inline-flex min-h-12 items-center rounded-xl bg-kinetic-primary px-6 py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(0,45,179,0.25)] transition-all hover:-translate-y-0.5 hover:bg-blue-900 hover:shadow-[0_12px_28px_rgba(0,45,179,0.35)]";
const secondaryCta =
  "inline-flex min-h-12 items-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-900 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50";

const PILLAR_TILE_TONE = ["bg-emerald-600", "bg-kinetic-primary-electric", "bg-indigo-600"];

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

  const dailyCost = totalDailyCost();

  // Splits TAGLINE once, right after " with ", to highlight its back half in
  // the hero. Falls back to the whole line with no highlight if TAGLINE ever
  // stops containing that phrase.
  const withSplit = TAGLINE.indexOf(" with ");
  const taglineLead = withSplit === -1 ? TAGLINE : TAGLINE.slice(0, withSplit + " with ".length);
  const taglineHighlight = withSplit === -1 ? "" : TAGLINE.slice(withSplit + " with ".length);

  return (
    <>
      <script
        type="application/ld+json"
        // Built from our own data file only, and "<" is escaped so no value can close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-10 pb-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#002db3 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col space-y-6 lg:col-span-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-200/80 bg-gradient-to-r from-kinetic-primary-light to-blue-50 px-3.5 py-1.5">
                <span className="h-2 w-2 animate-ping rounded-full bg-kinetic-primary-electric" aria-hidden="true" />
                <span className="text-xs font-bold tracking-wider text-kinetic-primary uppercase">
                  {PROGRAM_NAME} &middot; 40+ Protocol
                </span>
              </div>
              <h1 className="font-kinetic-heading text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[52px]">
                {taglineLead}
                {taglineHighlight && (
                  <span className="bg-gradient-to-r from-[#0033c9] via-kinetic-primary-electric to-blue-600 bg-clip-text text-transparent">
                    {taglineHighlight}
                  </span>
                )}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Three supplements, one clear job each. Brian grades the evidence honestly, so you can
                see exactly where it&apos;s strong and where it isn&apos;t.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="#start" className={primaryCta}>
                  Find where to start
                  <span className="material-symbols-outlined ml-2 text-[20px] text-amber-400">arrow_forward</span>
                </Link>
                <Link href="#picks" className={secondaryCta}>
                  Explore 3 Pillars
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
                  <span>0% Brand Sponsorships</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-kinetic-primary-electric">biotech</span>
                  <span>Studied Clinical Dosages</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-amber-500">autorenew</span>
                  <span>Re-evaluated Every 6 Mo</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-6">
              <div className="group relative h-52 overflow-hidden rounded-xl border border-slate-200 shadow-lg sm:h-60">
                <Image
                  src="/healthy/hero-couple.jpg"
                  alt="A couple in their fifties hiking a coastal trail at sunrise"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-sm font-semibold text-slate-100">
                    An active, evidence-checked routine for the decades ahead
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1.5 font-kinetic-heading text-xs font-extrabold tracking-wider text-kinetic-primary uppercase">
                    <span className="material-symbols-outlined text-[20px] text-kinetic-primary-electric">science</span>
                    Why 3 Pillars?
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    Evidence-First Protocol
                  </span>
                </div>
                <p className="py-3 text-xs leading-relaxed text-slate-600 sm:text-sm">{TRIO_INTRO.body}</p>
                <div className="space-y-2.5">
                  {supplements.map((s, i) => {
                    const product = products.find((p) => p.category === s.category);
                    const grade = product ? topGrade(product) : null;
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 transition-colors hover:bg-blue-50/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-sm ${PILLAR_TILE_TONE[i % PILLAR_TILE_TONE.length]}`}>
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{s.tagline}</div>
                            <div className="text-xs font-medium text-slate-500">{s.name}</div>
                          </div>
                        </div>
                        {grade && <GradeBadge grade={grade} />}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                    <span className="material-symbols-outlined text-[18px] text-amber-500">attach_money</span>
                    <span>Daily cost, all three:</span>
                  </div>
                  <span className="rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-sm font-extrabold text-amber-900">
                    {dailyCost !== null ? `${usd(dailyCost)}/day` : "Pending"}
                  </span>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{TRIO_INTRO.disclaimer}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOAL SELECTOR */}
      <section id="start" aria-labelledby="start-heading" className="scroll-mt-6 border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
            Interactive Diagnostic
          </span>
          <h2 id="start-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            What do you want more of?
          </h2>
          <p className="mt-2 max-w-2xl text-base text-slate-600">
            Pick the one that matters most right now. Each answer links straight to that verified review.
          </p>
          <div className="mt-8">
            <GoalChooser />
          </div>
        </div>
      </section>

      {/* CURRENT PICKS */}
      <section id="picks" aria-labelledby="picks-heading" className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
                Verified Selections
              </span>
              <h2 id="picks-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Current picks
              </h2>
              <p className="mt-2 text-base text-slate-600">
                One pick per job. Price, cost per serving, why it&apos;s the pick and its drawback,
                right on the card.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>Re-checked every 6 months</span>
            </div>
          </div>
          <ul className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY THESE PICKS + METHODOLOGY */}
      <section aria-labelledby="why-heading" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <div className="flex flex-col space-y-5 lg:col-span-5">
            <span className="text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
              Scientific Rigor &amp; Vetting
            </span>
            <h2 id="why-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Why these picks
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              Every pick is graded on the ingredient first, the label second. See the brand&apos;s own
              claims next to the independent evidence, and the named alternatives each pick beat.
            </p>
            <Link href="/healthy/why-these-picks" className="group inline-flex items-center text-sm font-bold text-kinetic-primary hover:text-kinetic-amber-hover">
              See the full comparison
              <span className="material-symbols-outlined ml-1 text-[18px] transition-transform group-hover:translate-x-1.5">arrow_forward</span>
            </Link>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>AI-Assisted, Human Verified</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                Research is gathered with the help of AI tools, then checked and signed off by a
                person before anything publishes.{" "}
                <Link href="/healthy/about" className="font-bold text-kinetic-primary underline hover:text-kinetic-amber-hover">
                  Read the full policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <h3 className="font-kinetic-heading mb-4 text-xl font-bold text-slate-950">
              Three steps before anything makes the list
            </h3>
            {pillars.map((pillar, i) => (
              <div key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-kinetic-primary-electric uppercase">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="material-symbols-outlined text-[22px] text-slate-400">
                    {["menu_book", "fact_check", "rule"][i % 3]}
                  </span>
                </div>
                <h4 className="font-kinetic-heading mb-2 text-lg font-bold text-slate-950">{pillar.title}</h4>
                <p className="text-sm leading-relaxed text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-heading" className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[840px] px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
              Direct Answers
            </span>
            <h2 id="faq-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Questions
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Clear, candid answers regarding medical boundaries, compensation and review standards.
            </p>
          </div>
          <dl className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all hover:bg-slate-100/80">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left marker:content-none focus:outline-none">
                  <span className="font-kinetic-heading text-base font-bold text-slate-900 sm:text-lg">{f.question}</span>
                  <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-[22px] text-slate-400 transition-transform duration-200 group-open:rotate-45">
                    add
                  </span>
                </summary>
                <dd className="pt-3 text-sm leading-relaxed text-slate-600">{f.answer}</dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* FINAL CTA */}
      <section aria-labelledby="close-heading" className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
        <div className="blob blob-kinetic-primary pointer-events-none absolute -top-32 -left-32 h-96 w-96" aria-hidden="true" />
        <div className="blob blob-kinetic-cyan pointer-events-none absolute -bottom-32 -right-32 h-96 w-96" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
          <span className="mb-3 block text-xs font-extrabold tracking-widest text-cyan-300 uppercase">
            Streamline Your Routine
          </span>
          <h2 id="close-heading" className="mx-auto max-w-3xl font-kinetic-heading text-3xl leading-tight font-extrabold text-balance text-white sm:text-5xl lg:text-6xl">
            Ready? Pick the one that matches your goal.
          </h2>
          <p className="mx-auto mt-4 mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            One job, not a cabinet full of bottles. Check with your doctor first if you take
            medication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="#start" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 font-bold text-white shadow-[0_4px_20px_rgba(217,119,6,0.4)] transition-all hover:scale-105 hover:from-amber-600 hover:to-amber-700">
              Find where to start
              <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
            </Link>
            <Link href="/healthy/disclosures" className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white transition-colors hover:bg-slate-800">
              How we earn money
            </Link>
          </div>
          <div className="mx-auto mt-14 max-w-3xl text-left">
            <FdaDisclaimer dark />
          </div>
        </div>
      </section>
    </>
  );
}
