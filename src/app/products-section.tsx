import Image from "next/image";
import { Clauses } from "./clauses";
import { Reveal } from "./reveal";
import { ClientsCarousel } from "./clients-carousel";
import { products, productCategories, type Product } from "./products-data";

const H2 =
  "font-heading text-4xl leading-none font-extrabold tracking-[-0.03em] text-brand-navy sm:text-5xl lg:text-6xl";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-navy-bright";

/**
 * One of Brian's own tools as a bento tile: the product's tint as the ground,
 * its screenshot rising out of the bottom edge.
 *
 * The whole tile is the link. There is nothing else interactive inside it, so
 * there is no nested-interactive markup and one tab stop per product.
 *
 * `lead` is the wide tile that opens the grid and `tall` is the narrow one
 * beside it. Both are lg-only distinctions; below that every tile is the same
 * stacked card. The tall tile shares a row with the lead, whose 16/9 shot makes
 * the row far taller than a narrow tile's own shot, so at lg its picture drops
 * the aspect ratio and fills whatever height is left, bleeding off the right.
 */
function WorkTile({
  product,
  shape,
}: {
  product: Product;
  shape: "lead" | "tall" | "standard";
}) {
  const lead = shape === "lead";
  const tall = shape === "tall";
  return (
    <a
      href={product.href}
      style={{ backgroundColor: product.tint }}
      className={`group flex h-full flex-col gap-6 overflow-hidden rounded-[28px] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(10,29,59,0.14)] cursor-pointer ${FOCUS}`}
    >
      <div
        className={`flex flex-col gap-2 px-7 pt-8 sm:px-9 ${
          lead ? "lg:flex-row lg:items-end lg:justify-between lg:gap-10" : ""
        }`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold" style={{ color: product.ink }}>
            {product.tagline}
          </p>
          <h3
            className={`font-heading text-4xl font-bold tracking-tight text-brand-navy ${
              lead || tall ? "lg:text-[2.75rem]" : ""
            }`}
          >
            {product.shortName ?? product.name}
          </h3>
        </div>
        <p
          className={`text-base leading-normal text-fg-muted ${
            lead ? "lg:max-w-sm lg:pb-1" : ""
          }`}
        >
          {product.hook}
        </p>
      </div>
      <div
        className={`relative mt-auto aspect-[16/9] overflow-hidden shadow-[0_20px_50px_rgba(10,29,59,0.18)] ${
          tall
            ? "mx-7 rounded-t-2xl sm:mx-9 lg:mr-0 lg:aspect-auto lg:min-h-48 lg:flex-1 lg:rounded-tr-none"
            : "mx-7 rounded-t-2xl sm:mx-9"
        }`}
      >
        <Image
          src={product.screenshot}
          alt={`${product.name} product screenshot`}
          fill
          sizes={
            lead
              ? "(max-width: 1024px) 100vw, 720px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          }
          className="object-cover object-left-top"
        />
      </div>
    </a>
  );
}

/** Brian's own tools — the proof, shown before anything is claimed. */
export function WorkSection() {
  const category = productCategories.find((c) => c.key === "self")!;
  const own = products.filter((p) => p.category === "self");

  return (
    <section id="products" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <h2 className={`${H2} lg:max-w-2xl`}>
            <Clauses of={category.title} />
          </h2>
          <p className="text-balance text-lg leading-relaxed text-fg-muted lg:max-w-sm">
            {category.intro}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {own.map((product, i) => (
            <Reveal
              key={product.name}
              delay={Math.min(i, 3) * 80}
              className={
                i === 0 ? "sm:col-span-2 lg:col-span-8" : "lg:col-span-4"
              }
            >
              <WorkTile
                product={product}
                shape={i === 0 ? "lead" : i === 1 ? "tall" : "standard"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
      In development
    </span>
  );
}

/** Client work: their site up front, their name and line beneath. */
function ClientCard({ product }: { product: Product }) {
  return (
    <a
      href={product.href}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-bg transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(10,29,59,0.12)] cursor-pointer ${FOCUS}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.screenshot}
          alt={`${product.name} product screenshot`}
          fill
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 270px"
          className="object-cover object-top"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-6">
        <h3 className="font-heading text-2xl font-bold text-brand-navy">
          {product.name}
        </h3>
        <p className="text-base text-fg-muted">{product.tagline}</p>
        {product.status === "in-development" && (
          <p className="mt-1.5">
            <StatusBadge />
          </p>
        )}
      </div>
    </a>
  );
}

/** Client work — their brand, their market, on a panel band. */
export function ClientsSection() {
  const category = productCategories.find((c) => c.key === "client")!;
  const clients = products.filter((p) => p.category === "client");

  return (
    <section className="bg-bg-panel px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <h2 className={H2}>
            <Clauses of={category.title} />
          </h2>
          <p className="text-balance text-lg leading-relaxed text-fg-muted">
            {category.intro}
          </p>
        </Reveal>
        {/* One Reveal for the whole list, not one per card: on a phone the
            cards past the first sit off to the right of the row, and a card
            that only fades in once swiped to reads as slow to load. */}
        <Reveal delay={100} className="mt-12">
          <ClientsCarousel label="Client work">
            {clients.map((product) => (
              <ClientCard key={product.name} product={product} />
            ))}
          </ClientsCarousel>
        </Reveal>
      </div>
    </section>
  );
}
