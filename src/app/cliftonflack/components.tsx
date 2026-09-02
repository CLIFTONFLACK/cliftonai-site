import Image from "next/image";
import { Reveal } from "../reveal";
import { Lightbox } from "./lightbox";

/**
 * Shared across all four /cliftonflack pages. Kept out of the main site's
 * products-section.tsx etc. deliberately — this is Clifton's personal
 * portfolio, styled in claymorphism (clay.css), not the GetBrian glass/navy
 * look the product marketing pages use.
 */

export function CaseShot({
  src,
  alt,
  url,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  url: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="cf-clay overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-[var(--cf-line)] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cf-ink-subtle)]/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cf-ink-subtle)]/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--cf-ink-subtle)]/30" />
        </span>
        <span className="cf-clay-inset min-w-0 flex-1 truncate px-3 py-1 text-center font-mono text-[11px] text-[var(--cf-ink-subtle)]">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-b-[28px]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export function PrincipleGrid({
  items,
}: {
  items: { mark: string; title: string; body: string }[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((p, i) => (
        <Reveal key={p.title} delay={i * 70}>
          <div className="cf-clay cf-clay-hover h-full p-6">
            <span className="font-mono text-[11px] font-semibold tracking-widest text-[var(--cf-gold-deep)] uppercase">
              {p.mark}
            </span>
            <h4 className="mt-2 font-heading text-lg font-semibold text-[var(--cf-ink)]">
              {p.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">
              {p.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function StackRow({
  layers,
}: {
  layers: { name: string; chips: string[] }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {layers.map((layer) => (
        <div key={layer.name} className="cf-clay p-5">
          <p className="font-mono text-[11px] font-medium tracking-widest text-[var(--cf-ink-subtle)] uppercase">
            {layer.name}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {layer.chips.map((chip) => (
              <span
                key={chip}
                className="cf-clay-inset px-2.5 py-1 font-mono text-xs text-[var(--cf-ink-muted)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseHead({
  index,
  tag,
  title,
  intro,
  roleLabel,
  roleBody,
}: {
  index: string;
  tag: string;
  title: string;
  intro: string;
  roleLabel: string;
  roleBody: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div>
        <span className="cf-clay-inset inline-flex items-center px-3 py-1 font-mono text-[11px] font-medium tracking-widest text-[var(--cf-gold-deep)] uppercase">
          {index} · {tag}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[var(--cf-ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--cf-ink-muted)]">
          {intro}
        </p>
      </div>
      <div className="cf-clay p-5" style={{ borderLeft: "4px solid var(--cf-gold)" }}>
        <p className="text-xs font-semibold tracking-wide text-[var(--cf-ink-subtle)] uppercase">
          {roleLabel}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">{roleBody}</p>
      </div>
    </div>
  );
}

/** One node in a vertical "tech-marketing stack" diagram (used on the Vance page). */
export function StackNode({
  index,
  name,
  role,
  body,
  screenshot,
  last,
}: {
  index: number;
  name: string;
  role: string;
  body: string;
  screenshot?: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="cf-clay flex h-11 w-11 shrink-0 items-center justify-center font-mono text-sm font-semibold text-[var(--cf-gold-deep)]">
          {index}
        </div>
        {!last && <div className="cf-stack-connector my-1 min-h-10 flex-1" />}
      </div>
      <div className={`cf-clay cf-clay-hover w-full p-5 ${last ? "" : "mb-5"}`}>
        <div className={screenshot ? "flex flex-wrap gap-5 sm:flex-nowrap" : ""}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-heading text-base font-semibold text-[var(--cf-ink)]">{name}</h4>
              <span className="font-mono text-[10px] tracking-widest text-[var(--cf-ink-subtle)] uppercase">
                {role}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--cf-ink-muted)]">{body}</p>
          </div>
          {screenshot && (
            <div className="w-full shrink-0 sm:w-56">
              <Lightbox src={screenshot} alt={`${name} screenshot`}>
                <div className="relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--cf-line)] transition-opacity duration-200 hover:opacity-90">
                  <Image
                    src={screenshot}
                    alt={`${name} screenshot`}
                    fill
                    sizes="224px"
                    className="object-cover object-top"
                  />
                </div>
              </Lightbox>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold tracking-widest text-[var(--cf-ink-subtle)] uppercase">
      {children}
    </p>
  );
}
