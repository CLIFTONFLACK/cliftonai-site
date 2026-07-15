import Image from "next/image";
import { Reveal } from "./reveal";

type Product = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  subdomain: string;
  status: "live" | "in-development";
  screenshot: string;
  category: "self" | "client";
};

const products: Product[] = [
  {
    name: "CliftonAi-WPcontentflowsuite",
    tagline: "Content operations",
    description:
      "Your WordPress site and content calendar shouldn't be two different jobs. CliftonAi-WPcontentflowsuite is a WordPress theme and plugin suite that plans, drafts, and publishes on-brand content inside your site. You get one content flow, not a theme, a plugin, and a separate AI tool duct-taped together.",
    href: "https://flow.cliftonai.co",
    subdomain: "flow.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/contentflowsuite.jpg",
    category: "self",
  },
  {
    name: "CliftonAi-CRM",
    tagline: "Leisure & licensed property",
    description:
      "Stop losing deals to a rival agent's inbox. MatchMaker scores every requirement against every listing on the detail that actually decides leisure deals: use class, premises licence, covers, extraction. You get a ranked shortlist worth your morning, not forty near-misses to scroll through.",
    href: "https://crm.cliftonai.co",
    subdomain: "crm.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/crm.jpg",
    category: "self",
  },
  {
    name: "Merlows News",
    tagline: "Independent journalism + AI research",
    description:
      "Most Middle East coverage picks a side before it picks a story. Merlows News is independent journalism on the region's diplomacy, backed by an AI research assistant that gives instant context on any development. You get the full picture, not the headline.",
    href: "https://merlows.com",
    subdomain: "merlows.com",
    status: "live",
    screenshot: "/screenshots/merlows.jpg",
    category: "client",
  },
  {
    name: "Empirely Game",
    tagline: "Build. Survive. Dominate.",
    description:
      "You get 3 Action Points a day. Every business you ignore starts dying. Empirely Game is a daily mobile business game where real-world economic, political, and social events hit your portfolio. You get one shot a day to build, survive, and dominate, not an idle game that plays itself.",
    href: "https://empirely.cliftonai.co",
    subdomain: "empirely.cliftonai.co",
    status: "in-development",
    screenshot: "/screenshots/empirely.jpg",
    category: "client",
  },
  {
    name: "GetForged",
    tagline: "AI app marketplace",
    description:
      "Someone already built the tool you were about to pay a developer thousands for. GetForged lists pre-built apps, automations, and internal tools from AI builders, installed in hours, from £49. You get software you own, not a quote you're still waiting on.",
    href: "https://getforged.cliftonai.co",
    subdomain: "getforged.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/getforged.jpg",
    category: "client",
  },
  {
    name: "CliftonAi-DiffDoc",
    tagline: "Document comparison",
    description:
      "One clause changed. Did anyone catch it? CliftonAi-DiffDoc reads two versions of a document, marks up exactly what changed, then lets you comment, edit, and export an audit-ready copy. You get certainty on what moved, not a manual read-through.",
    href: "https://diffdoc.cliftonai.co",
    subdomain: "diffdoc.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/diffdoc.jpg",
    category: "self",
  },
  {
    name: "The Rising Lions",
    tagline: "Iran trade platform",
    description:
      "Iran's supply chains are opening. Most buyers don't know where to start. The Rising Lions connects verified Iranian manufacturers and suppliers with global buyers, backed by deal-sourcing and trade intelligence. You get a vetted route into a market everyone's watching.",
    href: "https://www.therisinglions.com",
    subdomain: "therisinglions.com",
    status: "live",
    screenshot: "/screenshots/risinglions.jpg",
    category: "client",
  },
  {
    name: "CliftonAi-DealMaker",
    tagline: "Deal pipeline for small business",
    description:
      "Your leads are scattered across five inboxes and a spreadsheet nobody trusts. CliftonAi-DealMaker sources leads, scores them against your ideal customer, drafts outreach in your voice, and reminds you before a follow-up slips. You get a pipeline built for how your business actually sells, not a bloated enterprise CRM.",
    href: "https://dealmaker.cliftonai.co",
    subdomain: "dealmaker.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/dealmaker.jpg",
    category: "self",
  },
];

const productCategories = [
  {
    key: "self" as const,
    title: "Tools We Built For Ourselves and Available to You",
    intro: "CliftonAi-branded products, built for our own operation first.",
  },
  {
    key: "client" as const,
    title: "Commercial Infrastructure We Built for Clients",
    intro: "Platforms designed and shipped for specific client businesses.",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.href}
      className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-2xl cursor-pointer"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg-card">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
        </div>
        <Image
          src={product.screenshot}
          alt={`${product.name} product screenshot`}
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <span className="text-xs text-fg-subtle transition-colors duration-200 group-hover:text-brand-emerald">
          {product.subdomain} ↗
        </span>
        <div className="mt-4 flex items-center gap-2.5">
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
  );
}

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
            {productCategories.map((category, ci) => {
              const categoryProducts = products.filter((p) => p.category === category.key);
              return (
                <div key={category.key} className={ci === 0 ? "mt-14" : "mt-20"}>
                  <Reveal>
                    <h3 className="font-heading text-xl font-semibold text-fg sm:text-2xl">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-muted">{category.intro}</p>
                  </Reveal>
                  <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-3">
                    {categoryProducts.map((product, i) => (
                      <Reveal key={product.name} delay={i * 80}>
                        <ProductCard product={product} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
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
