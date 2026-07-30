"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./reveal";

/**
 * How Brian charges: a £2,500 build fee (more for bigger projects), then half
 * of whatever the client was already paying for the software being replaced.
 * Ownership transfers after three years via an agreed handover — and Brian's
 * ongoing fee stops there too. That second part is why the calculator below
 * shows years 4-6 jumping: from year 4 the client keeps the whole amount they
 * used to pay a vendor, not just half of it.
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
  },
  {
    title: "Profit share",
    price: "By arrangement",
    note: "for launches and growth",
    description:
      "Helping launch or grow a product or service instead of replacing software? Brian can work for a share of the upside, instead of or alongside a fee.",
  },
];

const BUILD_FEE = 2500;
const WORKDAY_HOURS = 8;

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

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  format?: (n: number) => string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium text-fg-muted">{label}</label>
        <span className="font-heading text-lg font-semibold text-brand-navy-mid tabular-nums">
          {format ? format(value) : value.toLocaleString("en-GB")} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="brand-slider mt-3 w-full"
        style={{
          background: `linear-gradient(to right, var(--brand-gold) ${pct}%, var(--border-strong) ${pct}%)`,
        }}
        aria-label={label}
      />
    </div>
  );
}

export function PricingSection() {
  const [monthlySpend, setMonthlySpend] = useState(900);
  const [weeklyHours, setWeeklyHours] = useState(8);

  const ongoingMonthly = monthlySpend * 0.5;
  const year1 = ongoingMonthly * 12 - BUILD_FEE;
  const year2to3Total = ongoingMonthly * 12 * 2;
  const year4to6Total = monthlySpend * 12 * 3;
  const sixYearTotal = year1 + year2to3Total + year4to6Total;

  const workingDaysLost = Math.round((weeklyHours * 52) / WORKDAY_HOURS);

  const ongoingDisplay = useAnimatedNumber(ongoingMonthly);
  const year1Display = useAnimatedNumber(year1);
  const year2to3Display = useAnimatedNumber(year2to3Total);
  const year4to6Display = useAnimatedNumber(year4to6Total);
  const totalDisplay = useAnimatedNumber(sixYearTotal);
  const daysDisplay = useAnimatedNumber(workingDaysLost);

  return (
    <section id="pricing" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            How Brian charges
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-fg-muted">
            £2,500 to build it, more for bigger projects. Then half of what
            you were already paying, for three years. After that, it&apos;s
            yours outright and the fee stops.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="glass relative mt-6 overflow-hidden rounded-2xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
            />
            <div className="relative border-b border-border px-6 py-6 sm:px-8">
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-fg-muted uppercase">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-brand-gold"
                  aria-hidden="true"
                />
                Drag the sliders
              </span>
              <h3 className="mt-3 font-heading text-xl font-semibold text-fg sm:text-2xl">
                Do the maths yourself
              </h3>
              <p className="mt-1 text-sm text-fg-muted">
                Two numbers only you know. Everything below updates as you
                move them.
              </p>
            </div>

            <div className="relative grid gap-8 border-b border-border px-6 py-8 sm:grid-cols-2 sm:px-8">
              <SliderField
                label="Current software spend"
                value={monthlySpend}
                min={200}
                max={3000}
                step={50}
                suffix="/month"
                format={gbp}
                onChange={setMonthlySpend}
              />
              <SliderField
                label="Hours a week on repetitive tasks"
                value={weeklyHours}
                min={1}
                max={40}
                step={1}
                suffix="hrs/week"
                onChange={setWeeklyHours}
              />
            </div>

            <div className="relative grid gap-8 px-6 py-8 sm:grid-cols-2 sm:px-8">
              <div>
                <h4 className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                  What you&apos;d save
                </h4>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-fg-muted">Brian&apos;s build fee</dt>
                    <dd className="font-heading font-semibold text-fg">
                      {gbp(BUILD_FEE)} one-off
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-fg-muted">Brian&apos;s ongoing fee</dt>
                    <dd className="font-heading font-semibold text-fg tabular-nums">
                      {gbp(ongoingDisplay)}/month
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-fg-muted">Saved in year 1</dt>
                    <dd className="font-heading font-semibold text-fg tabular-nums">
                      {gbp(year1Display)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-fg-muted">Saved in years 2-3</dt>
                    <dd className="font-heading font-semibold text-fg tabular-nums">
                      {gbp(year2to3Display)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-fg-muted">
                      Saved in years 4-6, after handover
                    </dt>
                    <dd className="font-heading font-semibold text-fg tabular-nums">
                      {gbp(year4to6Display)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-xs font-medium tracking-wide text-fg-subtle uppercase">
                    Total saved over 6 years
                  </p>
                  <p className="brand-gradient-text mt-1 font-heading text-4xl font-bold tabular-nums sm:text-5xl">
                    {gbp(totalDisplay)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl bg-bg-tint p-6 sm:p-8">
                <p className="text-xs font-medium tracking-wide text-brand-navy-soft uppercase">
                  Before Brian
                </p>
                <p className="mt-2 font-heading text-4xl font-bold text-brand-navy tabular-nums sm:text-5xl">
                  {daysDisplay} days
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  working days a year lost to repetitive tasks, based on an
                  {" "}{WORKDAY_HOURS}-hour day. That&apos;s before Brian
                  automates any of it.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
