import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FdaDisclaimer, GoalChooser } from "./components";
import { Icon } from "./icons";
import { JobRail } from "./job-rail";
import { LogoAnimation } from "./logo-animation";
import { RailReveal } from "./rail-reveal";
import { signupEnabled } from "./newsletter";
import { Signup } from "./signup";
import {
  PROGRAM_NAME,
  TAGLINE,
  faqs,
  pillars,
  products,
} from "./data";

export const metadata: Metadata = {
  title: { absolute: `${PROGRAM_NAME} | GetBrian Healthy` },
  alternates: { canonical: "/healthy" },
  other: {
    "impact-site-verification": "76ada0e2-8897-4f30-b9ef-80aebec89d38",
  },
};

const primaryCta =
  "inline-flex min-h-12 items-center rounded-xl bg-kinetic-primary px-6 py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(10,29,59,0.25)] transition-all hover:-translate-y-0.5 hover:bg-kinetic-primary-hover hover:shadow-[0_12px_28px_rgba(10,29,59,0.35)]";

/** The quieter partner to primaryCta: white, navy text, teal on hover. */
const secondaryCta =
  "inline-flex min-h-12 items-center rounded-xl border-2 border-kinetic-primary/15 bg-white/90 px-5 py-3 font-bold text-kinetic-primary transition-colors hover:border-kinetic-teal hover:bg-kinetic-primary-light";


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

      {/* HERO: the photo runs full-bleed behind the section on large screens,
          feathered to white on the left so the lockup and copy read over it.
          On small screens it sits as a band under the copy, feathered at the
          top. One <Image> serves both, repositioned by breakpoint. */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-10 lg:-mt-16 lg:flex lg:min-h-[680px] lg:items-center lg:pt-28 lg:pb-20">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col space-y-6 lg:max-w-[36rem]">
            {/* Brand lockup: the mark and "GetBrian Healthy" lead the page. The
                wordmark is text, so it stays readable and selectable; the H1
                below is still the page's headline. */}
            <div className="animate-fade-in-up flex items-center gap-4 sm:gap-5">
              <Image
                src="/healthy/brand/healthy-mark-lg.png"
                alt=""
                aria-hidden="true"
                width={131}
                height={112}
                loading="eager"
                unoptimized
                className="h-20 w-auto sm:h-28"
              />
              <p className="font-kinetic-heading text-4xl leading-none font-extrabold tracking-tight text-kinetic-primary sm:text-6xl">
                GetBrian <span className="block text-kinetic-primary-electric sm:inline">Healthy</span>
              </p>
            </div>
            <h1 className="font-kinetic-heading text-3xl leading-[1.1] font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[44px]">
              {taglineLead}
              {taglineHighlight && (
                <span className="bg-gradient-to-r from-kinetic-primary via-kinetic-primary-electric to-kinetic-teal bg-clip-text text-transparent">
                  {taglineHighlight}
                </span>
              )}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Three supplements, one job each. Carefully researched and honestly reasoned.
              Brian&apos;s done the work so you don&apos;t have to.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="#picks" className={primaryCta}>
                Get Brian&apos;s picks
                <Icon name="arrow" size={20} className="ml-2 text-kinetic-teal-on-dark" />
              </Link>
              <Link href="/healthy/about" className={secondaryCta}>
                {PROGRAM_NAME}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="badgeCheck" size={16} className="text-kinetic-primary-electric" />
                <span>No paid placements</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="flask" size={16} className="text-kinetic-primary-electric" />
                <span>Dose checked against the research</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="refresh" size={16} className="text-kinetic-primary-electric" />
                <span>Re-checked every 6 months</span>
              </div>
            </div>
          </div>
        </div>

        {/* The couple stand in the right half of the frame, so the crop anchors
            right to keep both of them clear of the feathered side. */}
        <div className="relative mt-10 h-72 sm:h-96 lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
          <Image
            src="/healthy/hero-couple.jpg"
            alt="A couple in their fifties hiking a coastal trail at sunrise"
            fill
            sizes="100vw"
            className="animate-kinetic-hero-zoom object-cover object-right"
            priority
          />
          <div
            className="healthy-hero-feather absolute inset-0 bg-gradient-to-b from-white via-white/0 via-35% to-transparent"
            aria-hidden="true"
          />
          {/* Caption legibility: a scrim on the small-screen band; on large screens a text
              shadow instead, since a scrim there would grey the feathered copy side. */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/60 to-transparent lg:hidden" aria-hidden="true" />
          <p className="absolute right-4 bottom-4 left-4 text-right text-sm font-semibold text-white [text-shadow:0_1px_10px_rgba(2,6,23,0.75)] sm:right-6 lg:right-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            An active, evidence-checked routine for the decades ahead
          </p>
        </div>
      </section>

      {/* GOAL SELECTOR */}
      <section id="start" aria-labelledby="start-heading" className="scroll-mt-6 border-b border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
            Start with your goal
          </span>
          <h2 id="start-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            What do you want more of?
          </h2>
          <p className="mt-2 max-w-2xl text-base text-slate-600">
            Pick the one that matters most right now. Each answer links straight to Brian&apos;s review.
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
                Brian&apos;s picks
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
              <span className="h-2 w-2 rounded-full bg-kinetic-teal" aria-hidden="true" />
              <span>Re-checked every 6 months</span>
            </div>
          </div>
          <JobRail products={products} />
        </div>
      </section>

      {/* EMAIL UPDATES: shown only once the Resend variables are set (see newsletter.ts). */}
      {signupEnabled() && (
        <section aria-labelledby="updates-heading" className="border-b border-slate-200 bg-white pb-16 sm:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Signup />
          </div>
        </section>
      )}

      {/* HOW BRIAN PICKS: one left-to-right flow. Three checks, then the human
          sign-off as step four, with the animated mark as its finale, so
          "AI-assisted, human verified" reads as where the process ends rather
          than a note beside it. The numbered tiles ride the same teal rail as
          the picks, drawn in once by RailReveal. */}
      <section aria-labelledby="why-heading" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
                How Brian picks
              </span>
              <h2 id="why-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Three checks. Then a person signs off.
              </h2>
              <p className="mt-2 text-base text-slate-600">Ingredient first, label second.</p>
            </div>
            <Link href="/healthy/why-these-picks" className="group inline-flex min-h-11 items-center text-sm font-bold text-kinetic-primary hover:text-kinetic-primary-electric">
              See the full comparison
              <Icon name="arrow" size={18} className="ml-1 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>

          <RailReveal className="relative mt-10">
            {/* Through the tile centres: four columns and gap-6 put the outer
                centres (100% - 4.5rem) / 8 in from each edge. */}
            <span
              className="healthy-rail-line pointer-events-none absolute top-6 hidden h-[3px] -translate-y-1/2 rounded-full bg-kinetic-teal lg:block"
              style={{ left: "calc((100% - 4.5rem) / 8)", right: "calc((100% - 4.5rem) / 8)" }}
              aria-hidden="true"
            />
            <ol className="relative grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className="healthy-rail-node flex flex-col" style={{ transitionDelay: `${250 + i * 180}ms` }}>
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-kinetic-primary font-kinetic-heading text-sm font-extrabold text-white shadow-sm ring-4 ring-slate-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Icon name={(["book", "clipboardCheck", "listChecks"] as const)[i % 3]} size={22} className="text-kinetic-primary-electric" />
                    <h3 className="font-kinetic-heading mt-3 text-lg font-bold text-slate-950">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
                  </div>
                </li>
              ))}
              <li className="healthy-rail-node flex flex-col" style={{ transitionDelay: `${250 + pillars.length * 180}ms` }}>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-kinetic-primary-electric text-white shadow-sm ring-4 ring-slate-50">
                  <Icon name="shieldCheck" size={22} />
                </span>
                <div className="mt-4 flex flex-col rounded-xl border-2 border-kinetic-teal/30 bg-white p-6 shadow-sm">
                  <h3 className="font-kinetic-heading text-lg font-bold text-slate-950">Human sign-off</h3>
                  <LogoAnimation className="mt-4" />
                  <Link href="/healthy/about" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-kinetic-primary underline hover:text-kinetic-primary-electric">
                    Read the policy
                  </Link>
                </div>
              </li>
            </ol>
          </RailReveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-heading" className="border-b border-slate-200 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[840px] px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
              Straight answers
            </span>
            <h2 id="faq-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Questions
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Medical advice, commission, and how picks are checked.
            </p>
          </div>
          <dl className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all hover:bg-slate-100/80">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left marker:content-none focus:outline-none">
                  <span className="font-kinetic-heading text-base font-bold text-slate-900 sm:text-lg">{f.question}</span>
                  <Icon name="plus" size={22} className="text-slate-400 transition-transform duration-200 group-open:rotate-45" />
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
          <h2 id="close-heading" className="mx-auto max-w-3xl font-kinetic-heading text-3xl leading-tight font-extrabold text-balance text-white sm:text-5xl lg:text-6xl">
            Ready? Pick the one that matches your goal.
          </h2>
          <p className="mx-auto mt-4 mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            One job, not a cabinet full of bottles. Check with your doctor first if you take
            medication.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Orange is kept for retailer (Buy) buttons only; this one moves around the page. */}
            <Link href="#start" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-8 py-4 font-bold text-slate-950 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Find my pick
              <Icon name="arrow" size={18} className="ml-2" />
            </Link>
            <Link href="/healthy/disclosures" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-slate-300 underline underline-offset-4 hover:text-white">
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
