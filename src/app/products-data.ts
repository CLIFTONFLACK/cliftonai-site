export type Product = {
  name: string;
  /** Product word alone (lockup suffix) — only for Brian's own tools. */
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
    name: "ContentFlow",
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
    href: "https://flow.getbrian.xyz",
    subdomain: "flow.getbrian.xyz",
    status: "live",
    screenshot: "/screenshots/contentflowsuite.jpg",
    category: "self",
  },
  {
    name: "CRM",
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
    href: "https://crm.getbrian.xyz",
    subdomain: "crm.getbrian.xyz",
    status: "live",
    screenshot: "/screenshots/crm.jpg",
    category: "self",
  },
  {
    name: "DiffDoc",
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
    href: "https://diffdoc.getbrian.xyz",
    subdomain: "diffdoc.getbrian.xyz",
    status: "live",
    screenshot: "/screenshots/diffdoc.jpg",
    category: "self",
  },
  {
    name: "DealMaker",
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
    href: "https://dealmaker.getbrian.xyz",
    subdomain: "dealmaker.getbrian.xyz",
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
    href: "https://empirely.getbrian.xyz",
    subdomain: "empirely.getbrian.xyz",
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
    href: "https://getforged.getbrian.xyz",
    subdomain: "getforged.getbrian.xyz",
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
  {
    name: "HYDRGEL",
    tagline: "Personal water purification",
    hook: "Pour dirty water into a pouch, drink clean water three minutes later.",
    bullets: [
      "Patented hydrogel-and-silver pouch purifies 330ml in 3 minutes",
      "HYDRLAB deploys a full production lab to disaster zones",
      "Built for climate disasters and conflict-zone relief",
    ],
    description:
      "2.8 billion people lack access to clean water, and disasters keep making it worse. HYDRGEL's patented hydrogel-and-silver pouches purify a can's worth of dirty water in three minutes, no plant, no bottles, no wait. HYDRLAB deploys a full production lab into disaster and conflict zones to manufacture pouches on-site. You get drinkable water at the point of need, not tankers of bottled water shipped in.",
    href: "https://www.hydrgel.com",
    subdomain: "hydrgel.com",
    status: "live",
    screenshot: "/screenshots/hydrgel.jpg",
    category: "client",
  },
  {
    name: "Vance Health Hub",
    tagline: "Gastro health knowledge hub",
    hook: "Turning gastro health research into tools patients can actually use.",
    bullets: [
      "Free self-assessment for personalised gut health support",
      "VANCE-Ai answers gastro health questions 24/7",
      "Clinical reviews and healthcare news curated for IBD and Crohn's patients",
    ],
    description:
      "IBD and Crohn's patients get a diagnosis, then a stack of clinical literature to interpret alone. Vance Health Hub turns the research into a free self-assessment, a 24/7 AI health assistant, and a curated knowledgebase of gastro health news and clinical reviews. You get expert-led guidance you can act on, not a pile of studies to decode yourself.",
    href: "https://www.vancehealthhub.co.uk",
    subdomain: "vancehealthhub.co.uk",
    status: "live",
    screenshot: "/screenshots/vancehealthhub.jpg",
    category: "client",
  },
];

/**
 * `title` is the section heading as clauses, not one string: each entry wraps as
 * a unit so a phone never splits the phrase mid-way. See `Clauses` in
 * clauses.tsx. Desktop still renders them as one line.
 */
export const productCategories = [
  {
    key: "self" as const,
    title: ["Built by Brian", "so you don't have to"],
    intro:
      "Proof, not promises. Brian has evolved alongside the world of Ai.",
  },
  {
    key: "client" as const,
    title: ["Built for clients"],
    intro: "Their brand, their market. Brian's engineering.",
  },
];
