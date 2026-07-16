const sources = [
  { label: "INBOX", x: 60, y: 55 },
  { label: "SPREADSHEET", x: 60, y: 175 },
  { label: "CMS", x: 840, y: 55 },
  { label: "CALENDAR", x: 840, y: 175 },
];

const paths = [
  { d: "M 110 55 Q 280 55 412 103", delay: 0 },
  { d: "M 110 175 Q 280 175 412 127", delay: 0.15 },
  { d: "M 790 55 Q 620 55 488 103", delay: 0.3 },
  { d: "M 790 175 Q 620 175 488 127", delay: 0.45 },
];

/**
 * Decorative hero set-piece: disconnected commercial tools wiring into the
 * CliftonAi hub. Pure CSS/SVG — draw-in on load, then ambient pulses travel
 * the connections. Degrades to the final connected state under
 * prefers-reduced-motion.
 */
export function HeroDiagram() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 900 230"
      fill="none"
      className="mx-auto mt-16 w-full max-w-3xl"
    >
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

      {/* Traveling pulses */}
      {paths.map((p, i) => (
        <circle
          key={p.d}
          r="3.5"
          fill="#43a047"
          className="diagram-pulse"
          style={{
            offsetPath: `path('${p.d}')`,
            animationDelay: `${1.6 + i * 0.9}s`,
          }}
        />
      ))}

      {/* Source tool nodes */}
      {sources.map((s) => (
        <g key={s.label}>
          <rect
            x={s.x - 50}
            y={s.y - 17}
            width="100"
            height="34"
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
              font: "600 10px ui-monospace, monospace",
              letterSpacing: "0.08em",
            }}
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* Hub: compact CliftonAi mark */}
      <circle
        cx="450"
        cy="115"
        r="34"
        stroke="rgba(67, 160, 71, 0.4)"
        strokeWidth="1"
        className="diagram-hub-pulse"
      />
      <g transform="translate(450 115) scale(0.62) translate(-50 -50)">
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
    </svg>
  );
}
