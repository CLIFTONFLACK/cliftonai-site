import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "../../reveal";
import { siteUrl } from "../../layout";
import { CaseShot, CaseHead, PrincipleGrid, StackRow, StackNode, SectionLabel } from "../components";

export const metadata: Metadata = {
  title: "Vance Health Hub | Clifton Flack",
  description:
    "Vance Health Hub: the public trust asset for SLA Pharma's medical foods business, and the Vance HQ marketing stack, content generator, email, service desk, and alerts, running behind it.",
  alternates: { canonical: "/cliftonflack/vance-health-hub" },
  openGraph: {
    title: "Vance Health Hub | Clifton Flack",
    description: "The public trust asset, and the tech-marketing stack running behind it.",
    url: `${siteUrl}/cliftonflack/vance-health-hub`,
    siteName: "GetBrian",
    type: "profile",
  },
};

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

const stack = [
  {
    name: "Content Generator",
    role: "Origin",
    body: "Briefs, drafts and reference-checks articles, appointment-prep handouts and clinical review copy against the source literature before a human ever sees them.",
    screenshot: "/screenshots/vance-content-generator.png",
  },
  {
    name: "Vance Health Hub",
    role: "Public trust asset",
    body: "The site patients and clinicians actually see: the free self-assessment, VANCE-Ai, and the clinical reviews the generator drafted. Publishes months before commerce opens.",
  },
  {
    name: "Email Marketing Console",
    role: "Lifecycle",
    body: "Segmented sends built from the same content pipeline, the monthly evidence digest, appointment reminders, the self-assessment follow-up sequence.",
    screenshot: "/screenshots/vance-email-console.png",
  },
  {
    name: "Customer Service and SOP Portal",
    role: "Service desk",
    body: "Built straight from the regulatory submission packs, so every patient question is routed by SOP and every answer is traceable, including pharmacovigilance escalation.",
    screenshot: "/screenshots/vance-customer-service.png",
  },
  {
    name: "Alerts",
    role: "Uptime & monitoring",
    body: "Watches every property and worker in the stack and pages a phone, not a dashboard, the moment the site, checkout, email pipeline or an automation worker goes down.",
    screenshot: "/screenshots/vance-alerts.png",
  },
];

export default function VanceHealthHubPage() {
  return (
    <main className="px-6 pb-20">
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
                Chief Commercial Officer, SLA Pharma. Focusing on a digital
                first launch and growth strategy for new B2C healthcare
                business unit.
              </>
            }
          />
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <CaseShot
            src="/screenshots/vancehealthhub-v2.png"
            alt="Vance Health Hub homepage screenshot"
            url="vancehealthhub.co.uk"
            sizes="(max-width: 1024px) 100vw, 1120px"
            priority
          />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--cf-ink-muted)]">
            <b className="text-[var(--cf-ink)]">The trust asset.</b> The Hub
            went live before commerce did. Its job is credibility and a
            qualified, data-rich list, a self-assessment and VANCE-Ai
            answering questions around the clock, not a basket.
          </p>
        </Reveal>

        {/* Tech-marketing stack */}
        <div className="mt-20">
          <SectionLabel>The Vance ecosystem, as a tech-marketing stack</SectionLabel>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-[var(--cf-ink)] sm:text-3xl">
            One pipeline, five jobs
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--cf-ink-muted)]">
            The Hub is the only part a patient sees. Behind it, content
            generation feeds the Hub and email, the service desk closes the
            loop with patients directly, and alerting watches the whole
            chain, so a five-person job runs on one.
          </p>
          <div className="relative mt-6 aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--cf-line)]">
            <Image
              src="/screenshots/vance-hq.png"
              alt="Vance HQ, the internal directory tying every system together"
              fill
              sizes="(max-width: 1024px) 100vw, 672px"
              className="object-cover object-top"
            />
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--cf-ink-muted)]">
            <b className="text-[var(--cf-ink)]">Vance HQ.</b> The internal
            directory every system above sits behind, one login into the
            whole estate.
          </p>
          <div className="mt-8">
            {stack.map((node, i) => (
              <StackNode
                key={node.name}
                index={i + 1}
                name={node.name}
                role={node.role}
                body={node.body}
                screenshot={node.screenshot}
                last={i === stack.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Marketing ideology</h3>
          <div className="mt-6">
            <PrincipleGrid items={vancePrinciples} />
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Tech stack</h3>
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

        <Reveal delay={100} className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--cf-line)] pt-8">
          <a href="/cliftonflack" className="cf-clay-ghost cursor-pointer px-5 py-2.5 text-sm font-semibold text-[var(--cf-navy)]">
            ← All case studies
          </a>
          <a href="/cliftonflack/ciitech" className="cf-clay-cta cursor-pointer px-5 py-2.5 text-sm font-semibold">
            Next: CiiTECH →
          </a>
        </Reveal>
      </div>
    </main>
  );
}
