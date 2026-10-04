import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { Reveal } from "./reveal";
import { WorkSection, ClientsSection } from "./products-section";
import { PricingSection } from "./pricing-section";
import { products } from "./products-data";
import { MobileNav, type NavLink } from "./mobile-nav";
import { StickyCta } from "./sticky-cta";
import { CookieSettingsButton } from "./analytics";
import { HeroMascot } from "./hero-mascot";

/**
 * The homepage's display face. It takes over `--font-heading` for this page
 * only, through the wrapper in `Home`, so every `font-heading` utility below
 * picks it up while /healthy, /cliftonflack and the legal pages keep the root
 * layout's Space Grotesk.
 *
 * No `weight`: that loads the variable font, which the 600-800 range here
 * needs. `opsz` is the axis that tightens the letterforms at poster sizes.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  axes: ["opsz"],
});

const WHATSAPP_HREF = "https://wa.me/447547258570";

/** Single source for both the desktop nav row and the mobile sheet. */
const navLinks: NavLink[] = [
  { href: "#products", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#who-we-are", label: "Who's Brian" },
  { href: "#contact", label: "Contact" },
];

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
  "Founder-led, UK-based",
  "One person, direct access",
  "Brian builds it. You own it.",
];

const howBrianWorks = [
  "One person, direct access. No account managers between you and the build.",
  "Built and battle-tested on Brian's own tools first.",
  "You own what gets built after three years. No lock-in, no re-subscribing to leave.",
];

const H2 =
  "font-heading text-4xl leading-none font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl";

/** 14px corners, not pills: the one button shape for the page's own CTAs. */
const BUTTON =
  "inline-flex min-h-14 w-full items-center justify-center rounded-[14px] px-8 text-lg font-bold transition-colors duration-200 cursor-pointer sm:w-auto";

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
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm text-fg-muted transition-colors duration-200 hover:border-brand-navy hover:text-brand-navy cursor-pointer"
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
    // `contents` so the wrapper only carries the font variable: header, main
    // and footer stay direct flex items of <body>, which is what keeps the
    // footer pinned to the bottom of a short viewport.
    <div className={`${bricolage.variable} contents`}>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6">
        <nav
          aria-label="Primary"
          className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
        >
          <a href="#top" aria-label="GetBrian home" className="cursor-pointer">
            <Wordmark height={45} className="text-3xl" />
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-fg transition-colors duration-200 hover:text-brand-navy-bright cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <a
              href="#contact"
              className="hidden min-h-12 items-center rounded-[14px] bg-brand-navy px-6 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-navy-mid cursor-pointer md:inline-flex"
            >
              Get Brian
            </a>
            <MobileNav links={navLinks} ctaHref="#contact" ctaLabel="Get Brian" />
          </div>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero — the campaign line alone, at poster scale */}
        <section className="px-6 pt-40 pb-16 sm:pt-44 sm:pb-20">
          <div className="animate-fade-in-up mx-auto max-w-6xl">
            <h1 className="font-heading text-[clamp(2.5rem,11.5vw,10rem)] leading-[0.92] font-extrabold tracking-[-0.04em] text-brand-navy">
              <span className="block">If you see Brian,</span>
              <span className="block text-brand-gold-deep">get him.</span>
            </h1>
            <div className="relative mt-10 grid items-end gap-8 border-t border-border-strong pt-7 lg:grid-cols-2 lg:gap-20">
              <HeroMascot />
              <p className="text-xl leading-normal text-fg-muted sm:text-2xl">
                The helpful Ai guy who replaces your rented software. Brian
                builds the tech you rent: CRM, project tools, marketing, and{" "}
                <span className="whitespace-nowrap">supply chain.</span>
              </p>
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <a
                  id="hero-cta"
                  href="#contact"
                  className={`${BUTTON} bg-brand-gold text-fg hover:bg-brand-gold-hover`}
                >
                  Get Brian
                </a>
                <a
                  href="#products"
                  className={`${BUTTON} bg-bg-panel text-brand-navy hover:bg-bg-tint`}
                >
                  See his work
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Proof strip */}
        <section aria-label="Why Brian" className="bg-brand-navy px-6 py-7 text-white">
          <ul className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-sm font-bold tracking-[0.08em] uppercase lg:flex-row lg:justify-between lg:gap-10">
            {proofPoints.map((point, i) => (
              <li
                key={point}
                className={
                  i === proofPoints.length - 1 ? "text-brand-gold-light" : ""
                }
              >
                {point}
              </li>
            ))}
          </ul>
        </section>

        <WorkSection />

        {/* Positioning — the case for building, straight after the proof */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="font-heading text-4xl leading-[0.98] font-extrabold tracking-[-0.035em] text-brand-navy sm:text-6xl lg:text-[5.5rem]">
                <span className="inline-block text-balance">
                  No more paid subscriptions.
                </span>{" "}
                <span className="inline-block text-balance text-brand-gold-deep">
                  Brian builds it.
                </span>
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 100}>
                  <div className="h-full rounded-[28px] bg-bg-tint p-7 sm:p-9">
                    <h3 className="font-heading text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3.5 text-lg leading-relaxed text-fg-muted">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ClientsSection />

        {/* Who's Brian — before the price: who you would be paying comes first */}
        <section id="who-we-are" className="px-6 pt-24">
          <Reveal className="mx-auto max-w-6xl">
            <div className="grid gap-10 rounded-[36px] bg-brand-navy px-7 py-12 text-white sm:px-12 sm:py-16 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:px-[72px] lg:py-20">
              <div className="flex flex-col gap-8">
                <h2 className={H2}>Who&apos;s Brian?</h2>
                {/* Deliberately anonymous: no name, no portrait, no initials.
                    The mark stands in for the person, which also keeps the
                    "Brian is never depicted as a person" rule intact rather
                    than trading one likeness for another. */}
                <Image
                  src="/brand/brian-mark-compact-white.svg"
                  alt=""
                  aria-hidden="true"
                  width={Math.round(174 * MARK_ASPECT)}
                  height={174}
                  className="h-auto w-32 lg:w-[220px]"
                />
              </div>
              <div className="flex flex-col gap-7">
                <p className="font-heading text-2xl leading-tight font-semibold tracking-tight sm:text-[2.125rem]">
                  Brian isn&apos;t a call-centre queue. He&apos;s what happens
                  when one person builds you an AI system instead of selling
                  you another login.
                </p>
                <p className="text-lg leading-relaxed text-white/85">
                  Every product on this site, Brian built and still runs,
                  himself, first. That means Brian builds with the same
                  constraints you live under: real data, real deadlines, a
                  system that has to work on day one, not after a quarter of
                  onboarding calls.
                </p>
                <ul className="grid gap-6 border-t border-white/25 pt-7 text-base leading-normal text-white/85 sm:grid-cols-3">
                  {howBrianWorks.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <PricingSection />

        {/* Contact / CTA */}
        {/* scroll-mt: the section has no top padding of its own, so an anchor
            jump would otherwise park the card flush under the fixed header. */}
        <section id="contact" className="scroll-mt-10 px-6 pb-16">
          <Reveal className="mx-auto max-w-6xl">
            <div className="rounded-[36px] bg-brand-navy px-7 py-20 text-center text-white sm:px-16 sm:py-28">
              <h2 className="font-heading text-5xl leading-[0.96] font-extrabold tracking-[-0.035em] sm:text-7xl lg:text-[6.5rem]">
                <span className="inline-block">Seen Brian?</span>{" "}
                <span className="inline-block text-brand-gold-light">
                  Get him.
                </span>
              </h2>
              <p className="mx-auto mt-7 max-w-xl text-balance text-xl leading-normal text-white/85">
                Tell him what you&apos;re paying for right now. He&apos;ll
                show you what it looks like owned instead of rented.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@getbrian.xyz"
                  className={`${BUTTON} bg-brand-gold text-fg hover:bg-brand-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                >
                  hello@getbrian.xyz
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${BUTTON} border-[1.5px] border-white text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                >
                  Message Brian on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Clears the sticky CTA bar so the copyright line is never trapped
          under it. Only the phone breakpoint needs it — the bar is md:hidden. */}
      <footer className="border-t border-border px-6 pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Wordmark height={36} className="text-2xl" />
          {/* -mx-2 pulls the row back flush: each link now carries its own
              padding to reach a 44px target, which would otherwise inset the
              first and last items relative to the wordmark above. */}
          <div className="-mx-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-fg-muted">
            {products.map((product) => (
              <a
                key={product.name}
                href={product.href}
                className="inline-flex min-h-11 items-center rounded-lg px-2 transition-colors duration-200 hover:text-fg cursor-pointer"
              >
                {product.shortName ?? product.name}
              </a>
            ))}
          </div>
          <BuiltByBadge />
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-fg-subtle sm:text-right">
          © {new Date().getFullYear()} Brian. All rights reserved.{" "}
          <Link
            href="/legal/getbrianapp/privacy"
            className="inline-block -my-3.5 -mx-1 px-1 py-3.5 underline-offset-2 hover:text-fg hover:underline"
          >
            Privacy
          </Link>
          {" · "}
          <Link
            href="/legal/getbrianapp/terms"
            className="inline-block -my-3.5 -mx-1 px-1 py-3.5 underline-offset-2 hover:text-fg hover:underline"
          >
            Terms
          </Link>
          {" · "}
          <CookieSettingsButton />
        </p>
      </footer>

      <StickyCta href="#contact" label="Get Brian" watchId="hero-cta" />
    </div>
  );
}
