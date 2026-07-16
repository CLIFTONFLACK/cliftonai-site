export type Product = {
  name: string;
  /** Product word alone (lockup suffix) — only for CliftonAi sub-brands. */
  shortName?: string;
  /** Functional accent used as the card keyline — sub-brands only. */
  accent?: string;
  tagline: string;
  hook: string;
  bullets: string[];
  description: string;
  href: string;
  /** Only set when a distinct demo/sandbox URL exists. */
  demoHref?: string;
  subdomain: string;
  status: "live" | "in-development";
  screenshot: string;
  category: "self" | "client";
};

export const products: Product[] = [
  {
    name: "CliftonAi ContentFlow",
    shortName: "ContentFlow",
    accent: "#1565c0",
    tagline: "Content operations for WordPress",
    hook: "The WordPress theme, content generator, and feedback tool that finally talk to each other.",
    bullets: [
      "Plain-language theme editing, no code",
      "AI content generation + RSS automation",
      "Built-in AI visibility (llms.txt, schema.org)",
    ],
    description:
      "Most WordPress sites run four disconnected tools that never share context. ContentFlow pairs a plain-language-editable theme with an AI content generator, RSS automation, and a feedback tool that flags and fixes issues, all in one plugin. You get one settings hub, not four logins that don't talk to each other.",
    href: "https://flow.cliftonai.co",
    subdomain: "flow.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/contentflowsuite.jpg",
    category: "self",
  },
  {
    name: "CliftonAi CRM",
    shortName: "CRM",
    accent: "#00695c",
    tagline: "Leisure & licensed property",
    hook: "The CRM that finally understands what makes a leisure property deal real.",
    bullets: [
      "MatchMaker scores every requirement against every listing",
      "Licensing-grade fields: use class, covers, extraction",
      "Ranked shortlist, not a spreadsheet of near-misses",
    ],
    description:
      "Stop losing deals to a rival agent's inbox. MatchMaker scores every requirement against every listing on the detail that actually decides leisure deals: use class, premises licence, covers, extraction. You get a ranked shortlist worth your morning, not forty near-misses to scroll through.",
    href: "https://crm.cliftonai.co",
    subdomain: "crm.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/crm.jpg",
    category: "self",
  },
  {
    name: "CliftonAi DiffDoc",
    shortName: "DiffDoc",
    accent: "#6a1b9a",
    tagline: "Document comparison",
    hook: "See exactly what changed between two documents, in seconds.",
    bullets: [
      "Works with .docx and .pdf",
      "Similarity score + word-level markup",
      "Comment, edit, and export an audit-ready copy",
    ],
    description:
      "One clause changed. Did anyone catch it? DiffDoc reads two versions of a document, marks up exactly what changed, then lets you comment, edit, and export an audit-ready copy. You get certainty on what moved, not a manual read-through.",
    href: "https://diffdoc.cliftonai.co",
    subdomain: "diffdoc.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/diffdoc.jpg",
    category: "self",
  },
  {
    name: "CliftonAi DealMaker",
    shortName: "DealMaker",
    accent: "#b3541e",
    tagline: "Deal pipeline for small business",
    hook: "One automated pipeline that runs your deals from first touch to close.",
    bullets: [
      "Sources leads and drafts outreach in your voice",
      "Captures replies and books meetings automatically",
      "Fully customizable stages for any industry",
    ],
    description:
      "Your leads are scattered across five inboxes and a spreadsheet nobody trusts. DealMaker sources leads, drafts outreach, captures replies, books meetings, and tracks every deal to close, automatically, in a pipeline you fully customize. You get one automated flow, not five disconnected tools stitched together.",
    href: "https://dealmaker.cliftonai.co",
    subdomain: "dealmaker.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/dealmaker.jpg",
    category: "self",
  },
  {
    name: "Merlows News",
    tagline: "Independent journalism + AI research",
    hook: "Independent journalism on Middle East diplomacy, sharpened by AI research.",
    bullets: [
      "Deep coverage: Abraham Accords, Cyrus Accord, regional voices",
      "AI research assistant for instant context",
      "No political affiliation, no commercial pressure",
    ],
    description:
      "Most Middle East coverage picks a side before it picks a story. Merlows News is independent journalism on the region's diplomacy, backed by an AI research assistant that gives instant context on any development. You get the full picture, not the headline.",
    href: "https://merlows.com",
    subdomain: "merlows.com",
    status: "live",
    screenshot: "/screenshots/merlows.jpg",
    category: "client",
  },
  {
    name: "Empirely Game",
    tagline: "Build. Survive. Dominate.",
    hook: "Build, survive, and dominate a business portfolio under real-world pressure.",
    bullets: [
      "3 Action Points a day, every decision counts",
      "Real-world economic, political, and social events",
      "Daily mobile game, competitive leaderboards",
    ],
    description:
      "You get 3 Action Points a day. Every business you ignore starts dying. Empirely Game is a daily mobile business game where real-world economic, political, and social events hit your portfolio. You get one shot a day to build, survive, and dominate, not an idle game that plays itself.",
    href: "https://empirely.cliftonai.co",
    subdomain: "empirely.cliftonai.co",
    status: "in-development",
    screenshot: "/screenshots/empirely.jpg",
    category: "client",
  },
  {
    name: "GetForged",
    tagline: "AI app marketplace",
    hook: "Buy the AI tool you were about to pay a developer to build.",
    bullets: [
      "Pre-built apps, automations, and internal tools",
      "Installed in hours, from £49",
      "Licensed or bought outright",
    ],
    description:
      "Someone already built the tool you were about to pay a developer thousands for. GetForged lists pre-built apps, automations, and internal tools from AI builders, installed in hours, from £49. You get software you own, not a quote you're still waiting on.",
    href: "https://getforged.cliftonai.co",
    subdomain: "getforged.cliftonai.co",
    status: "live",
    screenshot: "/screenshots/getforged.jpg",
    category: "client",
  },
  {
    name: "The Rising Lions",
    tagline: "Iran trade platform",
    hook: "A vetted route into Iran's reopening trade market.",
    bullets: [
      "Verified Iranian manufacturers and suppliers",
      "Deal-sourcing and trade intelligence",
      "Built for global B2B buyers",
    ],
    description:
      "Iran's supply chains are opening. Most buyers don't know where to start. The Rising Lions connects verified Iranian manufacturers and suppliers with global buyers, backed by deal-sourcing and trade intelligence. You get a vetted route into a market everyone's watching.",
    href: "https://www.therisinglions.com",
    subdomain: "therisinglions.com",
    status: "live",
    screenshot: "/screenshots/risinglions.jpg",
    category: "client",
  },
];

export const productCategories = [
  {
    key: "self" as const,
    title: "Our products",
    intro:
      "Built for our own operation first. Battle-tested daily, available to you.",
  },
  {
    key: "client" as const,
    title: "Built for clients",
    intro: "Their brand, their market — our engineering.",
  },
];
