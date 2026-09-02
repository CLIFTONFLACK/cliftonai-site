import type { Metadata } from "next";
import { Reveal } from "../../reveal";
import { siteUrl } from "../../layout";
import { CaseShot, CaseHead, PrincipleGrid, StackRow } from "../components";

export const metadata: Metadata = {
  title: "GetBrian.xyz | Clifton Flack",
  description:
    "GetBrian: an AI build studio that replaces rented software with owned systems. ContentFlow, a CRM, DealMaker, DiffDoc, and the client work behind them, built and run by Clifton Flack.",
  alternates: { canonical: "/cliftonflack/getbrian" },
  openGraph: {
    title: "GetBrian.xyz | Clifton Flack",
    description: "An AI build studio that replaces rented software with owned systems.",
    url: `${siteUrl}/cliftonflack/getbrian`,
    siteName: "GetBrian",
    type: "profile",
  },
};

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

export default function GetBrianCasePage() {
  return (
    <main className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <CaseHead
            index="03"
            tag="Ongoing · Applied AI"
            title="GetBrian.xyz"
            intro="This site. Most operators rent software that does eighty percent of what they need, forever. Brian builds the hundred percent: half of what they were already paying for three years, then the system is theirs outright."
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
              priority
            />
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">ContentFlow.</b> A
              plain-language-editable WordPress theme, AI content generator,
              and feedback tool in one plugin. One settings hub, not four
              logins that never talk to each other.
            </p>
          </div>
          <div>
            <CaseShot
              src="/screenshots/crm.jpg"
              alt="Brian CRM screenshot"
              url="crm.getbrian.xyz"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">CRM.</b> Built for leisure
              and licensed property. MatchMaker scores every requirement
              against every listing on the detail that decides the deal: use
              class, licence, covers, extraction.
            </p>
          </div>
          <div>
            <CaseShot
              src="/screenshots/dealmaker.jpg"
              alt="Brian DealMaker screenshot"
              url="dealmaker.getbrian.xyz"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">DealMaker.</b> One
              automated pipeline that sources leads, drafts outreach,
              captures replies, and books meetings, in a stage flow fully
              customised per industry.
            </p>
          </div>
          <div>
            <CaseShot
              src="/screenshots/diffdoc.jpg"
              alt="Brian DiffDoc screenshot"
              url="diffdoc.getbrian.xyz"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">DiffDoc.</b> Reads two
              versions of a document, marks up exactly what changed, and
              exports an audit-ready copy, for people who read contracts.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="cf-clay p-6">
            <p className="text-xs font-semibold tracking-wide text-[var(--cf-ink-subtle)] uppercase">
              Live for
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              Merlows News · Empirely Game · GetForged · The Rising Lions ·
              HYDRGEL · Vance Health Hub
            </p>
          </div>
        </Reveal>

        <div className="mt-20">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Marketing ideology</h3>
          <div className="mt-6">
            <PrincipleGrid items={brianPrinciples} />
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Tech stack</h3>
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

        <Reveal delay={100} className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--cf-line)] pt-8">
          <a href="/cliftonflack/ciitech" className="cf-clay-ghost cursor-pointer px-5 py-2.5 text-sm font-semibold text-[var(--cf-navy)]">
            ← CiiTECH
          </a>
          <a href="/" className="cf-clay-cta cursor-pointer px-5 py-2.5 text-sm font-semibold">
            hello@getbrian.xyz →
          </a>
        </Reveal>
      </div>
    </main>
  );
}
