import type { Metadata } from "next";
import Link from "next/link";
import { healthyOpenGraph } from "../layout";
import { FdaDisclaimer, GradeBadge, PageHeading, Prose } from "../components";
import { getProduct, gradeLabels, type EvidenceGrade } from "../data";

const grades: EvidenceGrade[] = ["strong", "moderate", "early"];

const title = "Why these picks";
const description =
  "How each current pick was chosen, what its brand claims about testing and research, and the independent evidence grade Brian assigns each claim.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/healthy/why-these-picks" },
  openGraph: { ...healthyOpenGraph, title, description, url: "/healthy/why-these-picks" },
};

type BrandClaim = {
  claim: string;
  source: string;
};

type ProductReference = {
  slug: string;
  /** Other real products considered and passed over in this category, for a named comparison. */
  alsoConsidered: string[];
  brandClaims: BrandClaim[];
  ourRead: string;
  say: string[];
  dontSay: string[];
};

const references: ProductReference[] = [
  {
    slug: "thorne-magnesium-glycinate",
    alsoConsidered: ["Micro Ingredients Magnesium Glycinate (higher dose, bulkier pack)", "Nature Made Magnesium Glycinate (familiar pharmacy brand, lower elemental dose)"],
    brandClaims: [
      {
        claim:
          "“9 out of 10 consumers reported sleeping better and feeling calmer in stressful moments”",
        source: "Thorne, 28-day consumer perception study, 95 participants (company-run, not published or peer-reviewed)",
      },
      {
        claim: "As many as 75% of U.S. adults do not meet the FDA's recommended daily intake of 420 mg of magnesium",
        source: "Thorne product page, citing World Health Organization statistics",
      },
      {
        claim: "Magnesium is a cofactor in more than 600 of the body's enzymatic reactions",
        source: "Thorne product page",
      },
    ],
    ourRead:
      "The deficiency statistic and the enzyme-cofactor claim line up with the independent NIH fact sheet cited on the product page, so we treat those as strong evidence. The “9 out of 10” figure is the brand's own unpublished consumer survey of 95 people, not a controlled trial — it belongs in marketing copy as a customer-satisfaction note, not as clinical evidence. The actual randomized trial on magnesium and sleep found sleep improved on both magnesium and placebo, so the evidence grade for sleep stays “early” either way.",
    say: [
      "Supports normal muscle and nerve function (strong evidence — NIH)",
      "Supports normal energy metabolism (strong evidence — NIH)",
      "May support sleep quality in adults who fall short on dietary magnesium (early evidence)",
    ],
    dontSay: [
      "“Clinically proven to improve sleep” — the controlled trial found placebo worked just as well",
      "“9 out of 10 people” without naming it as the brand's own 95-person consumer survey",
      "Any claim that this specific capsule is NSF Certified for Sport — that mark belongs to this brand's magnesium bisglycinate powder, not this glycinate capsule",
    ],
  },
  {
    slug: "thorne-creatine-stick-packs",
    alsoConsidered: ["Nutricost Performance Creatine Monohydrate (lower cost per gram, out of stock at review time)", "Optimum Nutrition Micronized Creatine Powder (familiar sports-nutrition brand, needs a scoop)"],
    brandClaims: [
      {
        claim: "NSF Certified for Sport — every batch tested for label accuracy and near 300 banned substances",
        source: "Brand's product page and the NSF certification program",
      },
      {
        claim: "Supports cognitive function and a healthy body composition, especially in the aging population",
        source: "Brand's product page",
      },
    ],
    ourRead:
      "The NSF Certified for Sport claim is independently verifiable through NSF's own program, not just the brand's word, so we treat it as a fact rather than a marketing claim. The strength and lean-mass benefits are backed by real meta-analyses in older adults. The cognitive claim is the weakest of the three: promising early research, nothing settled.",
    say: [
      "Supports muscle strength when combined with resistance training (strong evidence)",
      "Supports lean muscle mass with regular training (moderate evidence)",
      "NSF Certified for Sport, independently verifiable batch testing",
    ],
    dontSay: [
      "“Proven brain benefits” or “improves focus” — cognitive research on creatine is early, not established (see the honest caveat on the creatine card)",
      "“Clean” or “safe for athletes” as a substitute for naming the actual NSF Certified for Sport mark",
    ],
  },
  {
    slug: "thorne-theanine",
    alsoConsidered: ["NOW Foods L-Theanine (cheapest per capsule, includes added inositol)", "Life Extension Theanine XR Stress Relief (highest single dose, extended-release format)"],
    brandClaims: [
      {
        claim: "Suntheanine® has been the subject of at least 50 studies over the past 20 years",
        source: "Brand's product page",
      },
      {
        claim: "200 mg of L-theanine increased alpha brain waves and relaxation starting about 40 minutes after intake",
        source: "Brand's product page, citing a Japanese study",
      },
      {
        claim: "Third-party tested to verify label accuracy and screen for heavy metals, pesticides and microorganisms",
        source: "Brand's product page",
      },
    ],
    ourRead:
      "“At least 50 studies” is the brand's tally across the ingredient (not this specific product), and it mixes human trials, animal studies and manufacturer-funded work. The independent research we cite below is a systematic review of 9 human randomized controlled trials on stress and anxiety, and a separate crossover trial measuring brain activity directly — real, but smaller and narrower than “50 studies” implies. The alpha-wave effect showed up only in people who ran higher in trait anxiety to begin with.",
    say: [
      "May support relaxation and a calmer response to everyday stress (moderate evidence, 9-RCT systematic review)",
      "May increase alpha brain-wave activity linked to relaxed wakefulness (early evidence)",
      "Suntheanine is the branded form most human studies actually use",
    ],
    dontSay: [
      "“50 clinical studies” without qualifying that the figure spans animal research and manufacturer-funded work, not 50 independent human trials",
      "“Works like a sedative” or any sleep-specific claim — the evidence is for relaxed alertness, not sedation",
      "Any NSF Certified for Sport claim — this SKU does not carry that mark",
    ],
  },
];

function BrandCard({ entry: r }: { entry: ProductReference }) {
  const product = getProduct(r.slug);
  if (!product) return null;
  return (
    <div className="rounded-2xl border border-border p-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">{product.category}</p>
      <h3 className="mt-1 font-heading text-xl font-semibold text-brand-navy">
        <Link href={`/healthy/products/${product.slug}`} className="underline-offset-4 hover:underline">
          {product.brand} {product.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-fg-subtle">
        Also considered: {r.alsoConsidered.join("; ")}.
      </p>

      <h4 className="mt-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">What the brand claims</h4>
      <ul className="mt-2 space-y-3">
        {r.brandClaims.map((c) => (
          <li key={c.claim} className="text-base leading-relaxed">
            <span className="text-fg">&ldquo;{c.claim.replace(/[“”]/g, "")}&rdquo;</span>
            <span className="block text-sm text-fg-subtle">&mdash; {c.source}</span>
          </li>
        ))}
      </ul>

      <h4 className="mt-5 text-sm font-semibold uppercase tracking-wider text-fg-subtle">Brian&apos;s read</h4>
      <p className="mt-2 leading-relaxed text-fg-muted">{r.ourRead}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-bg-tint p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-gold-deep">Safe to say</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-muted">
            {r.say.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-bg-panel p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-fg-subtle">Don&apos;t say</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-fg-muted">
            {r.dontSay.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function WhyThesePicksPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <PageHeading
          eyebrow="Why these picks"
          title="How each pick was chosen, and what its brand claims"
          lead="Brian's method (see how we choose) grades the ingredient first, the label second, then names the brand only once both pass. This page is the reference for how a claim moves from brand marketing to a graded statement on this site — the receipts behind each review, and what's safe to say when writing about these three products."
        />

        <div className="mt-12">
          <Prose>
            <h2>Why one brand across all three</h2>
            <ul>
              <li>Every pick ships with a single named ingredient at a fixed dose, so the label matches what the research actually studied instead of a proprietary blend.</li>
              <li>Manufactured in the brand's own US facility, with four rounds of in-house testing on every batch plus third-party verification, rather than white-labeled from a contract manufacturer.</li>
              <li>The creatine carries NSF Certified for Sport, a mark issued by NSF International, not the brand itself &mdash; independently verifiable, unlike a brand's own quality claims.</li>
              <li>Selling direct means one consistent price and label source to check, instead of reconciling figures across several retailers.</li>
            </ul>
            <p>
              None of that is a substitute for the ingredient-level evidence review each product page carries. It's why, once the research and the label both passed muster, this brand kept winning the comparison against the named alternatives below. If a better-evidenced or better-priced option appears in a re-check, the pick changes; this page gets updated when it does.
            </p>
          </Prose>
        </div>

        <div className="mt-14 space-y-10">
          <h2 className="font-heading text-2xl font-semibold text-brand-navy">
            Claim by claim: brand copy vs. the evidence grade
          </h2>
          {references.map((r) => (
            <BrandCard key={r.slug} entry={r} />
          ))}
        </div>

        <div className="mt-14 max-w-3xl">
          <Prose>
            <h2>How to read the grades</h2>
            <p>
              Every claim above still carries one of three grades, explained in full in{" "}
              <Link href="/healthy/method">how we choose</Link>:
            </p>
            <ul>
              {grades.map((g) => (
                <li key={g}>
                  <GradeBadge grade={g} /> &mdash; {gradeLabels[g].meaning}
                </li>
              ))}
            </ul>
            <p>
              A brand&apos;s own marketing claim never raises a grade on its own. It has to be backed by the kind
              of independent citation shown on each product page.
            </p>
          </Prose>
        </div>

        <div className="mt-12 max-w-3xl">
          <FdaDisclaimer />
        </div>
      </div>
    </div>
  );
}
