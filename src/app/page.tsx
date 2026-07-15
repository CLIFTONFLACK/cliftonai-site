import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Product = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  subdomain: string;
  status: "live" | "in-development";
  screenshot: string;
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
      "Plans, drafts, and publishes on-brand content across every channel. AI-generated, human-supervised.",
    href: "https://flow.cliftonai.co",
    subdomain: "flow.cliftonai.co",
    status: "in-development",
    screenshot: "/screenshots/contentflowsuite.jpg",
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
    tagline: "Leisure & licensed property",
    description:
      "The AI-powered CRM built for UK leisure and licensed property professionals. MatchMaker scores every requirement against every listing on the detail that actually decides these deals: use class, premises licence, covers, extraction. It surfaces only the pairings worth your morning.",
    href: "https://crm.cliftonai.co",
    subdomain: "crm.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/crm.jpg",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M4 21V9l8-5 8 5v12" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 12h.01M15 12h.01" />
      </svg>
    ),
  },
  {
    name: "Merlow's",
    tagline: "Independent journalism + AI research",
    description:
      "An independent news platform covering Middle East diplomacy: the Abraham Accords, the Cyrus Accord, and the quiet work of reconciliation. Its AI research assistant draws on Merlow's own reporting and reputable sources to give readers instant context on any development.",
    href: "https://merlows.com",
    subdomain: "merlows.com",
    status: "live",
    screenshot: "/screenshots/merlows.jpg",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H15v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
        <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" />
        <path d="M7 8h5M7 11h5M7 14h3" />
      </svg>
    ),
  },
  {
    name: "Empirely",
    tagline: "Performance analytics",
    description:
      "Evidence-based performance analytics. See what's actually working, and act on it in real time.",
    href: "https://empirely.cliftonai.co",
    subdomain: "empirely.cliftonai.co",
    status: "in-development",
    screenshot: "/screenshots/empirely.jpg",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M4 20V10M11 20V4M18 20v-7" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
  {
    name: "GetForged",
    tagline: "AI app marketplace",
    description:
      "Buy the AI tool you'd have hired a developer to build. GetForged lists pre-built apps, automations, and internal tools from AI builders. Install in hours, licensed or bought outright, from £49.",
    href: "https://getforged.cliftonai.co",
    subdomain: "getforged.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/getforged.jpg",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <path d="M4 8l1.5-4h13L20 8" />
        <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" />
        <path d="M9 12a3 3 0 0 0 6 0" />
      </svg>
    ),
  },
  {
    name: "DiffDoc",
    tagline: "Document comparison",
    description:
      "Upload two versions of a document (.docx or .pdf) and DiffDoc reads both, scores similarity, and marks up exactly what changed. Comment, edit, and export an audit-ready annotated copy.",
    href: "https://diffdoc.cliftonai.co",
    subdomain: "diffdoc.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/diffdoc.jpg",
    icon: (
      <svg {...iconProps} className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="4" width="8" height="16" rx="1.5" />
        <rect x="13" y="4" width="8" height="16" rx="1.5" />
        <path d="M6.5 8h1M6.5 11h1M6.5 14h1" />
        <path d="M16.5 8h1M16.5 11h1M16.5 14h1" />
      </svg>
    ),
  },
];

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
        <section className="relative overflow-hidden px-6 pt-40 pb-28 sm:pt-48">
          <div aria-hidden="true" className="blob blob-emerald animate-float h-[420px] w-[560px] -top-32 left-1/2 -translate-x-[70%]" />
          <div aria-hidden="true" className="blob blob-forest animate-float-slow h-[380px] w-[480px] -top-10 left-1/2 translate-x-[10%]" />
          <div className="animate-fade-in-up relative mx-auto max-w-4xl text-center">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase">
              AI Integrator
            </span>
            <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
              We build AI tools that run your{" "}
              <span className="brand-gradient-text">commercial operations</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
              CliftonAi designs, integrates, and ships AI-powered software for
              revenue teams, replacing manual busywork with systems that plan,
              act, and report on their own.
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
          </div>
        </section>

        {/* Products */}
        <section id="products" className="relative overflow-hidden border-t border-border px-6 py-24">
          <div aria-hidden="true" className="blob blob-emerald animate-float h-[360px] w-[480px] top-1/3 -left-40" />
          <div className="relative mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                The tools we&apos;ve built
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-fg-muted">
                Each one ships and scales independently.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {products.map((product, i) => (
                <Reveal key={product.name} delay={i * 80}>
                  <a
                    href={product.href}
                    className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-2xl cursor-pointer"
                  >
                    <div className="px-5 pt-5">
                      <div className="relative aspect-[16/9] w-full max-w-[280px] overflow-hidden rounded-lg border border-border bg-bg-card">
                        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1 px-2 py-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle/40" />
                          <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle/40" />
                          <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle/40" />
                        </div>
                        <Image
                          src={product.screenshot}
                          alt={`${product.name} product screenshot`}
                          fill
                          sizes="280px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center justify-between">
                        <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white">
                          {product.icon}
                        </div>
                        <span className="text-xs text-fg-subtle transition-colors duration-200 group-hover:text-brand-emerald">
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
                      <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald uppercase">
                        {product.tagline}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                        {product.description}
                      </p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

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

        {/* Positioning */}
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
              </div>
            </div>
          </Reveal>
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
