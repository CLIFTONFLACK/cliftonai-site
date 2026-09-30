"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "./reveal";
import { BUILD_FEE, sixYearSums } from "./pricing-math";

/**
 * How Brian charges: a £2,500 build fee (more for bigger projects), then half
 * of whatever the client was already paying for the software being replaced.
 * Ownership transfers after three years via an agreed handover — and Brian's
 * ongoing fee stops there too. The sums live in pricing-math.ts.
 */
const pricingCards = [
  {
    title: "The build",
    price: "£2,500",
    note: "one-off, negotiable on scale",
    description:
      "Brian designs, builds, and ships the system that replaces your CRM, project board, marketing stack, or supply-chain tool. £2,500 is the starting point for a typical build; bigger or more complex projects are quoted up front.",
  },
  {
    title: "Ongoing",
    price: "50%",
    note: "of what you paid before",
    description:
      "Take whatever your old subscriptions cost. Brian charges half of that, billed monthly, for the three years until the system is handed over.",
  },
  {
    title: "Ownership",
    price: "After 3 years",
    note: "agreed handover",
    description:
      "Stay three years and the system becomes yours outright, transferred through an agreed handover of code, data, and the documentation to run it without Brian. His fee stops the same day.",
    // The one cell on navy: ownership is the part of the offer nobody else makes.
    featured: true,
  },
  {
    title: "Profit share",
    price: "By arrangement",
    note: "for launches and growth",
    description:
      "Helping launch or grow a product or service instead of replacing software? Brian can work for a share of the upside, instead of or alongside a fee.",
  },
];

const gbp = (n: number) => {
  const sign = n < 0 ? "−" : "";
  return `${sign}£${Math.round(Math.abs(n)).toLocaleString("en-GB")}`;
};

/**
 * Tweens a displayed number toward `target` instead of snapping to it, so
 * dragging a slider reads as live arithmetic rather than a table re-rendering.
 *
 * Tracks the in-flight value in a ref rather than just remembering the last
 * target: a range input fires on every pixel of drag, so a second change
 * almost always arrives mid-animation. Restarting from the ref's current
 * position means the number keeps moving smoothly instead of snapping back to
 * wherever the previous animation started.
 */
function useAnimatedNumber(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      currentRef.current = target;
      // Still set state from inside a callback rather than the effect body
      // directly (one frame, imperceptible) — jumps to target instead of
      // tweening, without a synchronous setState-in-effect.
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    const from = currentRef.current;
    const to = target;
    if (Math.abs(from - to) < 0.01) return;

    const start = performance.now();
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

const SPEND_MIN = 200;
const SPEND_MAX = 3000;

export function PricingSection() {
  const [monthlySpend, setMonthlySpend] = useState(900);
  const sums = sixYearSums(monthlySpend);

  const rentedDisplay = useAnimatedNumber(sums.rented);
  const ongoingDisplay = useAnimatedNumber(sums.ongoingTotal);
  const savedDisplay = useAnimatedNumber(sums.saved);

  const fill = ((monthlySpend - SPEND_MIN) / (SPEND_MAX - SPEND_MIN)) * 100;

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <h2 className="font-heading text-4xl leading-none font-extrabold tracking-[-0.03em] text-brand-navy sm:text-5xl lg:text-6xl">
            How Brian charges
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            £2,500 to build it, more for bigger projects. Then half of what
            you were already paying, for three years. After that, it&apos;s
            yours outright and the fee stops.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pricingCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div
                className={`flex h-full flex-col rounded-[28px] p-7 ${
                  card.featured ? "bg-brand-navy text-white" : "bg-bg-panel"
                }`}
              >
                <h3
                  className={`text-sm font-bold ${
                    card.featured ? "text-brand-gold-light" : "text-fg-muted"
                  }`}
                >
                  <span aria-hidden="true">0{i + 1} · </span>
                  {card.title}
                </h3>
                <p
                  className={`mt-3 font-heading text-3xl leading-[1.05] font-extrabold tracking-[-0.03em] ${
                    card.featured ? "" : "text-brand-navy"
                  }`}
                >
                  {card.price}
                </p>
                <p
                  className={`mt-2 text-base ${
                    card.featured ? "text-white/85" : "text-fg-muted"
                  }`}
                >
                  {card.note}
                </p>
                <p
                  className={`mt-5 text-sm leading-relaxed ${
                    card.featured ? "text-white/85" : "text-fg-muted"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-4 rounded-[28px] bg-bg-tint p-7 sm:p-10">
              <p className="text-sm font-bold text-brand-navy-mid">
                Do the maths yourself
              </p>
              <label
                htmlFor="monthly-spend"
                className="font-heading text-2xl font-bold tracking-tight text-brand-navy"
              >
                Current software spend, a month
              </label>
              <input
                id="monthly-spend"
                type="range"
                min={SPEND_MIN}
                max={SPEND_MAX}
                step={50}
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="brand-slider w-full"
                // A custom property, not a `background` shorthand — the shorthand is
                // an inline declaration that would reset the stylesheet's
                // background-size and repaint the track at full 44px height.
                style={{ "--fill": `${fill}%` } as CSSProperties}
                aria-valuetext={`${gbp(monthlySpend)} a month`}
              />
              <div className="flex items-baseline justify-between text-sm text-fg-muted tabular-nums">
                <span>{gbp(SPEND_MIN)}</span>
                <output
                  htmlFor="monthly-spend"
                  className="font-heading text-xl font-bold text-brand-navy"
                >
                  {gbp(monthlySpend)}
                </output>
                <span>{gbp(SPEND_MAX)}</span>
              </div>
              <p className="text-base leading-relaxed text-fg-muted">
                One number only you know. The sums update as you move it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex h-full flex-col justify-center rounded-[28px] bg-bg-panel p-7 sm:p-10">
              <dl className="space-y-3.5 text-base text-fg-muted">
                <div className="flex items-baseline justify-between gap-4">
                  <dt>Rented for six years</dt>
                  <dd className="tabular-nums">{gbp(rentedDisplay)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt>Brian&apos;s build fee</dt>
                  <dd className="tabular-nums">{gbp(BUILD_FEE)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt>Brian&apos;s fee, years 1 to 3</dt>
                  <dd className="tabular-nums">{gbp(ongoingDisplay)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt>Brian&apos;s fee, years 4 to 6</dt>
                  <dd className="tabular-nums">{gbp(0)}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border-strong pt-5 font-bold text-brand-navy">
                  <dt>Saved over 6 years</dt>
                  <dd className="font-heading text-5xl font-extrabold tracking-[-0.03em] tabular-nums sm:text-[3.5rem]">
                    {gbp(savedDisplay)}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
