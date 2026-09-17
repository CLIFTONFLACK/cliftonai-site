import type { Metadata } from "next";
import { healthyOpenGraph } from "../../layout";
import Link from "next/link";
import { BuyButton, FdaDisclaimer, PageHeading, Pending, Prose } from "../../components";
import { costPerServing, products } from "../../data";

const title = "Creatine gummies vs powder";
const description =
  "Creatine gummies or powder? A side-by-side of dose, cost per serving, testing and convenience for adults over 40.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/healthy/compare/creatine" },
  openGraph: { ...healthyOpenGraph, title, description, url: "/healthy/compare/creatine" },
};

const creatine = products.filter((p) => p.category === "Creatine");

function usd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CompareCreatinePage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <PageHeading
          eyebrow="Compare"
          title="Creatine: gummies or powder?"
          lead="Both deliver creatine monohydrate, the form used in the research. The difference is cost, certainty of dose, and whether you will actually take it every day."
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">Creatine products compared</caption>
            <thead>
              <tr className="border-b border-border-strong">
                <th scope="col" className="py-3 pr-4 font-semibold text-fg">
                  <span className="sr-only">Attribute</span>
                </th>
                {creatine.map((p) => (
                  <th key={p.slug} scope="col" className="py-3 pr-4 align-bottom font-heading text-xl font-semibold text-brand-navy">
                    <Link href={`/healthy/products/${p.slug}`} className="underline-offset-4 hover:underline">
                      {p.brand} {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-fg-muted">
              <Row label="Format" values={creatine.map((p) => p.format)} />
              <Row label="Creatine per serving" values={creatine.map((p) => p.ingredients[0]?.amount ?? null)} />
              <Row label="Servings per container" values={creatine.map((p) => p.servingsPerContainer?.toString() ?? null)} />
              <Row
                label="Cost per serving"
                values={creatine.map((p) => {
                  const c = costPerServing(p);
                  return c === null ? null : usd(c);
                })}
              />
              <Row label="Independent testing" values={creatine.map((p) => (p.testing.length ? p.testing.join("; ") : null))} />
              <Row label="Best for" values={creatine.map((p) => p.bestFor[0] ?? null)} />
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {creatine.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-border p-6">
              <p className="font-heading text-lg font-semibold text-brand-navy">
                {p.brand} {p.name}
              </p>
              <div className="mt-4">
                <BuyButton product={p} from="compare-creatine" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-3xl">
          <Prose>
            <h2>Which should you choose?</h2>
            <p>
              If cost matters most, powder wins: plain creatine monohydrate is one of the cheapest
              supplements with strong research behind it. If you have bought a tub before and
              stopped using it, a gummy you actually take beats a powder you do not.
            </p>
            <p>
              Whichever you pick, the research that supports creatine for strength involved taking it
              every day alongside resistance training. Creatine on its own, without the training,
              has much weaker support.
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

function Row({ label, values }: { label: string; values: (string | null)[] }) {
  return (
    <tr className="border-b border-border">
      <th scope="row" className="py-4 pr-4 font-medium text-fg">{label}</th>
      {values.map((v, i) => (
        <td key={i} className="py-4 pr-4">{v ?? <Pending />}</td>
      ))}
    </tr>
  );
}
