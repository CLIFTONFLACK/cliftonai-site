type Node = { label: string; x: number; y: number };
type PathDef = { d: string; delay: number };
type Hub = { cx: number; cy: number; r: number };

const desktopSources: Node[] = [
  { label: "INBOX", x: 60, y: 55 },
  { label: "SPREADSHEET", x: 60, y: 175 },
  { label: "CMS", x: 840, y: 55 },
  { label: "CALENDAR", x: 840, y: 175 },
];

const desktopPaths: PathDef[] = [
  { d: "M 110 55 Q 280 55 412 103", delay: 0 },
  { d: "M 110 175 Q 280 175 412 127", delay: 0.15 },
  { d: "M 790 55 Q 620 55 488 103", delay: 0.3 },
  { d: "M 790 175 Q 620 175 488 127", delay: 0.45 },
];

const desktopHub: Hub = { cx: 450, cy: 115, r: 34 };

// Compact layout with a viewBox close to actual rendered width on phones,
// so labels stay near-native size instead of shrinking to illegible sizes.
const compactSources: Node[] = [
  { label: "INBOX", x: 86, y: 40 },
  { label: "CMS", x: 234, y: 40 },
  { label: "SHEET", x: 86, y: 110 },
  { label: "CALENDAR", x: 234, y: 110 },
];

const compactPaths: PathDef[] = [
  { d: "M 86 57 Q 86 150 135 190", delay: 0 },
  { d: "M 86 127 Q 86 165 130 205", delay: 0.15 },
  { d: "M 234 57 Q 234 150 185 190", delay: 0.3 },
  { d: "M 234 127 Q 234 165 190 205", delay: 0.45 },
];

const compactHub: Hub = { cx: 160, cy: 210, r: 34 };

function HubMark({ cx, cy, r }: Hub) {
  const scale = r / 55;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke="rgba(67, 160, 71, 0.4)"
        strokeWidth="1"
        className="diagram-hub-pulse"
      />
      <g
        transform={`translate(${cx} ${cy}) scale(${scale}) translate(-50 -50)`}
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

function Wiring({
  sources,
  paths,
  hub,
  nodeWidth = 100,
  nodeHeight = 34,
  fontSize = 10,
}: {
  sources: Node[];
  paths: PathDef[];
  hub: Hub;
  nodeWidth?: number;
  nodeHeight?: number;
  fontSize?: number;
}) {
  return (
    <>
      {/* Connections */}
      {paths.map((p) => (
        <path
          key={p.d}
          d={p.d}
          stroke="rgba(47, 122, 59, 0.3)"
          strokeWidth="1.5"
          className="diagram-path"
          style={{ animationDelay: `${p.delay + 0.3}s` }}
        />
      ))}

      {/* Traveling pulses — soft halo behind a bright core, both riding the
          same motion path so the glow reads as one traveling point. */}
      {paths.map((p, i) => (
        <g key={p.d}>
          <circle
            r="7"
            fill="rgba(67, 160, 71, 0.4)"
            className="diagram-pulse-halo"
            style={{
              offsetPath: `path('${p.d}')`,
              animationDelay: `${1.6 + i * 0.9}s`,
            }}
          />
          <circle
            r="3.5"
            fill="#5fd066"
            className="diagram-pulse"
            style={{
              offsetPath: `path('${p.d}')`,
              animationDelay: `${1.6 + i * 0.9}s`,
            }}
          />
        </g>
      ))}

      {/* Source tool nodes */}
      {sources.map((s) => (
        <g key={s.label}>
          <rect
            x={s.x - nodeWidth / 2}
            y={s.y - nodeHeight / 2}
            width={nodeWidth}
            height={nodeHeight}
            rx="9"
            fill="rgba(255, 255, 255, 0.7)"
            stroke="rgba(14, 40, 26, 0.15)"
          />
          <text
            x={s.x}
            y={s.y + 3.5}
            textAnchor="middle"
            fill="#647568"
            style={{
              font: `600 ${fontSize}px ui-monospace, monospace`,
              letterSpacing: "0.08em",
            }}
          >
            {s.label}
          </text>
        </g>
      ))}

      <HubMark {...hub} />
    </>
  );
}

/**
 * Decorative hero set-piece: disconnected commercial tools wiring into the
 * CliftonAi hub. Pure CSS/SVG — draw-in on load, then ambient pulses travel
 * the connections. Degrades to the final connected state under
 * prefers-reduced-motion. Renders a compact vertical layout below md (its
 * viewBox is sized close to actual rendered width so labels stay legible)
 * and the wide horizontal layout at md and up.
 */
export function HeroDiagram() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 320 290"
        fill="none"
        className="mx-auto mt-10 w-full max-w-xs md:hidden"
      >
        <Wiring
          sources={compactSources}
          paths={compactPaths}
          hub={compactHub}
          nodeWidth={84}
          nodeHeight={28}
          fontSize={9.5}
        />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 900 230"
        fill="none"
        className="mx-auto mt-16 hidden w-full max-w-3xl md:block"
      >
        <Wiring sources={desktopSources} paths={desktopPaths} hub={desktopHub} />
      </svg>
    </>
  );
}
