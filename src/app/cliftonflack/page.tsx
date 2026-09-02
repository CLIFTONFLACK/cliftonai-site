import type { Metadata } from "next";
import Image from "next/image";
import { Clauses } from "../clauses";
import { Reveal } from "../reveal";
import { siteUrl } from "../layout";
import { CaseShot, SectionLabel } from "./components";

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

const howIWork = [
  {
    mark: "Sequence",
    title: "Credibility is the first product",
    body: "In a low-trust or regulated category you can't buy your way past scepticism. The trust asset ships before commerce does, so by the time there's something to sell, there's already a reason to believe it.",
  },
  {
    mark: "Spend",
    title: "Paid media follows proof, never precedes it",
    body: "Budget is gated on organic traction. Paid starts as a learning line, not a growth line, and only scales behind a channel that's already shown it converts. A plan that needs the ad budget to work isn't a plan.",
  },
  {
    mark: "Structure",
    title: "Separate the jobs, separate the properties",
    body: "Credibility, education and commerce want different tones, different proof, different calls to action. Forcing them onto one site or one page makes all three less convincing.",
  },
  {
    mark: "Systems",
    title: "Automate the repetition, never the judgement",
    body: "Machines are excellent at the first draft and the fourth hundred rows. Every build keeps a human gate at the point where being wrong actually costs something, clinical review, PV, a signed-off brief.",
  },
  {
    mark: "Leverage",
    title: "Own the infrastructure that matters",
    body: "Rented software is a permanent tax on a growing business. Where it's mine to decide, I build the stack rather than subscribe to it, so the cost curve bends the right way as it scales.",
  },
  {
    mark: "Practice",
    title: "Do the work before you sell the plan",
    body: "I build the thing to find out where it actually breaks. GetBrian's own tools run my own businesses first, that's not a hobby detour from commercial strategy, it's how the judgement gets calibrated.",
  },
  {
    mark: "Proof",
    title: "Publish what you'd rather not have to",
    body: "Lab reports, third-party testing, an honest guarantee, a named clinical reviewer. In an unregulated or low-trust corner of a market, showing your working is a durable commercial position.",
  },
  {
    mark: "Anonymity",
    title: "The mark stands in for the person",
    body: "Brian is never shown as a face, on purpose, so the client sees the same system behind every login. No account manager between them and the build, no persona to sell instead of the work.",
  },
];

const cases = [
  {
    href: "/cliftonflack/vance-health-hub",
    index: "01",
    tag: "Live · Medical foods",
    name: "Vance Health Hub",
    hook: "The public face of a private system, a free self-assessment, a 24/7 AI health assistant, and the full Vance HQ marketing stack running behind it.",
    screenshot: "/screenshots/vancehealthhub-v2.png",
    url: "vancehealthhub.co.uk",
  },
  {
    href: "/cliftonflack/ciitech",
    index: "02",
    tag: "Founded & built · Consumer wellness",
    name: "CiiTECH",
    hook: "Three properties, three jobs, one funnel: research credibility, category education, and Provacan, the commerce layer that made it purchasable.",
    screenshot: "/screenshots/cliftonflack-ciitechlabs.jpg",
    url: "ciitech.co.il",
  },
  {
    href: "/cliftonflack/getbrian",
    index: "03",
    tag: "Ongoing · Applied AI",
    name: "GetBrian.xyz",
    hook: "This site. An AI build studio that replaces rented software with owned systems, ContentFlow, a CRM, DealMaker, DiffDoc, built and run by one person.",
    screenshot: "/screenshots/contentflowsuite.jpg",
    url: "getbrian.xyz",
  },
];

export default function CliftonFlackHome() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-8 pb-20 sm:pt-12">
        <div className="mx-auto grid max-w-6xl items-end gap-y-12 lg:grid-cols-[1.3fr_1fr] lg:gap-x-12">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="cf-clay-inset inline-flex items-center px-8 py-3 text-base font-medium tracking-wide text-[var(--cf-ink-muted)] uppercase">
                My preferred portfolio
              </span>
              <span className="cf-clay-inset inline-flex items-center gap-2 px-6 py-3 text-base font-medium tracking-wide text-[var(--cf-ink-muted)] uppercase">
                Built for
                <Image src="/brand/helfy-logo.png" alt="Helfy" width={72} height={45} className="h-6 w-auto" />
              </span>
            </div>
            <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-[var(--cf-ink)] sm:text-5xl">
              <Clauses of={["Trust before", "transaction."]} />
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-[var(--cf-ink-muted)]">
              Consumer healthcare has a credibility problem before it has a
              conversion problem. Three builds, each one an attempt to solve
              the first so the second takes care of itself.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="cf-clay p-6">
              <div className="border-b border-[var(--cf-line)] pb-4">
                <dt className="font-mono text-[11px] tracking-widest text-[var(--cf-ink-subtle)] uppercase">
                  Discipline
                </dt>
                <dd className="mt-1 text-sm text-[var(--cf-ink-muted)]">
                  Commercial strategy, B2C growth, and the AI systems underneath both
                </dd>
              </div>
              <div className="border-b border-[var(--cf-line)] py-4">
                <dt className="font-mono text-[11px] tracking-widest text-[var(--cf-ink-subtle)] uppercase">
                  Sectors
                </dt>
                <dd className="mt-1 text-sm text-[var(--cf-ink-muted)]">
                  Medical foods, pharmaceutical, consumer wellness, applied AI
                </dd>
              </div>
              <div className="pt-4">
                <dt className="font-mono text-[11px] tracking-widest text-[var(--cf-ink-subtle)] uppercase">
                  Method
                </dt>
                <dd className="mt-1 text-sm text-[var(--cf-ink-muted)]">
                  Build the trust asset first. Prove the channel. Then spend behind it
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Case links */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Favourite Marketing Systems</SectionLabel>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {cases.map((c, i) => (
              <Reveal key={c.href} delay={i * 90}>
                <a href={c.href} className="cf-clay cf-clay-hover group block h-full cursor-pointer p-0">
                  <CaseShot src={c.screenshot} alt={`${c.name} screenshot`} url={c.url} sizes="(max-width: 1024px) 100vw, 33vw" priority={i === 0} />
                  <div className="p-6">
                    <span className="font-mono text-[11px] font-medium tracking-widest text-[var(--cf-gold-deep)] uppercase">
                      {c.index} · {c.tag}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-[var(--cf-ink)]">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
                      {c.hook}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cf-navy)]">
                      Read the case study
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How I work — expanded */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <SectionLabel>How I work</SectionLabel>
            <p className="mt-4 font-heading text-2xl leading-snug font-semibold tracking-tight text-[var(--cf-ink)] sm:text-3xl">
              Every one of these started with the same bet: that the business
              which <span style={{ color: "var(--cf-gold-deep)" }}>earns belief first</span>{" "}
              gets to keep the customer, and the one that buys attention
              first has to keep buying it.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[var(--cf-ink-muted)]">
              Eight rules, drawn from three builds, that hold regardless of
              category.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howIWork.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div className="cf-clay cf-clay-hover h-full p-5">
                  <span className="font-mono text-[11px] font-semibold tracking-widest text-[var(--cf-gold-deep)] uppercase">
                    {p.mark}
                  </span>
                  <h4 className="mt-2 font-heading text-base font-semibold text-[var(--cf-ink)]">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10">
            <p className="mt-2 text-lg leading-relaxed text-[var(--cf-ink-muted)]">
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
        </div>
      </section>

      {/* Contact */}
      <section className="relative overflow-hidden px-6 py-20">
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <a
            href="https://www.linkedin.com/in/cliftonflack/"
            target="_blank"
            rel="noopener noreferrer"
            className="cf-clay-cta inline-flex cursor-pointer items-center gap-2.5 px-8 py-4 text-base font-semibold"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
            </svg>
            Connect on LinkedIn
          </a>
        </Reveal>
      </section>
    </main>
  );
}
