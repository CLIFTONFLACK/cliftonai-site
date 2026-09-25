import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FdaDisclaimer, GoalChooser } from "./components";
import { Icon } from "./icons";
import { PickLoop } from "./pick-loop";
import { JobRail } from "./job-rail";
import { signupEnabled } from "./newsletter";
import { Signup } from "./signup";
import {
  PROGRAM_NAME,
  TAGLINE,
  faqs,
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


const HERO_POINTS = [
  { icon: "traces", text: "3 Supplements, 3 Jobs" },
  { icon: "seal", text: "Carefully Researched, Honestly Reviewed" },
  { icon: "crossSolid", text: "More Energy, Greater Strength and Calm When You Need It" },
] as const;

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

  // Splits TAGLINE after its last ", " so the closing phrase ("Choose Brian.")
  // takes the highlight. Falls back to the whole line with no highlight if
  // TAGLINE ever stops containing a comma.
  const split = TAGLINE.lastIndexOf(", ");
  const taglineLead = split === -1 ? TAGLINE : TAGLINE.slice(0, split + ", ".length);
  const taglineHighlight = split === -1 ? "" : TAGLINE.slice(split + ", ".length);

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
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-10 lg:flex lg:min-h-[680px] lg:items-start lg:pt-12 lg:pb-20">
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
            {/* Three points, each marked with a piece of the logo: the traces
                (three supplements), the check seal (reviewed), the cross (the
                benefit). */}
            <ul className="space-y-3">
              {HERO_POINTS.map((point) => (
                <li key={point.text} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-kinetic-primary text-kinetic-teal-on-dark shadow-sm">
                    <Icon name={point.icon} size={22} />
                  </span>
                  <span className="text-lg leading-snug font-semibold text-slate-800 sm:text-xl">{point.text}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start gap-3 pt-2">
              <Link href="#picks" className={primaryCta}>
                Get Brian&apos;s picks
                <Icon name="arrow" size={20} className="ml-2 text-kinetic-teal-on-dark" />
              </Link>
              <p className="font-kinetic-heading text-base font-semibold text-kinetic-primary-electric italic">
                Brian&apos;s done the work so you don&apos;t have to.
              </p>
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
                A pick for every goal
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Price, the reason and the catch, on every card.
              </p>
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

      {/* HOW BRIAN PICKS: one continuous loop (pick-loop.tsx). AI gathers the
          research, the checks run, a person signs off, and the re-check sends it
          round again, with the animated mark at the centre. */}
      <section aria-labelledby="why-heading" className="border-b border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-1 block text-xs font-extrabold tracking-widest text-kinetic-primary-electric uppercase">
                How Brian picks
              </span>
              <h2 id="why-heading" className="font-kinetic-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                One loop, always running.
              </h2>
              <p className="mt-2 text-base text-slate-600">
                Brian finds the clinical data. A human gives final approval. Then it goes round again.
              </p>
            </div>
            <Link href="/healthy/why-these-picks" className="group inline-flex min-h-11 items-center text-sm font-bold text-kinetic-primary hover:text-kinetic-primary-electric">
              See the full comparison
              <Icon name="arrow" size={18} className="ml-1 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
          <div className="mt-10">
            <PickLoop />
          </div>
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
