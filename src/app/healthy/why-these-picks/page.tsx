import type { Metadata } from "next";
import Link from "next/link";
import { healthyOpenGraph } from "../layout";
import { FdaDisclaimer, GradeBadge, PageHeading, Prose } from "../components";
import { getProduct, gradeLabels, products, type EvidenceGrade } from "../data";
import { references, type ProductReference } from "./references";

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

function BrandCard({ entry: r }: { entry: ProductReference }) {
  const product = getProduct(r.slug);
  if (!product) return null;
  return (
    <div className="rounded-2xl border border-border p-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-kinetic-primary-electric">{product.category}</p>
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
    </div>
  );
}

export default function WhyThesePicksPage() {
  // Named from the data, so the copy stays right if the lineup changes brand.
  const brands = [...new Set(products.map((p) => p.brand))];
  const brand = brands.length === 1 ? brands[0] : null;
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <PageHeading
          eyebrow="Why these picks"
          title="How each pick was chosen, and what its brand claims"
          lead="Brian grades the ingredient first and the label second, and only then picks a product. These are the receipts: what each brand claims, what the evidence actually supports, and the alternatives each pick beat."
        />

        <div className="mt-12">
          <Prose>
            <h2>{brand ? `Why ${brand} across all three` : "Why these brands"}</h2>
            <ul>
              <li>Every pick ships with a single named ingredient at a fixed dose, so the label matches what the research actually studied instead of a proprietary blend.</li>
              <li>Manufactured in the brand's own US facility, with four rounds of in-house testing on every batch plus third-party verification, rather than white-labeled from a contract manufacturer.</li>
              <li>The creatine carries NSF Certified for Sport, a mark issued by NSF International, not the brand itself &mdash; independently verifiable, unlike a brand's own quality claims.</li>
              <li>Selling direct means one consistent price and label source to check, instead of reconciling figures across several retailers.</li>
            </ul>
            <p>
              None of that is a substitute for the ingredient-level evidence review each product page carries. It's why, once the research and the label both passed muster, {brand ?? "this brand"} kept winning the comparison against the named alternatives below. If a better-evidenced or better-priced option appears in a re-check, the pick changes; this page gets updated when it does.
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
