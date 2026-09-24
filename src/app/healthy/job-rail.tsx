import { RailReveal } from "./rail-reveal";
import { ProductCard } from "./components";
import { Icon } from "./icons";
import { goals, supplementFor, type Product } from "./data";

/**
 * Current picks, each card under the goal it serves: the same goals, names
 * and icons as the "What do you want more of?" tiles above, so the page reads
 * goal -> pick. A teal circuit trace runs along the goals and drops into each
 * card, drawn once when the row scrolls into view (the `.healthy-rail-*`
 * transitions in globals.css, run by RailReveal).
 *
 * The goals are read from each card's own product via supplementFor(), not
 * from any list's order, so a lineup change can never pair a card with
 * someone else's goal. A supplement with two goals (creatine: strength, and
 * focus) leads with the one that has no caveat and names the other beneath,
 * caveat attached.
 */
export function JobRail({ products }: { products: Product[] }) {
  return (
    <RailReveal className="relative">
      <div className="relative">
        {/* The rail: from the first job's centre to the last's, behind the number
            tiles (whose centres sit 1.5rem down). Three columns and gap-8 put the
            outer centres (100% - 4rem) / 6 in from each edge. */}
        <span
          className="healthy-rail-line pointer-events-none absolute top-6 hidden h-[3px] -translate-y-1/2 rounded-full bg-kinetic-teal lg:block"
          style={{ left: "calc((100% - 4rem) / 6)", right: "calc((100% - 4rem) / 6)" }}
          aria-hidden="true"
        />
        <ul className="relative grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {products.map((product, i) => {
            const job = supplementFor(product);
            const jobGoals = job ? goals.filter((g) => g.supplement === job.id) : [];
            const lead = jobGoals.find((g) => !g.caveat) ?? jobGoals[0];
            const also = jobGoals.filter((g) => g !== lead);
            const base = 250 + i * 180;
            return (
              <li key={product.slug} className="flex flex-col">
                {/* lg:min-h-32 fits a node with its "+ Focus" line, so every card
                    starts at the same height whichever goals sit above it. */}
                <div
                  className="healthy-rail-node flex flex-col items-center text-center lg:min-h-32"
                  style={{ transitionDelay: `${base}ms` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-kinetic-primary font-kinetic-heading text-sm font-extrabold text-white shadow-sm ring-4 ring-white">
                    {lead ? <Icon name={lead.icon} size={22} /> : String(i + 1).padStart(2, "0")}
                  </span>
                  {job && (
                    <>
                      <span className="mt-3 font-kinetic-heading text-lg font-bold text-slate-900">
                        {lead ? lead.label : job.tagline}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{job.name}</span>
                      {/* One list for every secondary line beneath the name, so the
                          fragment's shape never depends on whether a caveat is
                          present. The lead's own caveat (only reached when every
                          goal of a supplement carries one, so it can't be
                          selected out) comes first, unprefixed; each other goal
                          follows as "+ Label[: caveat]". */}
                      {[
                        ...(lead?.caveat
                          ? [{ key: "lead-caveat", parts: [lead.caveat] }]
                          : []),
                        ...also.map((g) => ({
                          key: g.id,
                          parts: ["+ ", g.label, g.caveat ? `: ${g.caveat}` : ""],
                        })),
                      ].map(({ key, parts }) => (
                        <span key={key} className="mt-1 text-xs font-semibold text-kinetic-primary-electric">
                          {parts}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                <span
                  className="healthy-rail-drop mx-auto mt-3 block h-8 w-[3px] rounded-full bg-kinetic-teal"
                  style={{ transitionDelay: `${base + 350}ms` }}
                  aria-hidden="true"
                />
                <span
                  className="healthy-rail-stud mx-auto -mt-1 mb-2 block h-3.5 w-3.5 rounded-full bg-kinetic-teal ring-4 ring-kinetic-primary-light"
                  style={{ transitionDelay: `${base + 750}ms` }}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <ProductCard product={product} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </RailReveal>
  );
}
