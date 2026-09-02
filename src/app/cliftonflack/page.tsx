import type { Metadata } from "next";
import Image from "next/image";
import { Clauses } from "../clauses";
import { Reveal } from "../reveal";
import { MobileNav, type NavLink } from "../mobile-nav";
import { siteUrl } from "../layout";

export const metadata: Metadata = {
  title: "Clifton Flack: Trust Before Transaction | GetBrian",
  description:
    "Clifton Flack: three consumer healthcare systems. Vance Health Hub, CiiTECH & Provacan, and GetBrian, the AI build studio behind Brian.",
  alternates: { canonical: "/cliftonflack" },
  openGraph: {
    title: "Clifton Flack: Trust Before Transaction",
    description:
      "Three consumer healthcare systems, one operator. Vance Health Hub, CiiTECH, GetBrian.",
    url: `${siteUrl}/cliftonflack`,
    siteName: "GetBrian",
    type: "profile",
  },
};

const navLinks: NavLink[] = [
  { href: "#vance", label: "Vance Health Hub" },
  { href: "#ciitech", label: "CiiTECH" },
  { href: "#getbrian", label: "GetBrian" },
  { href: "#principles", label: "How I work" },
];

/**
 * Same browser-chrome plate as the main site's product cards
 * (products-section.tsx), generalised to take a raw src rather than a
 * `Product`, since case-study screenshots here aren't in products-data.ts.
 */
function CaseShot({
  src,
  alt,
  url,
  sizes,
}: {
  src: string;
  alt: string;
  url: string;
  sizes: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-panel">
      <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full border border-border bg-bg px-3 py-0.5 text-center font-mono text-[11px] text-fg-subtle">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}

const vancePrinciples = [
  {
    mark: "Sequence",
    title: "Credibility is the first product",
    body: "In a regulated health category you can't buy your way past scepticism. The Hub shipped months before commerce did, so by the time there's something to sell, there's already a reason to believe it.",
  },
  {
    mark: "Spend",
    title: "Paid media follows proof, never precedes it",
    body: "Budget is gated on organic traction. Paid starts as a learning line, not a growth line, and only scales behind a channel that's already shown it converts.",
  },
  {
    mark: "Language",
    title: "Patients clinically, customers commercially",
    body: "Both are true at once, and the writing has to hold both. Clinical accuracy is a marketing asset here, not a compliance tax on one.",
  },
  {
    mark: "Leverage",
    title: "Systems in place of headcount",
    body: "Automate the repeated work, keep humans on judgement and clinical review. The constraint on growth should be the quality of the thinking, not the size of the team typing.",
  },
];

const ciitechPrinciples = [
  {
    mark: "Category",
    title: "In a low-trust market, education is the moat",
    body: "Competitors bought clicks into a category nobody understood. We taught the category instead, then owned the vocabulary people used to search it.",
  },
  {
    mark: "Structure",
    title: "Separate the jobs, separate the domains",
    body: "Credibility, education and commerce want different tones, different proof, different calls to action. Forcing them onto one site makes all three less convincing.",
  },
  {
    mark: "Retention",
    title: "The second purchase is a different problem",
    body: "First purchase is trust. Second is habit. A laddered range and subscription exist so the customer never has to re-litigate the original decision.",
  },
  {
    mark: "Proof",
    title: "Publish what you'd rather not have to",
    body: "Lab reports, third-party testing, an honest guarantee. In an unregulated corner of a health market, showing your working is a durable commercial position.",
  },
];

const brianPrinciples = [
  {
    mark: "Ownership",
    title: "Rented software is a permanent tax",
    body: "Subscription stacks charge in perpetuity for a fit that's never quite right. Brian's clients pay a build fee, half their old spend for three years, then own the system outright.",
  },
  {
    mark: "Practice",
    title: "Do the work before you sell the plan",
    body: "GetBrian's own tools, ContentFlow, the CRM, DiffDoc, DealMaker, run my own businesses first. I build the thing to find out where it actually breaks.",
  },
  {
    mark: "Scope",
    title: "Automate the repetition, never the judgement",
    body: "Machines are excellent at the first draft and the fourth hundred rows. Every build keeps a human gate at the point where being wrong costs something.",
  },
  {
    mark: "Anonymity",
    title: "The mark stands in for the person",
    body: "Brian is deliberately never shown as a face, so the site is the same one behind every login: no account manager between a client and the build.",
  },
];

function PrincipleGrid({
  items,
  accentClass,
}: {
  items: { mark: string; title: string; body: string }[];
  accentClass: string;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((p) => (
        <div key={p.title} className="glass rounded-2xl p-6">
          <span className={`font-mono text-[11px] font-semibold tracking-widest uppercase ${accentClass}`}>
            {p.mark}
          </span>
          <h4 className="mt-2 font-heading text-lg font-semibold text-fg">{p.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{p.body}</p>
        </div>
      ))}
    </div>
  );
}

function StackRow({
  layers,
}: {
  layers: { name: string; chips: string[] }[];
}) {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border sm:grid-cols-4">
      {layers.map((layer, i) => (
        <div
          key={layer.name}
          className={`bg-bg p-5 ${i > 0 ? "border-t border-border sm:border-t-0 sm:border-l" : ""}`}
        >
          <p className="font-mono text-[11px] font-medium tracking-widest text-fg-subtle uppercase">
            {layer.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {layer.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-border-strong bg-bg-panel px-2 py-1 font-mono text-xs text-fg-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CaseHead({
  index,
  tag,
  title,
  intro,
  roleLabel,
  roleBody,
}: {
  index: string;
  tag: string;
  title: string;
  intro: string;
  roleLabel: string;
  roleBody: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div>
        <span className="inline-flex items-center rounded-full bg-bg-tint px-3 py-1 font-mono text-[11px] font-medium tracking-widest text-brand-navy-soft uppercase">
          {index} · {tag}
        </span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">{intro}</p>
      </div>
      <div className="glass rounded-2xl border-l-[3px] border-l-brand-gold p-5">
        <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">{roleLabel}</p>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{roleBody}</p>
      </div>
    </div>
  );
}

export default function CliftonFlackPortfolio() {
  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6">
        <nav
          aria-label="Primary"
          className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
        >
          <a href="/" className="flex min-h-11 cursor-pointer items-center gap-2">
            <Image
              src="/brand/brian-mark-compact.svg"
              alt=""
              aria-hidden="true"
              width={26}
              height={20}
            />
            <span className="font-heading text-sm font-semibold tracking-tight text-fg">
              Clifton Flack
            </span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="cursor-pointer text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <a
              href="/"
              className="hidden min-h-11 items-center rounded-full border border-border-strong px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:border-brand-navy hover:text-brand-navy md:inline-flex"
            >
              GetBrian.xyz
            </a>
            <MobileNav links={navLinks} ctaHref="/" ctaLabel="GetBrian.xyz" />
          </div>
        </nav>
      </header>

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-20 sm:pt-48">
          <div className="mx-auto grid max-w-6xl items-end gap-y-12 lg:grid-cols-[1.3fr_1fr] lg:gap-x-12">
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-fg-muted uppercase">
                Three consumer healthcare systems
              </span>
              <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
                <Clauses of={["Trust before", "transaction."]} />
              </h1>
              <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-muted">
                Consumer healthcare has a credibility problem before it has a
                conversion problem. Three builds, each one an attempt to
                solve the first so the second takes care of itself.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <dl className="glass rounded-2xl p-6">
                <div className="border-b border-border pb-4">
                  <dt className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                    Discipline
                  </dt>
                  <dd className="mt-1 text-sm text-fg-muted">
                    Commercial strategy, B2C growth, and the AI systems underneath both
                  </dd>
                </div>
                <div className="border-b border-border py-4">
                  <dt className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                    Sectors
                  </dt>
                  <dd className="mt-1 text-sm text-fg-muted">
                    Medical foods, pharmaceutical, consumer wellness, applied AI
                  </dd>
                </div>
                <div className="pt-4">
                  <dt className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                    Method
                  </dt>
                  <dd className="mt-1 text-sm text-fg-muted">
                    Build the trust asset first. Prove the channel. Then spend behind it
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ============ VANCE HEALTH HUB ============ */}
        <section id="vance" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <CaseHead
                index="01"
                tag="Live · Medical foods"
                title="Vance Health Hub"
                intro="The public face of a private system. The Hub is what IBD, Crohn's and IBS patients see: a free self-assessment, a 24/7 AI health assistant, and clinical reviews written for people, not journals. Behind it sits the Vance HQ stack that writes, publishes and answers on its own."
                roleLabel="My role"
                roleBody={
                  <>
                    Chief Commercial Officer, SLA Pharma. Conceived the model,
                    specified the architecture, and briefed{" "}
                    <span className="font-semibold text-fg">GetBrian</span> to
                    build the stack that runs it.
                  </>
                }
              />
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <CaseShot
                src="/screenshots/vancehealthhub.jpg"
                alt="Vance Health Hub homepage screenshot"
                url="vancehealthhub.co.uk"
                sizes="(max-width: 1024px) 100vw, 1120px"
              />
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
                <b className="text-fg">The trust asset.</b> The Hub went live
                before commerce did. Its job is credibility and a qualified,
                data-rich list, a self-assessment and VANCE-Ai answering
                questions around the clock, not a basket.
              </p>
            </Reveal>

            <div className="mt-16">
              <h3 className="font-heading text-xl font-semibold text-fg">Marketing ideology</h3>
              <div className="mt-6">
                <PrincipleGrid items={vancePrinciples} accentClass="text-brand-navy-soft" />
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-heading text-xl font-semibold text-fg">Tech stack</h3>
              <div className="mt-6">
                <StackRow
                  layers={[
                    { name: "Front end", chips: ["Next.js", "React", "Vercel", "WordPress"] },
                    { name: "Data & commerce", chips: ["Supabase", "Postgres", "Shopify", "Stripe"] },
                    { name: "Automation & AI", chips: ["n8n", "Hetzner", "Claude", "MCP servers"] },
                    { name: "Lifecycle & ops", chips: ["Email automation", "SOP register", "Uptime alerting", "GA4"] },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ CIITECH ============ */}
        <section id="ciitech" className="border-t border-border bg-bg-panel px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <CaseHead
                index="02"
                tag="Founded & built · Consumer wellness"
                title="CiiTECH"
                intro="Three properties, three jobs, one funnel. A research company that made the science credible, an academy that made the category understandable, and Provacan, the consumer brand that made it purchasable."
                roleLabel="My role"
                roleBody="Founder and CEO. Conceived it, built it, and grew Provacan into a leading UK brand in its category, before the venture wound down."
              />
            </Reveal>

            <Reveal delay={80} className="grid gap-6 sm:grid-cols-3">
              <div>
                <CaseShot
                  src="/screenshots/cliftonflack-ciitechlabs.jpg"
                  alt="CiiTECH research site hero image"
                  url="ciitech.co.il"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">The science comes first.</b>{" "}
                  UK-Israeli research company built on academic partnership,
                  clinical collaboration, and a supply chain we could stand
                  behind in public.
                </p>
              </div>
              <div>
                <CaseShot
                  src="/screenshots/cliftonflack-ciitech.png"
                  alt="CiiTECH Academy: retail and pharmacy education"
                  url="ciitech.academy"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">Learn the category before you sell it.</b>{" "}
                  Free, certificated modules for retailers and pharmacists in
                  a market where almost nobody could explain what they were
                  buying.
                </p>
              </div>
              <div>
                <CaseShot
                  src="/screenshots/cliftonflack-provacan.jpg"
                  alt="Provacan wordmark"
                  url="provacan.co.uk"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">More support, less to think about.</b>{" "}
                  A laddered oil range, subscribe &amp; save, third-party lab
                  reports, a 30-day guarantee. Provacan is still trading
                  today.
                </p>
              </div>
            </Reveal>

            <div className="mt-16">
              <h3 className="font-heading text-xl font-semibold text-fg">Marketing ideology</h3>
              <div className="mt-6">
                <PrincipleGrid items={ciitechPrinciples} accentClass="text-brand-gold-deep" />
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-heading text-xl font-semibold text-fg">Tech stack</h3>
              <div className="mt-6">
                <StackRow
                  layers={[
                    { name: "Commerce", chips: ["Shopify Plus", "Recharge", "Loyalty & rewards"] },
                    { name: "Learning", chips: ["WordPress", "LMS & modules", "Gated capture"] },
                    { name: "Lifecycle", chips: ["Klaviyo", "Segmented flows", "Quiz routing"] },
                    { name: "Proof & measurement", chips: ["Trustpilot", "Lab report library", "GA", "Search Console"] },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ GETBRIAN ============ */}
        <section id="getbrian" className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <CaseHead
                index="03"
                tag="Ongoing · Applied AI"
                title="GetBrian.xyz"
                intro={
                  "This site. Most operators rent software that does eighty percent of what they need, forever. Brian builds the hundred percent: a £2,500 build fee, half of what they were already paying for three years, then the system is theirs outright."
                }
                roleLabel="My role"
                roleBody="Founder. Scoping, designing, writing it with agentic tooling, shipping it, and running the ones that are live. Brian is the anonymous mark; I'm the person behind it."
              />
            </Reveal>

            <Reveal delay={80} className="mt-12 grid gap-6 sm:grid-cols-2">
              <div>
                <CaseShot
                  src="/screenshots/contentflowsuite.jpg"
                  alt="BrianContentFlow screenshot"
                  url="flow.getbrian.xyz"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">ContentFlow.</b> A plain-language-editable
                  WordPress theme, AI content generator, and feedback tool in one
                  plugin. One settings hub, not four logins that never talk to
                  each other.
                </p>
              </div>
              <div>
                <CaseShot
                  src="/screenshots/crm.jpg"
                  alt="Brian CRM screenshot"
                  url="crm.getbrian.xyz"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">CRM.</b> Built for leisure and
                  licensed property. MatchMaker scores every requirement
                  against every listing on the detail that decides the deal:
                  use class, licence, covers, extraction.
                </p>
              </div>
              <div>
                <CaseShot
                  src="/screenshots/dealmaker.jpg"
                  alt="Brian DealMaker screenshot"
                  url="dealmaker.getbrian.xyz"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">DealMaker.</b> One automated pipeline
                  that sources leads, drafts outreach, captures replies, and
                  books meetings, in a stage flow fully customised per
                  industry.
                </p>
              </div>
              <div>
                <CaseShot
                  src="/screenshots/diffdoc.jpg"
                  alt="Brian DiffDoc screenshot"
                  url="diffdoc.getbrian.xyz"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                  <b className="text-fg">DiffDoc.</b> Reads two versions of a
                  document, marks up exactly what changed, and exports an
                  audit-ready copy, for people who read contracts.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-8">
              <div className="glass rounded-2xl p-6">
                <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                  Live for
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  Merlows News · Empirely Game · GetForged · The Rising Lions
                  · HYDRGEL · Vance Health Hub
                </p>
              </div>
            </Reveal>

            <div className="mt-16">
              <h3 className="font-heading text-xl font-semibold text-fg">Marketing ideology</h3>
              <div className="mt-6">
                <PrincipleGrid items={brianPrinciples} accentClass="text-brand-gold-deep" />
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-heading text-xl font-semibold text-fg">Tech stack</h3>
              <div className="mt-6">
                <StackRow
                  layers={[
                    { name: "Build", chips: ["Claude Code", "Agentic workflows", "MCP servers"] },
                    { name: "Application", chips: ["Next.js", "Vercel", "TypeScript", "Tailwind"] },
                    { name: "Data", chips: ["Supabase", "Postgres", "Row-level security"] },
                    { name: "Orchestration", chips: ["n8n", "Hetzner", "Self-hosted workers"] },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ CLOSE ============ */}
        <section id="principles" className="border-t border-border px-6 py-24">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                What carries across all three
              </p>
              <p className="mt-4 font-heading text-2xl leading-snug font-semibold tracking-tight text-fg sm:text-3xl">
                Every one of these started with the same bet: that in health
                and wellness, the business that{" "}
                <span className="brand-gradient-text">earns belief first</span>{" "}
                gets to keep the customer, and the one that buys attention
                first has to keep buying it.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-fg-muted">
                I&apos;m most useful where a consumer business needs someone
                who can hold the P&amp;L, write the growth plan, then go and
                build the thing the plan depends on, which is the whole
                premise of{" "}
                <a href="/" className="cursor-pointer underline decoration-1 underline-offset-2">
                  GetBrian
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                How I work
              </p>
              <div className="mt-4 divide-y divide-border">
                {[
                  ["Sequence trust ahead of conversion", "always"],
                  ["Gate spend on evidence, not conviction", "always"],
                  ["Separate the jobs a property is doing", "structure"],
                  ["Automate repetition, gate judgement", "systems"],
                  ["Own the infrastructure that matters", "leverage"],
                  ["Do the work before delegating it", "leadership"],
                  ["Then give good people room to run", "leadership"],
                ].map(([line, tag]) => (
                  <div key={line} className="flex items-baseline justify-between gap-4 py-3">
                    <p className="text-fg-muted">{line}</p>
                    <span className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section className="relative overflow-hidden border-t border-border px-6 py-24">
          <div
            aria-hidden="true"
            className="blob blob-deep animate-float-slow h-[420px] w-[560px] -bottom-40 left-1/2 -translate-x-1/2"
          />
          <Reveal className="relative mx-auto max-w-4xl">
            <div className="glass rounded-3xl px-8 py-16 text-center sm:px-16">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                <Clauses of={["Want the stack behind one of these?", "Get Brian."]} />
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed text-fg-muted">
                Tell me what you&apos;re paying for right now. I&apos;ll show
                you what it looks like owned instead of rented.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="mailto:hello@getbrian.xyz"
                  className="w-full cursor-pointer rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-brand-gold-hover sm:w-auto"
                >
                  hello@getbrian.xyz
                </a>
                <a
                  href="/"
                  className="glass glass-hover w-full cursor-pointer rounded-full px-6 py-3 text-sm font-semibold text-brand-navy-soft sm:w-auto"
                >
                  See all of Brian&apos;s work
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto max-w-6xl text-center text-xs text-fg-subtle">
          CiiTECH and CiiTECH Labs screenshots are archived via the Wayback
          Machine; the ventures wound down before Provacan, which is still
          trading. Live properties: vancehealthhub.co.uk · provacan.co.uk ·{" "}
          <a href="/" className="cursor-pointer underline decoration-1 underline-offset-2">
            getbrian.xyz
          </a>
        </div>
      </footer>
    </>
  );
}
