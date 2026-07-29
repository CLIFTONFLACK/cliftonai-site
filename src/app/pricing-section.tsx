import { Reveal } from "./reveal";

/**
 * How Brian charges: a fixed build fee, then half of whatever the client
 * was already paying for the software being replaced — plus an optional
 * profit-share track for launch/growth work. Numbers in the worked example
 * are illustrative and intentionally round.
 */
const pricingCards = [
  {
    title: "The build",
    price: "£1,000",
    note: "fixed, one-off",
    description:
      "Brian designs, builds, and ships the system that replaces your CRM, project board, marketing stack, or supply-chain tool. You own it outright.",
  },
  {
    title: "Ongoing",
    price: "50%",
    note: "of what you paid before",
    description:
      "Take whatever your old subscriptions cost. Brian charges half of that, billed monthly, for as long as you use the system. Never more.",
  },
  {
    title: "Profit share",
    price: "By arrangement",
    note: "for launches and growth",
    description:
      "Helping launch or grow a product or service instead of replacing software? Brian can work for a share of the upside, instead of or alongside a fee.",
  },
];

const exampleRows = [
  { label: "Current software spend", value: "£900/month" },
  { label: "Brian's build fee", value: "£1,000 once" },
  { label: "Brian's ongoing fee", value: "£450/month" },
  { label: "Saved in year one", value: "£4,400" },
  { label: "Saved every year after", value: "£5,400" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            How Brian charges
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            One fixed fee to build it. Then half of what you were already
            paying — forever. No day-rate surprises, no seat licences that
            creep up every renewal.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pricingCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div className="glass glass-hover flex h-full flex-col rounded-2xl p-6">
                <h3 className="font-heading text-lg font-semibold text-fg">
                  {card.title}
                </h3>
                <p className="mt-4 font-heading text-3xl font-semibold text-brand-navy-mid">
                  {card.price}
                </p>
                <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">
                  {card.note}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="glass mt-6 overflow-hidden rounded-2xl">
            <div className="border-b border-border px-6 py-5">
              <h3 className="font-heading text-base font-semibold text-fg">
                Worked example
              </h3>
              <p className="mt-1 text-sm text-fg-muted">
                A business spending £900/month across its current stack.
              </p>
            </div>
            <dl className="divide-y divide-border">
              {exampleRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm"
                >
                  <dt className="text-fg-muted">{row.label}</dt>
                  <dd className="font-heading font-semibold text-fg">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
