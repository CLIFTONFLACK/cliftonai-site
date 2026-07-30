type Lane = {
  key: string;
  label: string;
  color: string;
  /** Vertical centre of the label chip and its terminal ring. */
  y: number;
  /** Trace from the terminal ring into the hub, in the logo's routing grammar. */
  path: string;
  /** Endpoint, for the solid tip stud. */
  end: [number, number];
  /**
   * True when the trace stops inside the B's open counter rather than landing
   * on its stroke — those ends need a stud so they read as terminated rather
   * than clipped. The B only has left-hand ink across two bands (roughly y
   * 137-176 and y 251-304); everything between is open counter, which is
   * precisely where the logo runs its own traces.
   */
  tip: boolean;
  drawDelay: number;
  pulseDelay: number;
};

const VIEW = 440;

/** Where the Brian mark sits. Aspect matches brian-mark-solo.svg's viewBox. */
const MARK_ASPECT = 530.3 / 518;
const HUB_W = 178;
const hub = {
  x: 244,
  w: HUB_W,
  h: HUB_W / MARK_ASPECT,
  get y() {
    return (VIEW - this.h) / 2;
  },
};

/* Chips are sized for the longest label ("Operation Management"), which is why
   they run much wider than the old one-word set and push the rings and traces
   right. Labels are sentence case rather than uppercase: at this width uppercase
   would not fit without dropping the type below legible size. */
const CHIP_X = 6;
const CHIP_W = 158;
const CHIP_H = 34;
const LABEL_X = CHIP_X + 26;
/** Terminal ring centre — the hollow gold circles the logo's traces start from. */
const RING_X = 180;
const RING_R = 9;

/**
 * Four capability streams feeding the hub, laid out the way the logo lays out
 * its circuit traces: entering from the left, running orthogonally, jogging at
 * 45 degrees to change lane, converging right. Colours are the real product
 * accents from products-data.ts, kept off the brand ramp so the diagram reads
 * as four distinct inputs rather than four shades of navy.
 */
const lanes: Lane[] = [
  {
    key: "workflows",
    label: "Repetitive Workflows",
    color: "#1565c0",
    y: 110,
    path: "M 191 110 H 205 L 253 158 H 264",
    end: [264, 158],
    tip: false,
    drawDelay: 0,
    pulseDelay: 1.4,
  },
  {
    key: "operations",
    label: "Operation Management",
    color: "#00695c",
    y: 180,
    path: "M 191 180 H 235 L 251 196 H 352",
    end: [352, 196],
    tip: true,
    drawDelay: 0.12,
    pulseDelay: 2.3,
  },
  {
    key: "financial",
    label: "Financial Modelling",
    color: "#6a1b9a",
    y: 260,
    path: "M 191 260 H 235 L 251 244 H 320",
    end: [320, 244],
    tip: true,
    drawDelay: 0.24,
    pulseDelay: 3.2,
  },
  {
    key: "marketing",
    label: "Marketing Processes",
    color: "#b3541e",
    y: 330,
    path: "M 191 330 H 205 L 253 282 H 264",
    end: [264, 282],
    tip: false,
    drawDelay: 0.36,
    pulseDelay: 4.1,
  },
];

/** Free-floating solid nodes — the logo scatters a few of these between traces. */
const studs = [
  { cx: 216, cy: 146, r: 5 },
  { cx: 224, cy: 222, r: 4.5 },
  { cx: 214, cy: 300, r: 5 },
];

/**
 * Hero set-piece: the four capabilities Brian works across wired into the Brian
 * mark, drawn in the logo's own circuit-trace vocabulary — orthogonal routing
 * with 45-degree jogs, hollow gold terminal rings, solid gold studs.
 *
 * Pure CSS/SVG. Traces draw in on load, then gold pulses travel lane -> hub.
 * Radially balanced enough that one SVG works at every breakpoint (right column
 * on lg+, stacked under the hero copy on mobile). Degrades to the final
 * connected state under prefers-reduced-motion.
 */
export function HeroDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0 lg:max-w-lg">
      <div
        aria-hidden="true"
        className="blob blob-navy animate-float absolute -top-12 -left-10 h-56 w-56"
      />
      <div
        aria-hidden="true"
        className="blob blob-gold animate-float-slow absolute -right-10 -bottom-14 h-64 w-64"
      />
      <div className="hero-visual-panel glass relative h-full w-full overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          fill="none"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(186, 139, 50, 0.20)" />
              <stop offset="100%" stopColor="rgba(186, 139, 50, 0)" />
            </radialGradient>
          </defs>

          <circle
            cx={hub.x + hub.w / 2}
            cy={VIEW / 2}
            r="140"
            fill="url(#hubGlow)"
          />

          {/* Traces */}
          {lanes.map((l) => (
            <path
              key={l.key}
              d={l.path}
              pathLength={1}
              stroke="var(--brand-gold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="diagram-path"
              style={{ animationDelay: `${l.drawDelay + 0.3}s` }}
            />
          ))}

          {/* Hollow terminal rings, as the logo draws them */}
          {lanes.map((l) => (
            <circle
              key={l.key}
              cx={RING_X}
              cy={l.y}
              r={RING_R}
              fill="var(--bg)"
              stroke="var(--brand-gold)"
              strokeWidth="3"
            />
          ))}

          {studs.map((s) => (
            <circle
              key={`${s.cx}-${s.cy}`}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="var(--brand-gold)"
              opacity="0.75"
            />
          ))}

          {/* Solid tips on the traces that stop in open counter */}
          {lanes
            .filter((l) => l.tip)
            .map((l) => (
              <circle
                key={l.key}
                cx={l.end[0]}
                cy={l.end[1]}
                r="6"
                fill="var(--brand-gold)"
              />
            ))}

          {/* Travelling pulses */}
          {lanes.map((l) => (
            <g key={l.key}>
              <circle
                r="7"
                fill={l.color}
                className="diagram-pulse-halo"
                style={{
                  offsetPath: `path('${l.path}')`,
                  animationDelay: `${l.pulseDelay}s`,
                }}
              />
              <circle
                r="3.75"
                fill={l.color}
                className="diagram-pulse"
                style={{
                  offsetPath: `path('${l.path}')`,
                  animationDelay: `${l.pulseDelay}s`,
                  filter: `drop-shadow(0 0 4px ${l.color}CC)`,
                }}
              />
            </g>
          ))}

          {/* Label chips */}
          {lanes.map((l) => (
            <g key={l.key}>
              <rect
                x={CHIP_X}
                y={l.y - CHIP_H / 2}
                width={CHIP_W}
                height={CHIP_H}
                rx="9"
                fill="rgba(255, 255, 255, 0.86)"
                stroke={`${l.color}4d`}
              />
              <circle cx={CHIP_X + 15} cy={l.y} r="3.5" fill={l.color} />
              <text
                x={LABEL_X}
                y={l.y + 4}
                fill="#14172b"
                style={{
                  font: "600 10.5px ui-sans-serif, system-ui, sans-serif",
                }}
              >
                {l.label}
              </text>
            </g>
          ))}

          {/* Hub — the real traced mark. The solo cut (no built-in circuit
              traces) because the four lanes above already play that role; the
              display cut would read as a second, unconnected set of traces. */}
          <image
            href="/brand/brian-mark-solo.svg"
            x={hub.x}
            y={hub.y}
            width={hub.w}
            height={hub.h}
          />
        </svg>
      </div>
    </div>
  );
}
