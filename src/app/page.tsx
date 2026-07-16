import Image from "next/image";
import { Reveal } from "./reveal";
import { ProductsSection } from "./products-section";
import { HeroDiagram } from "./hero-diagram";
import { products } from "./products-data";

const WHATSAPP_HREF = "https://wa.me/447547258570";

const pillars = [
  {
    title: "Integrate",
    description:
      "We connect AI into the systems you already run. No rip-and-replace, no six-month migration.",
  },
  {
    title: "Automate",
    description:
      "Repetitive commercial work (content, follow-ups, reporting) runs itself, supervised by your team.",
  },
  {
    title: "Scale",
    description:
      "Every tool we build is designed to keep pace as headcount stays flat and output goes up.",
  },
];

const proofPoints = [
  "4 products we run ourselves, daily",
  "4 client platforms shipped",
  "Founder-led, UK-based",
];

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6">
        <nav
          aria-label="Primary"
          className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border px-4 py-3 sm:px-6"
        >
          <a href="#top" className="flex items-center gap-2.5 cursor-pointer">
            <Image
              src="/brand/logo-mark-compact.svg"
              alt="CliftonAi"
              width={28}
              height={28}
              priority
            />
            <span className="font-heading text-lg font-semibold tracking-tight text-fg">
              CliftonAi
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#products"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Products
            </a>
            <a
              href="#who-we-are"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              Who we are
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
            className="rounded-full bg-brand-emerald-bright px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-mid cursor-pointer"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-20 sm:pt-48">
          <div className="animate-fade-in-up relative mx-auto max-w-4xl text-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase">
              AI Integrator
            </span>
            <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
              AI that runs inside your{" "}
              <span className="brand-gradient-text">commercial operation</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
              CliftonAi designs, integrates, and operates AI-powered software
              for revenue teams — and every product we sell, we run ourselves
              first.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#products"
                className="w-full rounded-full bg-brand-emerald-bright px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-mid cursor-pointer sm:w-auto"
              >
                Explore the tools
              </a>
              <a
                href="#contact"
                className="glass-hover glass w-full rounded-full px-6 py-3 text-sm font-semibold text-fg cursor-pointer sm:w-auto"
              >
                Book a call
              </a>
            </div>
            <ul className="mt-10 flex flex-col items-center justify-center gap-2 text-xs font-medium tracking-wide text-fg-subtle uppercase sm:flex-row sm:gap-0">
              {proofPoints.map((point, i) => (
                <li key={point} className="flex items-center">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-4 hidden h-1 w-1 rounded-full bg-brand-emerald sm:block"
                    />
                  )}
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <HeroDiagram />
        </section>

        {/* Positioning — the frame before the evidence */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Not another AI vendor. An integrator.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                Most commercial teams don&apos;t need another dashboard. They
                need AI wired directly into how they already work. That&apos;s
                the job.
              </p>
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

        {/* Who we are */}
        <section id="who-we-are" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 sm:grid-cols-2 sm:items-center">
              <Reveal>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  Who we are
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                  CliftonAi is a small, focused AI integration studio founded by
                  Clifton Flack. We don&apos;t sell generic software and walk
                  away. Every product on this site is one we designed, shipped,
                  and still operate ourselves.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                  That means we build with the same constraints our clients
                  live under: real data, real deadlines, real teams who need a
                  tool to work on day one, not after a quarter of onboarding.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  {/* Founder portrait — swap this monogram for
                      <Image src="/brand/clifton.jpg" width={56} height={56}
                      alt="Clifton Flack" className="h-14 w-14 rounded-full object-cover" />
                      once the photo is available. */}
                  <span
                    aria-hidden="true"
                    className="brand-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-heading text-lg font-semibold text-white"
                  >
                    CF
                  </span>
                  <div>
                    <p className="font-heading text-base font-semibold text-fg">
                      Clifton Flack
                    </p>
                    <p className="text-sm text-fg-muted">Founder, CliftonAi</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="glass rounded-2xl p-8">
                  <h3 className="font-heading text-lg font-semibold text-fg">
                    How we work
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                      Small team, direct access. No account managers between
                      you and the people building your tool.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                      Built and battle-tested on our own products first.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                      Integrated into your existing workflow, not a new system
                      you have to learn.
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="relative overflow-hidden border-t border-border px-6 py-24">
          <div aria-hidden="true" className="blob blob-forest animate-float-slow h-[420px] w-[560px] -bottom-40 left-1/2 -translate-x-1/2" />
          <Reveal className="relative mx-auto max-w-4xl">
            <div className="glass rounded-3xl px-8 py-16 text-center sm:px-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Ready to put AI to work in your operation?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fg-muted">
                Tell us where the busywork lives. We&apos;ll show you what an
                integration looks like.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@cliftonai.co"
                  className="w-full rounded-full bg-brand-emerald-bright px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-mid cursor-pointer sm:w-auto"
                >
                  hello@cliftonai.co
                </a>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover w-full rounded-full px-6 py-3 text-sm font-semibold text-brand-emerald cursor-pointer sm:w-auto"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-mark-compact.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
            />
            <span className="font-heading text-sm font-semibold text-fg">
              CliftonAi
            </span>
          </div>
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
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} CliftonAi. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
