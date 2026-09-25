import { Icon, type IconName } from "./icons";
import { LogoAnimation } from "./logo-animation";

/**
 * "How Brian picks" as one continuous loop rather than a list that ends:
 * AI gathers the research, the checks run, a person signs off, and the
 * six-month re-check sends it round again. The animated mark sits in the
 * middle of the ring.
 *
 * Desktop draws the ring as an ellipse in a fixed-aspect box, so the steps can
 * be placed with plain percentages on the same geometry the SVG uses. Below
 * `lg` it becomes a numbered list with a loop-back line at the end.
 */
type Step = { title: string; icon: IconName; human?: boolean };

const STEPS: Step[] = [
  { title: "Brian Finds Clinical Data", icon: "flask" },
  { title: "Information Gets Evaluated", icon: "book" },
  { title: "Products Get Matched", icon: "clipboardCheck" },
  { title: "Brian Creates Shortlist", icon: "listChecks" },
  { title: "Human Final Approval", icon: "shieldCheck", human: true },
];

const RECHECK = "Re-checked at least every six months";

// Ring geometry, in the SVG's own units. The box is W x H; the ring is an
// ellipse centred in it. Steps sit on the ring, the first at the top, then
// clockwise at equal angles.
const W = 1000;
const H = 640;
const RX = 385;
const RY = 245;
const CX = W / 2;
const CY = H / 2;
const angle = (k: number) => ((-90 + (360 / STEPS.length) * k) * Math.PI) / 180;
const point = (a: number) => ({ x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) });
const pct = ({ x, y }: { x: number; y: number }) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

// Clockwise on screen (y grows downward), starting at the top of the ring.
const RING = `M ${CX} ${CY - RY} A ${RX} ${RY} 0 1 1 ${CX - 0.01} ${CY - RY} Z`;

/** A chevron on the ring halfway between step k and the next, pointing the way the loop runs. */
function chevron(k: number) {
  const a = (angle(k) + angle(k + 1)) / 2;
  const { x, y } = point(a);
  const deg = (Math.atan2(RY * Math.cos(a), -RX * Math.sin(a)) * 180) / Math.PI;
  return { x, y, deg };
}

export function PickLoop() {
  return (
    <>
      {/* Desktop: the ring. */}
      <div className="relative mx-auto hidden w-full max-w-5xl lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d={RING} fill="none" stroke="var(--kinetic-teal)" strokeOpacity={0.35} strokeWidth={3} />
          {STEPS.map((_, k) => {
            const c = chevron(k);
            return (
              <path
                key={k}
                d="M -7 -9 L 5 0 L -7 9"
                transform={`translate(${c.x} ${c.y}) rotate(${c.deg})`}
                fill="none"
                stroke="var(--kinetic-teal)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
          {/* Two pulses a half-loop apart travel the ring for good. Hidden under reduced motion. */}
          {[0, 0.5].map((phase) => (
            <circle
              key={phase}
              r={7}
              fill="var(--kinetic-teal)"
              stroke="#fff"
              strokeWidth={3}
              className="healthy-loop-dot"
              style={{ offsetPath: `path('${RING}')`, animationDelay: `calc(var(--healthy-loop-lap) * -${phase})` }}
            />
          ))}
        </svg>

        {/* The mark in the middle. */}
        <div className="absolute top-1/2 left-1/2 w-[26%] -translate-x-1/2 -translate-y-1/2">
          <LogoAnimation showSteps={false} />
        </div>

        <ol>
          {STEPS.map((s, k) => (
            <li
              key={s.title}
              className="absolute w-[21%] -translate-x-1/2 -translate-y-1/2"
              style={pct(point(angle(k)))}
            >
              <StepCard step={s} n={k + 1} />
            </li>
          ))}
        </ol>
      </div>

      {/* Phones and tablets: the same loop as a list, closing back on step 1. */}
      <div className="lg:hidden">
        <LogoAnimation showSteps={false} className="mx-auto w-40" />
        <ol className="relative mt-8 space-y-4 border-l-2 border-kinetic-teal/40 pl-6">
          {STEPS.map((s, k) => (
            <li key={s.title} className="relative">
              <span
                className="absolute top-5 -left-[33px] h-4 w-4 rounded-full border-2 border-white bg-kinetic-teal"
                aria-hidden="true"
              />
              <StepCard step={s} n={k + 1} />
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 pl-6 text-sm font-bold text-kinetic-primary">
          <Icon name="refresh" size={16} className="text-kinetic-teal" />
          {RECHECK}, back to step 1.
        </p>
      </div>
    </>
  );
}

function StepCard({ step, n }: { step: Step; n: number }) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${step.human ? "border-2 border-kinetic-teal/50" : "border-slate-200"}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-kinetic-primary text-white">
          <Icon name={step.icon} size={16} />
        </span>
        <span className="text-[11px] font-extrabold tracking-wider text-kinetic-primary-electric uppercase">
          Step {n}
        </span>
      </div>
      <h3 className="font-kinetic-heading mt-2 text-base leading-snug font-bold text-slate-950">{step.title}</h3>
    </div>
  );
}
