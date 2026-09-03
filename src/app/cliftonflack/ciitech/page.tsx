import type { Metadata } from "next";
import { Reveal } from "../../reveal";
import { siteUrl } from "../../layout";
import { CaseShot, CaseHead, PrincipleGrid, StackRow } from "../components";

export const metadata: Metadata = {
  title: "CiiTECH & Provacan | Clifton Flack",
  description:
    "CiiTECH: a UK-Israeli research company, an academy that taught the category, and Provacan, the consumer brand that made it purchasable. Founded and built by Clifton Flack.",
  alternates: { canonical: "/cliftonflack/ciitech" },
  openGraph: {
    title: "CiiTECH & Provacan | Clifton Flack",
    description: "Three properties, three jobs, one funnel.",
    url: `${siteUrl}/cliftonflack/ciitech`,
    siteName: "GetBrian",
    type: "profile",
  },
};

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
    body: "First purchase is trust. Second is habit. A laddered range and subscription exist so the customer never has to re-litigate the decision.",
  },
  {
    mark: "Proof",
    title: "Publish what you'd rather not have to",
    body: "Lab reports, third-party testing, an honest guarantee. In an unregulated corner of a health market, showing your working is a durable commercial position.",
  },
];

export default function CiitechPage() {
  return (
    <main className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <CaseHead
            index="02"
            tag="Founded & built · Consumer wellness"
            title="CiiTECH"
            intro="Three properties, three jobs, one funnel. A research company that made the science credible, an academy that made the category understandable, and Provacan, the consumer brand that made it purchasable."
            roleLabel="My role"
            roleBody="Founder and CEO. Conceived it, built it, and grew Provacan into a leading UK brand before the venture wound down."
          />
        </Reveal>

        <Reveal delay={80} className="mt-12 grid gap-6 sm:grid-cols-3">
          <div>
            <CaseShot
              src="/screenshots/cliftonflack-ciitechlabs.jpg"
              alt="CiiTECH research site hero image"
              url="ciitech.co.il"
              sizes="(max-width: 640px) 100vw, 33vw"
              priority
            />
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">The science comes first.</b>{" "}
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
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">Learn the category before you sell it.</b>{" "}
              Free, certificated modules for retailers and pharmacists in a
              market where almost nobody could explain what they were
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
            <p className="mt-3 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              <b className="text-[var(--cf-ink)]">More support, less to think about.</b>{" "}
              A laddered oil range, subscribe &amp; save, third-party lab
              reports, a 30-day guarantee. Provacan is still trading today.
            </p>
          </div>
        </Reveal>

        <div className="mt-20">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Marketing ideology</h3>
          <div className="mt-6">
            <PrincipleGrid items={ciitechPrinciples} />
          </div>
        </div>

        <div className="mt-14">
          <h3 className="font-heading text-xl font-semibold text-[var(--cf-ink)]">Tech stack</h3>
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

        <Reveal delay={100} className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--cf-line)] pt-8">
          <a href="/cliftonflack/vance-health-hub" className="cf-clay-ghost cursor-pointer px-5 py-2.5 text-sm font-semibold text-[var(--cf-navy)]">
            ← Vance Health Hub
          </a>
          <a href="/cliftonflack/getbrian" className="cf-clay-cta cursor-pointer px-5 py-2.5 text-sm font-semibold">
            Next: GetBrian →
          </a>
        </Reveal>
      </div>
    </main>
  );
}
