import { RailReveal } from "./rail-reveal";
import { ProductCard } from "./components";
import { Icon } from "./icons";
import { supplementFor, type Product } from "./data";

/**
 * Current picks with "One job each" built in: every card sits under its job
 * (number, tagline, supplement), and a teal circuit trace runs along the jobs
 * and drops into each card, drawn once when the row scrolls into view (the
 * `.healthy-rail-*` transitions in globals.css, run by RailReveal).
 *
 * The job is read from each card's own product via supplementFor(), not from
 * the supplements list's order, so a lineup change can never pair a card with
 * someone else's job.
 */
export function JobRail({ products }: { products: Product[] }) {
  return (
    <RailReveal className="relative">
      <p className="mb-6 flex items-center gap-1.5 font-kinetic-heading text-xs font-extrabold tracking-wider text-kinetic-primary uppercase">
        <Icon name="flask" size={18} className="text-kinetic-primary-electric" />
        One job each
      </p>
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
            const base = 250 + i * 180;
            return (
              <li key={product.slug} className="flex flex-col">
                <div
                  className="healthy-rail-node flex flex-col items-center text-center"
                  style={{ transitionDelay: `${base}ms` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-kinetic-primary font-kinetic-heading text-sm font-extrabold text-white shadow-sm ring-4 ring-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {job && (
                    <>
                      <span className="mt-3 text-base font-bold text-slate-900">{job.tagline}</span>
                      <span className="text-sm font-medium text-slate-500">{job.name}</span>
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
