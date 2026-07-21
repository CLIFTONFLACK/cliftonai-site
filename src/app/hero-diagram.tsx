type Node = {
  key: string;
  label: string;
  color: string;
  cx: number;
  cy: number;
  path: string;
  drawDelay: number;
  pulseDelay: number;
};

const hub = { cx: 220, cy: 220, r: 46 };

// Four capability streams CliftonAi develops, converging on the hub in a
// pinwheel arrangement. Colors echo the real product accents (ContentFlow,
// CRM, DiffDoc, DealMaker) from products-data.ts without hard-coupling to
// product names, so the visual stays evergreen as the lineup grows.
const nodes: Node[] = [
  {
    key: "content",
    label: "CONTENT",
    color: "#1565c0",
    cx: 220,
    cy: 72,
    path: "M 220 89 Q 260 130 220 174",
    drawDelay: 0,
    pulseDelay: 1.6,
  },
  {
    key: "crm",
    label: "CRM",
    color: "#00695c",
    cx: 368,
    cy: 220,
    path: "M 314 220 Q 288 180 266 220",
    drawDelay: 0.15,
    pulseDelay: 2.5,
  },
  {
    key: "docs",
    label: "DOCS",
    color: "#6a1b9a",
    cx: 220,
    cy: 368,
    path: "M 220 351 Q 182 310 220 266",
    drawDelay: 0.3,
    pulseDelay: 3.4,
  },
  {
    key: "deals",
    label: "DEALS",
    color: "#b3541e",
    cx: 72,
    cy: 220,
    path: "M 126 220 Q 150 260 174 220",
    drawDelay: 0.45,
    pulseDelay: 4.3,
  },
];

const NODE_WIDTH = 114;
const NODE_HEIGHT = 34;

function HubMark() {
  const scale = hub.r / 55;
  return (
    <>
      <circle
        cx={hub.cx}
        cy={hub.cy}
        r={hub.r}
        stroke="rgba(67, 160, 71, 0.4)"
        strokeWidth="1.25"
        className="diagram-hub-pulse"
      />
      <circle
        cx={hub.cx}
        cy={hub.cy}
        r={hub.r}
        fill="rgba(251, 253, 252, 0.92)"
        stroke="rgba(14, 40, 26, 0.12)"
      />
      <g
        transform={`translate(${hub.cx} ${hub.cy}) scale(${scale}) translate(-50 -50)`}
      >
        <path
          d="M 82.5 27 A 40 40 0 1 0 82.5 73"
          stroke="#0b3d1e"
          strokeWidth="12"
        />
        <g stroke="#0b3d1e" strokeWidth="5">
          <line x1="50" y1="50" x2="50" y2="24" />
          <line x1="50" y1="50" x2="72.5" y2="63" />
          <line x1="50" y1="50" x2="27.5" y2="63" />
        </g>
        <g fill="#0b3d1e">
          <circle cx="50" cy="50" r="13" />
          <circle cx="50" cy="24" r="7" />
          <circle cx="72.5" cy="63" r="7" />
          <circle cx="27.5" cy="63" r="7" />
        </g>
      </g>
    </>
  );
}

/**
 * Hero set-piece: the four capabilities CliftonAi develops (content, CRM,
 * docs, deals) wiring into the CliftonAi hub, each in its product's accent
 * color, converging to a single brand-green core. Radially symmetric, so
 * one SVG works at every breakpoint (right column on lg+, stacked below the
 * hero copy on mobile). Pure CSS/SVG — draws in on load, then colored
 * pulses travel the connections. Degrades to the final connected state
 * under prefers-reduced-motion.
 */
export function HeroDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:mx-0 lg:max-w-lg">
      <div
        aria-hidden="true"
        className="blob blob-emerald animate-float absolute -top-12 -left-10 h-56 w-56"
      />
      <div
        aria-hidden="true"
        className="blob blob-forest animate-float-slow absolute -right-10 -bottom-14 h-64 w-64"
      />
      <div className="hero-visual-panel glass relative h-full w-full overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <svg aria-hidden="true" viewBox="0 0 440 440" fill="none" className="h-full w-full">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(67, 160, 71, 0.22)" />
              <stop offset="100%" stopColor="rgba(67, 160, 71, 0)" />
            </radialGradient>
          </defs>

          <circle cx={hub.cx} cy={hub.cy} r="150" fill="url(#hubGlow)" />

          {nodes.map((n) => (
            <path
              key={n.key}
              d={n.path}
              stroke="rgba(47, 122, 59, 0.28)"
              strokeWidth="1.5"
              className="diagram-path"
              style={{ animationDelay: `${n.drawDelay + 0.3}s` }}
            />
          ))}

          {nodes.map((n) => (
            <g key={n.key}>
              <circle
                r="7.5"
                fill={n.color}
                className="diagram-pulse-halo"
                style={{
                  offsetPath: `path('${n.path}')`,
                  animationDelay: `${n.pulseDelay}s`,
                }}
              />
              <circle
                r="4"
                fill={n.color}
                className="diagram-pulse"
                style={{
                  offsetPath: `path('${n.path}')`,
                  animationDelay: `${n.pulseDelay}s`,
                  filter: `drop-shadow(0 0 4px ${n.color}CC)`,
                }}
              />
            </g>
          ))}

          {nodes.map((n) => (
            <g key={n.key}>
              <rect
                x={n.cx - NODE_WIDTH / 2}
                y={n.cy - NODE_HEIGHT / 2}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="10"
                fill="rgba(255, 255, 255, 0.82)"
                stroke={`${n.color}4d`}
              />
              <circle cx={n.cx - NODE_WIDTH / 2 + 16} cy={n.cy} r="3.5" fill={n.color} />
              <text
                x={n.cx + 6}
                y={n.cy + 4}
                textAnchor="middle"
                fill="#324035"
                style={{
                  font: "700 15px ui-monospace, monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {n.label}
              </text>
            </g>
          ))}

          <HubMark />
        </svg>
      </div>
    </div>
  );
}
