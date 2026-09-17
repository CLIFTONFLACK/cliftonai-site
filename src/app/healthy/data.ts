/**
 * Everything the /healthy section renders comes from this file. Adding or
 * swapping a product is a data change, not a code change.
 *
 * Honesty rules the data must keep (FTC endorsement guidance, FDA DSHEA):
 * - A figure we have not checked against the label or brand site is `null`,
 *   and the page says "being verified" rather than guessing.
 * - `verified` stays false until every label and price figure has a source.
 *   Unverified products render a draft banner.
 * - Evidence statements are structure/function only ("supports..."). Never
 *   treat, prevent, cure or reverse.
 */

export const PROGRAM_NAME = "Brian's Human Longevity Program";
export const PROGRAM_SHORT = "Human Longevity Program";
export const CONTACT_EMAIL = "hello@getbrian.xyz";

/**
 * Master switch for search engines. While false, every /healthy page is
 * noindex and nothing under /healthy is listed in the sitemap, so draft
 * figures cannot be indexed. Flip to true only when all launch products are
 * `verified`.
 */
export const LAUNCHED = false;

export type EvidenceGrade = "strong" | "moderate" | "early";

export type Citation = { label: string; url: string };

export type EvidenceItem = {
  /** Structure/function wording only. */
  claim: string;
  grade: EvidenceGrade;
  summary: string;
  citations: Citation[];
};

export type Ingredient = {
  name: string;
  /** Amount per serving as printed on the label, or null until checked. */
  amount: string | null;
  /** Dose range used in the research, for side-by-side comparison. */
  studiedDose?: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: "Creatine" | "Magnesium";
  format: string;
  /** One line for cards. */
  summary: string;
  verdict: string;
  bestFor: string[];
  notFor: string[];
  servingSize: string | null;
  servingsPerContainer: number | null;
  ingredients: Ingredient[];
  priceUsd: number | null;
  priceCheckedAt: string | null;
  testing: string[];
  evidence: EvidenceItem[];
  safety: string[];
  pros: string[];
  cons: string[];
  /** Where the Buy button goes before an affiliate link is issued. */
  brandUrl: string;
  /** Set when a programme approves us. Takes precedence over brandUrl. */
  affiliateUrl: string | null;
  /**
   * Whether this programme's terms allow the affiliate link to sit behind our
   * own /healthy/go redirect. Some forbid it outright (iHerb's terms, Nov 2025:
   * "You may not use redirect links", with commission forfeited). Leave false
   * until the programme's written terms say otherwise.
   */
  redirectAllowed: boolean;
  /** Label for the Buy button: "Check price at <retailer>". */
  retailer: string;
  lastReviewed: string | null;
  verified: boolean;
};

/** The program promise. Structure/function wording, so it needs the FDA disclaimer on any page that shows it. */
export const TAGLINE = "Support your energy, strengthen your body, support your focus and find your calm.";

export type Goal = "energy" | "strength" | "focus" | "calm";

export type Supplement = {
  id: "magnesium" | "creatine" | "l-theanine";
  name: string;
  role: string;
  /** What it contributes to healthy aging. Structure/function wording only. */
  contribution: string;
  /** Where the evidence is thinner than the role suggests. Shown beside the role, never hidden. */
  caveat?: string;
  /** Products in this category review this supplement. Null until a pick exists. */
  category: Product["category"] | null;
};

export const supplements: Supplement[] = [
  {
    id: "magnesium",
    name: "Magnesium",
    role: "Muscle function and energy metabolism",
    contribution:
      "Supports normal muscle contraction, nerve signaling and cellular energy production.",
    category: "Magnesium",
  },
  {
    id: "creatine",
    name: "Creatine",
    role: "Strength, physical performance and cognitive support, including focus",
    contribution: "Supports strength and lean-mass gains alongside resistance training.",
    caveat:
      "Cognitive benefits are promising, but reliable improvements in everyday focus are not yet established.",
    category: "Creatine",
  },
  {
    id: "l-theanine",
    name: "L-theanine",
    role: "Calm and relaxation",
    contribution: "May support relaxation, managing everyday stress and winding down.",
    category: null,
  },
];

/**
 * Engagement hooks for the goal chooser. Each one leads with the reader's
 * situation and ends in an honest answer, never a promise: no invented
 * numbers, no urgency, no "clinically proven".
 */
export const goals: { id: Goal; label: string; hook: string; supplement: Supplement["id"] }[] = [
  {
    id: "energy",
    label: "Support your energy",
    hook: "Low on magnesium? Many US adults do not eat enough of it, and your body uses it to turn food into energy.",
    supplement: "magnesium",
  },
  {
    id: "strength",
    label: "Strengthen your body",
    hook: "Lifting after 40? Meet one of the most-studied supplements for getting more from the work.",
    supplement: "creatine",
  },
  {
    id: "focus",
    label: "Support your focus",
    hook: "Creatine for your brain? Promising, not proven. Here is what the research really shows.",
    supplement: "creatine",
  },
  {
    id: "calm",
    label: "Find your calm",
    hook: "Still wired at 10pm? Meet the compound from tea that people take to wind down.",
    supplement: "l-theanine",
  },
];

export function getSupplement(id: Supplement["id"]): Supplement {
  const s = supplements.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown supplement: ${id}`);
  return s;
}

/** The supplement a product reviews, if any. */
export function supplementFor(p: Product): Supplement | undefined {
  return supplements.find((s) => s.category === p.category);
}

export const gradeLabels: Record<EvidenceGrade, { label: string; meaning: string }> = {
  strong: {
    label: "Strong evidence",
    meaning: "Consistent results across several randomized trials or meta-analyses.",
  },
  moderate: {
    label: "Moderate evidence",
    meaning: "Supportive trials exist, but results vary or populations are narrow.",
  },
  early: {
    label: "Early evidence",
    meaning: "Small, short or mixed studies. Worth watching, not worth relying on.",
  },
};

export const pillars = [
  {
    title: "Research",
    description:
      "Brian reads the clinical research first: systematic reviews, meta-analyses and randomized trials. Each claim gets a plain grade, so you can see how much weight it can carry.",
  },
  {
    title: "Evaluation",
    description:
      "Then the product itself: the dose on the label against the dose that was studied, independent testing, the price per effective serving, and who should check with a doctor first.",
  },
  {
    title: "Selection",
    description:
      "Only products that pass make the list, and the list stays short on purpose. Each pick is re-checked at least every six months, and dropped if it stops earning its place.",
  },
];

export const products: Product[] = [
  {
    slug: "create-creatine-gummies",
    name: "Creatine Monohydrate Gummies",
    brand: "Create",
    category: "Creatine",
    format: "Gummies",
    summary: "Creatine in a chewable format, for people who will not stick with a powder.",
    verdict:
      "The pick for convenience. Creatine only works if you take it every day, and a gummy is the easiest daily habit to keep. You pay more per gram than for powder, so it earns its place only if convenience is what gets you to take it.",
    bestFor: [
      "Adults who have tried powders and stopped",
      "Travel and busy routines",
    ],
    notFor: [
      "Anyone keeping sugar or sweeteners to a minimum",
      "Buyers who want the lowest cost per gram",
    ],
    servingSize: null,
    servingsPerContainer: null,
    ingredients: [
      { name: "Creatine monohydrate", amount: null, studiedDose: "3 to 5 g per day" },
    ],
    priceUsd: null,
    priceCheckedAt: null,
    testing: [],
    evidence: [
      {
        claim: "Supports muscle strength when combined with resistance training",
        grade: "strong",
        summary:
          "In adults over 50, creatine taken alongside a resistance training program has repeatedly produced larger strength gains than training alone.",
        citations: [],
      },
      {
        claim: "Supports lean muscle mass with regular training",
        grade: "moderate",
        summary:
          "Gains in lean mass are seen in pooled analyses of older adults, but they are modest and depend on training.",
        citations: [],
      },
    ],
    safety: [
      "Talk to your doctor first if you have kidney disease or take medication that affects the kidneys.",
      "Early water retention of a pound or two is common and is not fat gain.",
    ],
    pros: ["Easy to take every day", "No mixing or measuring"],
    cons: ["Higher cost per gram than powder", "Contains added sugar or sweeteners"],
    brandUrl: "https://trycreate.co",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "Create",
    lastReviewed: null,
    verified: false,
  },
  {
    slug: "california-gold-creatine",
    name: "Creatine Monohydrate Powder",
    brand: "California Gold Nutrition",
    category: "Creatine",
    format: "Unflavored powder",
    summary: "Plain creatine monohydrate at a low cost per gram. The value pick.",
    verdict:
      "The pick for value. Plain creatine monohydrate is the form used in almost all of the research, and powder is the cheapest way to take it. Stir it into water, coffee or a shake.",
    bestFor: ["Anyone who wants the studied form at the lowest cost", "People already making a daily shake"],
    notFor: ["People who dislike mixing powders"],
    servingSize: null,
    servingsPerContainer: null,
    ingredients: [
      { name: "Creatine monohydrate", amount: null, studiedDose: "3 to 5 g per day" },
    ],
    priceUsd: null,
    priceCheckedAt: null,
    testing: [],
    evidence: [
      {
        claim: "Supports muscle strength when combined with resistance training",
        grade: "strong",
        summary:
          "In adults over 50, creatine taken alongside a resistance training program has repeatedly produced larger strength gains than training alone.",
        citations: [],
      },
    ],
    safety: [
      "Talk to your doctor first if you have kidney disease or take medication that affects the kidneys.",
      "Early water retention of a pound or two is common and is not fat gain.",
    ],
    pros: ["Lowest cost per gram of the picks", "Single ingredient, nothing added"],
    cons: ["Needs mixing", "Can feel gritty in cold water"],
    brandUrl: "https://www.iherb.com/search?kw=california%20gold%20nutrition%20creatine",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "iHerb",
    lastReviewed: null,
    verified: false,
  },
  {
    slug: "bioptimizers-magnesium-breakthrough",
    name: "Magnesium Breakthrough",
    brand: "BIOptimizers",
    category: "Magnesium",
    format: "Capsules",
    summary: "A multi-form magnesium blend for an evening routine.",
    verdict:
      "The pick for people who want magnesium in several forms in one capsule. The research on specific forms is thinner than the marketing suggests, so read the evidence grades before you buy, and compare the elemental magnesium per serving with a single-form product.",
    bestFor: ["Adults whose diet is low in magnesium-rich foods", "People building an evening routine"],
    notFor: ["Anyone with kidney disease", "Buyers who want the lowest cost per milligram"],
    servingSize: null,
    servingsPerContainer: null,
    ingredients: [{ name: "Magnesium (multiple forms)", amount: null }],
    priceUsd: null,
    priceCheckedAt: null,
    testing: [],
    evidence: [
      {
        claim: "Supports normal energy metabolism",
        grade: "strong",
        summary:
          "The body needs magnesium for the enzymes that turn food into usable energy. Extra magnesium is most likely to make a noticeable difference if your diet falls short.",
        citations: [],
      },
      {
        claim: "Supports normal muscle and nerve function",
        grade: "strong",
        summary:
          "Magnesium is an essential mineral, and many US adults eat less than the recommended amount.",
        citations: [],
      },
      {
        claim: "May support sleep quality in older adults",
        grade: "early",
        summary:
          "A small number of short trials report better sleep scores, but the studies are small and the results are not consistent.",
        citations: [],
      },
    ],
    safety: [
      "Do not take magnesium supplements if you have kidney disease unless your doctor advises it.",
      "Separate from some antibiotics and osteoporosis medicines by a few hours; ask your pharmacist.",
      "Some forms loosen stools at higher doses.",
    ],
    pros: ["Several forms in one product", "Capsules, no taste"],
    cons: ["Higher cost than single-form magnesium", "Little research on the blend itself"],
    brandUrl: "https://bioptimizers.com",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "BIOptimizers",
    lastReviewed: null,
    verified: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Price per serving in USD, or null if either figure is still unverified. */
export function costPerServing(p: Product): number | null {
  if (p.priceUsd === null || !p.servingsPerContainer) return null;
  return p.priceUsd / p.servingsPerContainer;
}

/** Where a shopper ends up: the affiliate link once approved, else the brand. */
export function outboundUrl(p: Product): string {
  return p.affiliateUrl ?? p.brandUrl;
}

/**
 * Whether the Buy button may go through /healthy/go. Before approval the
 * destination is a plain brand URL, so counting clicks breaks no programme's
 * rules. Once an affiliate link exists, only programmes that permit redirects
 * keep it; everything else links straight to the affiliate URL.
 */
export function usesRedirect(p: Product): boolean {
  return p.affiliateUrl === null || p.redirectAllowed;
}

/** The href the Buy button renders. */
export function buyHref(p: Product, from: string): string {
  return usesRedirect(p) ? `/healthy/go/${p.slug}?from=${from}` : outboundUrl(p);
}
