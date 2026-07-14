import Image from "next/image";
import type { ReactNode } from "react";

type Product = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  subdomain: string;
  status: "live" | "in-development";
  icon: ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const products: Product[] = [
  {
    name: "ContentFlowSuite",
    tagline: "Content operations",
    description:
      "Plans, drafts, and publishes on-brand content across every channel — AI-generated, human-supervised.",
    href: "https://flow.cliftonai.co",
    subdomain: "flow.cliftonai.co",
    status: "in-development",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="5" rx="1.5" />
        <rect x="3" y="10.5" width="12" height="5" rx="1.5" />
        <path d="M3 19.5h18" />
        <path d="M18 13v4M18 17l-2-2M18 17l2-2" />
      </svg>
    ),
  },
  {
    name: "SLC-CRM",
    tagline: "Sales & pipeline",
    description:
      "A lightweight CRM built for how commercial teams actually sell — pipeline, follow-ups, and insight in one place.",
    href: "https://crm.cliftonai.co",
    subdomain: "crm.cliftonai.co",
    status: "live",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-2.8 2.7-4.5 5.5-4.5s4.9 1.7 5.5 4.5" />
        <circle cx="17" cy="7" r="2.2" />
        <path d="M15.8 14.2c2.2.3 3.7 1.9 4.2 4.3" />
      </svg>
    ),
  },
  {
    name: "Merlow's",
    tagline: "Decision support",
    description:
      "Turns operational data into clear next actions — an AI advisor that watches the business so your team doesn't have to.",
    href: "https://merlows.com",
    subdomain: "merlows.com",
    status: "live",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M12 3l2.1 6.4L20.5 12l-6.4 2.1L12 20.5l-2.1-6.4L3.5 12l6.4-2.1L12 3z" />
      </svg>
    ),
  },
  {
    name: "Empirely",
    tagline: "Performance analytics",
    description:
      "Evidence-based performance analytics — see what's actually working, and act on it in real time.",
    href: "https://empirely.cliftonai.co",
    subdomain: "empirely.cliftonai.co",
    status: "in-development",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M4 20V10M11 20V4M18 20v-7" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
];

const pillars = [
  {
    title: "Integrate",
    description:
      "We connect AI into the systems you already run — no rip-and-replace, no six-month migration.",
  },
  {
    title: "Automate",
    description:
      "Repetitive commercial work — content, follow-ups, reporting — runs itself, supervised by your team.",
  },
  {
    title: "Scale",
    description:
      "Every tool we build is designed to keep pace as headcount stays flat and output goes up.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discover",
    description:
      "We map how your commercial team actually works today — the tools, the gaps, the busywork.",
  },
  {
    step: "02",
    title: "Integrate",
    description:
      "We wire AI into that workflow directly, using our existing tools or a custom build.",
  },
  {
    step: "03",
    title: "Automate",
    description:
      "The routine work — content, CRM hygiene, reporting — runs without a human in the loop.",
  },
  {
    step: "04",
    title: "Scale",
    description: "We monitor, refine, and expand the system as your operation grows.",
  },
];

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border bg-bg-elevated/70 px-4 py-3 backdrop-blur-md sm:px-6"
        >
          <a href="#top" className="flex items-center gap-2.5 cursor-pointer">
            <Image
              src="/brand/logo-icon.png"
              alt="CliftonAi"
              width={28}
              height={30}
              style={{ height: "auto" }}
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
              href="#how-it-works"
              className="text-sm text-fg-muted transition-colors duration-200 hover:text-fg cursor-pointer"
            >
              How it works
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
            className="rounded-full bg-brand-emerald px-4 py-2 text-sm font-medium text-[#04150a] transition-colors duration-200 hover:bg-brand-emerald-light cursor-pointer"
          >
            Get in touch
          </a>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-28 sm:pt-48">
          <div
            aria-hidden="true"
            className="glow pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2"
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase">
              AI Integrator
            </span>
            <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
              We build AI tools that run your{" "}
              <span className="brand-gradient-text">commercial operations</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
              CliftonAi designs, integrates, and ships AI-powered software for
              revenue teams — replacing manual busywork with systems that plan,
              act, and report on their own.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#products"
                className="w-full rounded-full bg-brand-emerald px-6 py-3 text-sm font-semibold text-[#04150a] transition-colors duration-200 hover:bg-brand-emerald-light cursor-pointer sm:w-auto"
              >
                Explore the tools
              </a>
              <a
                href="#contact"
                className="w-full rounded-full border border-border-strong px-6 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:border-brand-emerald hover:text-brand-emerald-light cursor-pointer sm:w-auto"
              >
                Book a call
              </a>
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                Not another AI vendor. An integrator.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                Most commercial teams don&apos;t need another dashboard — they
                need AI wired directly into how they already work. That&apos;s
                the job.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border bg-bg-card p-6"
                >
                  <h3 className="font-heading text-xl font-semibold text-fg">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                The tools we&apos;ve built
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                Each one ships and scales independently.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <a
                  key={product.name}
                  href={product.href}
                  className="group relative flex flex-col rounded-2xl border border-border bg-bg-card p-7 transition-colors duration-200 hover:border-brand-emerald/60 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-fg">
                      {product.icon}
                    </div>
                    <span className="text-xs text-fg-subtle transition-colors duration-200 group-hover:text-brand-emerald-light">
                      {product.subdomain} ↗
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-2.5">
                    <h3 className="font-heading text-xl font-semibold text-fg">
                      {product.name}
                    </h3>
                    {product.status === "in-development" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
                        In development
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald-light uppercase">
                    {product.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                    {product.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                How an engagement runs
              </h2>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item) => (
                <div key={item.step}>
                  <span className="brand-gradient-text font-heading text-3xl font-semibold">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-border-strong bg-bg-card px-8 py-16 text-center sm:px-16">
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
                className="w-full rounded-full bg-brand-emerald px-6 py-3 text-sm font-semibold text-[#04150a] transition-colors duration-200 hover:bg-brand-emerald-light cursor-pointer sm:w-auto"
              >
                hello@cliftonai.co
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-icon.png"
              alt=""
              width={20}
              height={22}
              style={{ height: "auto" }}
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
                {product.name}
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
