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
  category: "Creatine" | "Magnesium" | "L-theanine";
  format: string;
  /** Product packshot, or null until we have one checked against the brand's own listing. Path under /public. */
  image: string | null;
  imageAlt: string;
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

/** The hero headline. Structure/function wording, so it needs the FDA disclaimer on any page that shows it. */
export const TAGLINE = "Choose supplements with more confidence.";

/** Intro copy for the homepage's "why three" band, sitting above the individual picks. */
export const TRIO_INTRO = {
  eyebrow: "Magnesium + L-theanine + Creatine",
  headline: "A purposeful trio for your healthy aging routine.",
  body: "Support your nutritional foundations. Make space to unwind. Get more from your strength training. Three complementary ingredients, each with a clear role.",
  /** Guards against the one overclaim this framing invites: that three together beat one alone. */
  disclaimer:
    "Each ingredient has research behind it on its own. Taking all three together hasn't been shown to work better than any one alone, or to extend lifespan.",
};

export type Goal = "energy" | "strength" | "focus" | "calm";

export type Supplement = {
  id: "magnesium" | "creatine" | "l-theanine";
  name: string;
  /** Short, benefit-led label for cards and tiles ("Cover the essentials"). */
  tagline: string;
  /** One-line takeaway for the trio section ("A thoughtful addition to your evening routine."). */
  value: string;
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
    tagline: "Cover the essentials",
    value: "Essential nutritional support for an active life.",
    role: "Muscle function and energy metabolism",
    contribution:
      "Supports normal muscle contraction, nerve signaling and cellular energy production.",
    category: "Magnesium",
  },
  {
    id: "creatine",
    name: "Creatine",
    tagline: "Make your strength work count",
    value: "Extra support for the effort you put into getting stronger.",
    role: "Strength, physical performance and cognitive support, including focus",
    contribution: "Supports strength and lean-mass gains alongside resistance training.",
    caveat:
      "Cognitive benefits are promising, but reliable improvements in everyday focus are not yet established.",
    category: "Creatine",
  },
  {
    id: "l-theanine",
    name: "L-theanine",
    tagline: "Support your wind-down",
    value: "A thoughtful addition to your evening routine.",
    role: "Calm and relaxation",
    contribution: "May support relaxation, managing everyday stress and winding down.",
    category: "L-theanine",
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

export type Faq = { question: string; answer: string };

/** Short, honest answers for the homepage FAQ. No hedging beyond what's true. */
export const faqs: Faq[] = [
  {
    question: "Is this medical advice?",
    answer:
      "No. It's general information, not a diagnosis or personal medical guidance. Talk to your doctor before starting a supplement, especially if you take medication or have a health condition.",
  },
  {
    question: "Do you earn money if I buy?",
    answer:
      "Sometimes. Some links pay a commission if you buy through them, at no extra cost to you. It never decides which products are listed or how they're graded.",
  },
  {
    question: "Why only one product per category?",
    answer:
      "One clear answer beats twenty options. Each pick is the one that best matched its studied dose, label and price once the research was checked; see why these picks for the comparison.",
  },
  {
    question: "How often are picks re-checked?",
    answer:
      "At least every six months, or sooner if the price, label or evidence changes. A pick is dropped if it stops earning its place.",
  },
  {
    question: "Can I take all three together?",
    answer:
      "Each one does a different job, so most people only need the one that matches their goal. If you take more than one, check with your doctor first, especially alongside any medication.",
  },
];

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

/**
 * All three picks are Thorne: label figures and USD prices below were read
 * directly from thorne.com on the date in `priceCheckedAt`/`lastReviewed`,
 * not estimated or converted from another currency.
 */
export const products: Product[] = [
  {
    slug: "thorne-magnesium-glycinate",
    name: "Magnesium Glycinate",
    brand: "Thorne",
    category: "Magnesium",
    format: "Capsules",
    image: "/healthy/products/thorne-magnesium-glycinate.png",
    imageAlt: "Bottle of Thorne Magnesium Glycinate, 90 capsules",
    summary: "Single-ingredient magnesium glycinate, dosed one capsule at a time.",
    verdict:
      "Straightforward, well-absorbed magnesium at 120 mg per capsule, so you can build your dose up gradually. Costs more per milligram than a bulk powder, but the label is one ingredient, no blend.",
    bestFor: [
      "Adults who want to titrate their dose one capsule at a time",
      "Anyone who gets loose stools from higher-dose magnesium forms",
    ],
    notFor: ["Buyers who want the lowest cost per milligram of elemental magnesium"],
    servingSize: "1 capsule",
    servingsPerContainer: 90,
    ingredients: [
      {
        name: "Magnesium (as magnesium glycinate)",
        amount: "120 mg",
        studiedDose: "Supplemental intake studied up to 350 mg/day, the tolerable upper limit for supplemental elemental magnesium",
      },
    ],
    priceUsd: 26,
    priceCheckedAt: "September 17, 2026",
    testing: [
      "Not NSF Certified for Sport. Thorne's own magnesium bisglycinate powder carries that mark; this glycinate capsule does not.",
      "Thorne states the product is made under NSF-audited cGMP manufacturing, but publishes no independent certificate of analysis for this specific SKU.",
    ],
    evidence: [
      {
        claim: "Supports normal muscle and nerve function",
        grade: "strong",
        summary:
          "Magnesium is required for muscle contraction and nerve signaling, and most US adults do not meet the recommended daily intake from food alone.",
        citations: [
          {
            label: "NIH Office of Dietary Supplements: Magnesium, health professional fact sheet",
            url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
          },
        ],
      },
      {
        claim: "Supports normal energy metabolism",
        grade: "strong",
        summary: "Magnesium is a cofactor for the enzymes that convert food into usable cellular energy.",
        citations: [
          {
            label: "NIH Office of Dietary Supplements: Magnesium, health professional fact sheet",
            url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
          },
        ],
      },
      {
        claim: "May support sleep quality when magnesium intake is low",
        grade: "early",
        summary:
          "A 7-week randomized trial in adults over 50 with poor sleep found sleep scores improved on magnesium citrate, but improved by a similar amount on the placebo too, so the trial could not show magnesium caused the change.",
        citations: [
          {
            label: "Nielsen et al., 2011, Magnesium Research (randomized trial, 96 adults over 50)",
            url: "https://pubmed.ncbi.nlm.nih.gov/21199787/",
          },
        ],
      },
    ],
    safety: [
      "Do not take magnesium supplements if you have kidney disease unless your doctor advises it.",
      "Separate from some antibiotics and osteoporosis medicines by a few hours; ask your pharmacist.",
      "Higher doses of most magnesium forms can loosen stools; glycinate is one of the gentler forms.",
    ],
    pros: [
      "Single ingredient, easy to check against the label",
      "Sold directly by Thorne, no marketplace resale risk",
      "One-capsule serving makes it easy to adjust your dose",
    ],
    cons: [
      "Higher cost per milligram of elemental magnesium than a bulk glycinate powder",
      "Not NSF Certified for Sport, unlike Thorne's own creatine",
    ],
    brandUrl: "https://www.thorne.com/products/dp/magnesium-glycinate",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "Thorne",
    lastReviewed: "September 17, 2026",
    verified: true,
  },
  {
    slug: "thorne-creatine-stick-packs",
    name: "Creatine Monohydrate Stick Packs",
    brand: "Thorne",
    category: "Creatine",
    format: "Powder stick packs",
    image: "/healthy/products/thorne-creatine-stick-packs.png",
    imageAlt: "Box of Thorne Creatine Travel Packs, 30 stick packs",
    summary: "Pre-measured 5 g creatine monohydrate packets, NSF Certified for Sport.",
    verdict:
      "A single measured 5 g dose of plain creatine monohydrate per packet, no scoop needed, and NSF Certified for Sport so every batch is checked for banned substances. Costs more per gram than a bulk tub.",
    bestFor: [
      "Travel and gym-bag routines where measuring powder is impractical",
      "Athletes who need NSF Certified for Sport testing for banned substances",
    ],
    notFor: ["Buyers who want the lowest cost per gram (a bulk tub is cheaper per serving)"],
    servingSize: "1 packet (5 g)",
    servingsPerContainer: 30,
    ingredients: [{ name: "Creatine monohydrate", amount: "5 g", studiedDose: "3 to 5 g per day" }],
    priceUsd: 36,
    priceCheckedAt: "September 17, 2026",
    testing: [
      "NSF Certified for Sport: every batch is tested for label accuracy and for nearly 300 substances banned by major athletic organizations.",
    ],
    evidence: [
      {
        claim: "Supports muscle strength when combined with resistance training",
        grade: "strong",
        summary:
          "In a meta-analysis of 22 randomized trials in adults with a mean age of 57 to 70, creatine taken alongside resistance training produced significantly greater gains in chest- and leg-press strength than training with a placebo.",
        citations: [
          {
            label: "Chilibeck et al., 2017, Open Access Journal of Sports Medicine (meta-analysis, 721 older adults)",
            url: "https://pubmed.ncbi.nlm.nih.gov/29138605/",
          },
        ],
      },
      {
        claim: "Supports lean muscle mass with regular training",
        grade: "moderate",
        summary:
          "Pooled results show a meaningful average gain in lean tissue mass in older adults, though the size of the effect varies by dosing strategy and study length.",
        citations: [
          {
            label: "Forbes et al., 2021, Nutrients (meta-analysis of creatine ingestion strategies in older adults)",
            url: "https://pubmed.ncbi.nlm.nih.gov/34199420/",
          },
        ],
      },
    ],
    safety: [
      "Talk to your doctor first if you have kidney disease or take medication that affects the kidneys.",
      "Early water retention of a pound or two is common and is not fat gain.",
    ],
    pros: [
      "NSF Certified for Sport, batch-tested for banned substances",
      "No scoop or scale needed",
      "Plain creatine monohydrate, the form used in the research",
    ],
    cons: [
      "Higher cost per gram than a bulk tub of the same brand's creatine",
      "30 packets is roughly a one-month supply at one serving a day, so it means more frequent reordering",
    ],
    brandUrl: "https://www.thorne.com/products/dp/creatine-sf903p",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "Thorne",
    lastReviewed: "September 17, 2026",
    verified: true,
  },
  {
    slug: "thorne-theanine",
    name: "Theanine",
    brand: "Thorne",
    category: "L-theanine",
    format: "Capsules",
    image: "/healthy/products/thorne-theanine.png",
    imageAlt: "Bottle of Thorne Theanine, 90 capsules",
    summary: "200 mg of Suntheanine, a patented, purified form of L-theanine, one capsule at a time.",
    verdict:
      "200 mg of Suntheanine per capsule, the branded form used in most human L-theanine research, at a fixed dose. Costs more per capsule than generic L-theanine.",
    bestFor: [
      "Adults who want a single, well-documented form of L-theanine",
      "Evening or pre-stress dosing at a fixed 200 mg",
    ],
    notFor: ["Buyers who want the lowest cost per milligram (generic L-theanine capsules are cheaper)"],
    servingSize: "1 capsule",
    servingsPerContainer: 90,
    ingredients: [{ name: "L-theanine (as Suntheanine)", amount: "200 mg", studiedDose: "200 to 400 mg per day" }],
    priceUsd: 68,
    priceCheckedAt: "September 17, 2026",
    testing: [
      "Thorne states this product is third-party tested to verify label accuracy and to screen for heavy metals, pesticides and microorganisms.",
      "Not NSF Certified for Sport.",
    ],
    evidence: [
      {
        claim: "May support relaxation and a calmer response to everyday stress",
        grade: "moderate",
        summary:
          "A systematic review of 9 randomized controlled trials found that 200 to 400 mg per day of L-theanine may help lower stress and anxiety symptoms in people under stressful conditions, though the authors called for larger, longer trials before it is relied on as an established therapy.",
        citations: [
          {
            label: "Williams et al., 2020, Plant Foods for Human Nutrition (systematic review, 9 RCTs)",
            url: "https://pubmed.ncbi.nlm.nih.gov/31758301/",
          },
        ],
      },
      {
        claim: "May increase alpha brain-wave activity associated with relaxed wakefulness",
        grade: "early",
        summary:
          "A crossover trial measuring brain activity directly found greater resting alpha-wave activity 2 hours after an L-theanine drink than after placebo, but only in people who ran higher in trait anxiety to start with.",
        citations: [
          {
            label: "White et al., 2016, Nutrients (randomized crossover trial, MEG-measured brain activity)",
            url: "https://pubmed.ncbi.nlm.nih.gov/26797633/",
          },
        ],
      },
    ],
    safety: [
      "Generally well tolerated. Talk to your doctor before combining with blood pressure medication, since it may add to a blood-pressure-lowering effect.",
      "Interactions with sedatives have not been ruled out; check with a pharmacist if you take one.",
    ],
    pros: [
      "Suntheanine, the branded form used in most human research on L-theanine",
      "Single ingredient, fixed 200 mg dose",
      "Third-party tested for contaminants",
    ],
    cons: ["Costs more per capsule than generic L-theanine", "Not NSF Certified for Sport"],
    brandUrl: "https://www.thorne.com/products/dp/theanine",
    affiliateUrl: null,
    redirectAllowed: false,
    retailer: "Thorne",
    lastReviewed: "September 17, 2026",
    verified: true,
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
