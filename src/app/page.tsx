import Image from "next/image";
import { Clauses } from "./clauses";
import { Reveal } from "./reveal";
import { ProductsSection } from "./products-section";
import { PricingSection } from "./pricing-section";
import { HeroDiagram } from "./hero-diagram";
import { products } from "./products-data";

const WHATSAPP_HREF = "https://wa.me/447547258570";

const pillars = [
  {
    title: "Replace",
    description:
      "Swap your CRM, project management, supply-chain, or marketing stack for a system built around you, and yours outright after three years. No rip-and-replace migration drama.",
  },
  {
    title: "Personalise",
    description:
      "Off-the-shelf SaaS bends you to its workflow. Brian builds the workflow around you: every field, every automation, every report.",
  },
  {
    title: "Save",
    description:
      "You stop paying full subscription price the day it ships. Half of what you paid before, and after three years the system is yours.",
  },
];

const proofPoints = [
  "4 tools Brian runs daily",
  "4 client platforms shipped",
  "Founder-led, UK-based",
];

/** brian-mark-compact.svg viewBox aspect — keeps the mark from being squashed. */
const MARK_ASPECT = 653.8 / 517.3;

/**
 * The masterbrand lockup: traced mark + "GetBrian" set navy/gold exactly as the
 * logo does. Kept as live text rather than the wordmark SVG so it stays
 * selectable, indexable and screen-reader-native. Logo gold is 3.1:1 on white,
 * which WCAG 1.4.3 permits here specifically because this is the logotype —
 * every other small gold element on the site uses --brand-gold-deep.
 */
function Wordmark({ height, className }: { height: number; className?: string }) {
  return (
    <span className={`flex flex-col items-center gap-1 ${className ?? ""}`}>
      <Image
        src="/brand/brian-mark-compact.svg"
        alt=""
        aria-hidden="true"
        width={Math.round(height * MARK_ASPECT)}
        height={height}
        priority
      />
      <span className="font-heading leading-none font-semibold tracking-tight">
        <span className="text-brand-navy">Get</span>
        <span className="text-brand-gold">Brian</span>
      </span>
    </span>
  );
}

/**
 * The estate endorsement badge, as ContentFlow renders it (`.built-by` at
 * flow.getbrian.xyz): bordered pill, 20px mark, muted label with the name in
 * display semibold navy, both border and text going navy on hover.
 *
 * Same artwork and proportions here, with one adaptation — on the masterbrand's
 * own footer the badge links to `#top` rather than out to getbrian.xyz, because
 * on this domain that would be a self-link that just reloads the page.
 *
 * The canonical copy-paste version for sites outside this repo stays
 * `public/brand/built-by-badge.html`, which is generated and self-contained.
 */
function BuiltByBadge() {
  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-brand-navy hover:text-brand-navy cursor-pointer"
    >
      <Image
        src="/brand/brian-mark-compact.svg"
        alt=""
        aria-hidden="true"
        width={Math.round(20 * MARK_ASPECT)}
        height={20}
      />
      <span>
        Built by{" "}
        <b className="font-heading font-semibold text-brand-navy">GetBrian</b>
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6">
        <nav
          aria-label="Primary"
          className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
        >
          <a href="#top" aria-label="GetBrian home" className="cursor-pointer">
            <Wordmark height={45} className="text-3xl" />
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#products"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Work
            </a>
            <a
              href="#pricing"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#who-we-are"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Who&apos;s Brian
            </a>
            <a
              href="#contact"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Contact
            </a>
          </div>
          <a
            href="#contact"
            className="inline-flex min-h-11 items-center rounded-full bg-brand-gold px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover cursor-pointer"
          >
            Get Brian
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-20 sm:pt-48">
          <div className="animate-fade-in-up relative mx-auto grid max-w-6xl items-center gap-y-16 lg:grid-cols-2 lg:gap-x-12">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase">
                If you see Brian, get him
              </span>
              <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
                The helpful AI bloke who{" "}
                <span className="brand-gradient-text">
                  replaces your software pain with simplicity and logic
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
                Brian builds the CRM, project tracker, marketing engine, and
                supply-chain tools your business rents every month, for a very
                low build fee, then half of what you&apos;re already paying.
                Stay three years and it&apos;s yours outright.
              </p>
              <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row lg:w-auto lg:justify-start">
                <a
                  href="#contact"
                  className="w-full rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover cursor-pointer sm:w-auto"
                >
                  Get Brian
                </a>
                <a
                  href="#products"
                  className="glass-hover glass w-full rounded-full px-6 py-3 text-sm font-semibold text-fg cursor-pointer sm:w-auto"
                >
                  See his work
                </a>
              </div>
              <ul className="mt-10 flex flex-col items-center justify-center gap-2 text-xs font-medium tracking-wide text-fg-subtle uppercase sm:flex-row sm:gap-0 lg:justify-start">
                {proofPoints.map((point, i) => (
                  <li key={point} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="mx-4 hidden h-1 w-1 rounded-full bg-brand-navy-soft sm:block"
                      />
                    )}
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <HeroDiagram />
          </div>
        </section>

        {/* Positioning — the frame before the evidence */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <Clauses of={["No more paid subscriptions.", "Brian builds it."]} />
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 100}>
                  <div className="glass glass-hover h-full rounded-2xl p-6">
                    <h3 className="font-heading text-xl font-semibold text-fg">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ProductsSection />

        <PricingSection />

        {/* Who's Brian */}
        <section id="who-we-are" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
              <Reveal>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  Who&apos;s Brian?
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                  Brian isn&apos;t a call-centre queue. He&apos;s what
                  happens when one person builds you an AI system instead
                  of selling you another login. Every product on this site,
                  Brian built and still runs, himself, first.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                  That means Brian builds with the same constraints you live
                  under: real data, real deadlines, a system that has to
                  work on day one, not after a quarter of onboarding calls.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  {/* Deliberately anonymous: no name, no portrait, no
                      initials. The mark stands in for the person, which also
                      keeps the "Brian is never depicted as a person" rule
                      intact rather than trading one likeness for another. */}
                  <span
                    aria-hidden="true"
                    className="brand-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  >
                    <Image
                      src="/brand/brian-mark-compact-white.svg"
                      alt=""
                      aria-hidden="true"
                      width={Math.round(24 * MARK_ASPECT)}
                      height={24}
                    />
                  </span>
                  <div>
                    <p className="font-heading text-base font-semibold text-fg">
                      Founder-led
                    </p>
                    <p className="text-sm text-fg-muted">
                      One person behind every build,{" "}
                      {/* nowrap so a phone doesn't break the compound after the
                          hyphen and leave "based" on its own line. */}
                      <span className="whitespace-nowrap">UK-based</span>
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="glass rounded-2xl p-8">
                  <h3 className="font-heading text-lg font-semibold text-fg">
                    How Brian works
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy-soft" />
                      One person, direct access. No account managers
                      between you and the build.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy-soft" />
                      Built and battle-tested on Brian&apos;s own tools
                      first.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy-soft" />
                      You own what gets built after three years. No lock-in,
                      no re-subscribing to leave.
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="relative overflow-hidden border-t border-border px-6 py-24">
          <div aria-hidden="true" className="blob blob-deep animate-float-slow h-[420px] w-[560px] -bottom-40 left-1/2 -translate-x-1/2" />
          <Reveal className="relative mx-auto max-w-4xl">
            <div className="glass rounded-3xl px-8 py-16 text-center sm:px-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <Clauses of={["Seen Brian?", "Get him."]} />
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed text-fg-muted">
                Tell him what you&apos;re paying for right now. He&apos;ll
                show you what it looks like owned instead of rented.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@getbrian.xyz"
                  className="w-full rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover cursor-pointer sm:w-auto"
                >
                  hello@getbrian.xyz
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover w-full rounded-full px-6 py-3 text-sm font-semibold text-brand-navy-soft cursor-pointer sm:w-auto"
                >
                  Message Brian on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Wordmark height={36} className="text-2xl" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fg-muted">
            {products.map((product) => (
              <a
                key={product.name}
                href={product.href}
                className="transition-colors duration-200 hover:text-fg cursor-pointer"
              >
                {product.shortName ?? product.name}
              </a>
            ))}
          </div>
          <BuiltByBadge />
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-fg-subtle sm:text-right">
          © {new Date().getFullYear()} Brian. All rights reserved.
        </p>
      </footer>
    </>
  );
}
