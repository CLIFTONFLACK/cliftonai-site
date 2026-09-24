/**
 * Per-pick reference material behind /healthy/why-these-picks.
 *
 * The public page shows the brand's claims, Brian's read and the named
 * alternatives. The "say / don't say" guidance is for anyone writing ad or
 * social copy about these products, so it lives on the separate, noindexed
 * /healthy/why-these-picks/creator-notes page rather than in front of shoppers.
 */

export type BrandClaim = {
  claim: string;
  source: string;
};

export type ProductReference = {
  slug: string;
  /** Other real products considered and passed over in this category, for a named comparison. */
  alsoConsidered: string[];
  brandClaims: BrandClaim[];
  ourRead: string;
  say: string[];
  dontSay: string[];
};

export const references: ProductReference[] = [
  {
    slug: "thorne-magnesium-glycinate",
    alsoConsidered: ["Micro Ingredients Magnesium Glycinate (higher dose, bulkier pack)", "Nature Made Magnesium Glycinate (familiar pharmacy brand, lower elemental dose)"],
    brandClaims: [
      {
        claim:
          "“9 out of 10 consumers reported sleeping better and feeling calmer in stressful moments”",
        source: "Brand-run 28-day consumer perception study, 95 participants (company-run, not published or peer-reviewed)",
      },
      {
        claim: "As many as 75% of U.S. adults do not meet the FDA's recommended daily intake of 420 mg of magnesium",
        source: "Brand's product page, citing World Health Organization statistics",
      },
      {
        claim: "Magnesium is a cofactor in more than 600 of the body's enzymatic reactions",
        source: "Brand's product page",
      },
    ],
    ourRead:
      "The deficiency statistic and the enzyme-cofactor claim line up with the independent NIH fact sheet cited on the product page, so we treat those as robust evidence. The “9 out of 10” figure is the brand's own unpublished consumer survey of 95 people, not a controlled trial — it belongs in marketing copy as a customer-satisfaction note, not as clinical evidence. The actual randomized trial on magnesium and sleep found sleep improved on both magnesium and placebo, so the evidence grade for sleep stays “early” either way.",
    say: [
      "Supports normal muscle and nerve function (robust evidence — NIH)",
      "Supports normal energy metabolism (robust evidence — NIH)",
      "May support sleep quality in adults who fall short on dietary magnesium (early evidence)",
    ],
    dontSay: [
      "“Clinically proven to improve sleep” — the controlled trial found placebo worked just as well",
      "“9 out of 10 people” without naming it as the brand's own 95-person consumer survey",
      "Any claim that this specific capsule is NSF Certified for Sport — that mark belongs to this brand's magnesium bisglycinate powder, not this glycinate capsule",
    ],
  },
  {
    slug: "thorne-creatine-stick-packs",
    alsoConsidered: ["Nutricost Performance Creatine Monohydrate (lower cost per gram, out of stock at review time)", "Optimum Nutrition Micronized Creatine Powder (familiar sports-nutrition brand, needs a scoop)"],
    brandClaims: [
      {
        claim: "NSF Certified for Sport — every batch tested for label accuracy and near 300 banned substances",
        source: "Brand's product page and the NSF certification program",
      },
      {
        claim: "Supports cognitive function and a healthy body composition, especially in the aging population",
        source: "Brand's product page",
      },
    ],
    ourRead:
      "The NSF Certified for Sport claim is independently verifiable through NSF's own program, not just the brand's word, so we treat it as a fact rather than a marketing claim. The strength and lean-mass benefits are backed by real meta-analyses in older adults. The cognitive claim is the weakest of the three: promising early research, nothing settled.",
    say: [
      "Supports muscle strength when combined with resistance training (robust evidence)",
      "Supports lean muscle mass with regular training (promising evidence)",
      "NSF Certified for Sport, independently verifiable batch testing",
    ],
    dontSay: [
      "“Proven brain benefits” or “improves focus” — cognitive research on creatine is early, not established (see the honest caveat on the creatine card)",
      "“Clean” or “safe for athletes” as a substitute for naming the actual NSF Certified for Sport mark",
    ],
  },
  {
    slug: "thorne-theanine",
    alsoConsidered: ["NOW Foods L-Theanine (cheapest per capsule, includes added inositol)", "Life Extension Theanine XR Stress Relief (highest single dose, extended-release format)"],
    brandClaims: [
      {
        claim: "Suntheanine® has been the subject of at least 50 studies over the past 20 years",
        source: "Brand's product page",
      },
      {
        claim: "200 mg of L-theanine increased alpha brain waves and relaxation starting about 40 minutes after intake",
        source: "Brand's product page, citing a Japanese study",
      },
      {
        claim: "Third-party tested to verify label accuracy and screen for heavy metals, pesticides and microorganisms",
        source: "Brand's product page",
      },
    ],
    ourRead:
      "“At least 50 studies” is the brand's tally across the ingredient (not this specific product), and it mixes human trials, animal studies and manufacturer-funded work. The independent research we cite below is a systematic review of 9 human randomized controlled trials on stress and anxiety, and a separate crossover trial measuring brain activity directly — real, but smaller and narrower than “50 studies” implies. The alpha-wave effect showed up only in people who ran higher in trait anxiety to begin with.",
    say: [
      "May support relaxation and a calmer response to everyday stress (promising evidence, 9-RCT systematic review)",
      "May increase alpha brain-wave activity linked to relaxed wakefulness (early evidence)",
      "Suntheanine is the branded form most human studies actually use",
    ],
    dontSay: [
      "“50 clinical studies” without qualifying that the figure spans animal research and manufacturer-funded work, not 50 independent human trials",
      "“Works like a sedative” or any sleep-specific claim — the evidence is for relaxed alertness, not sedation",
      "Any NSF Certified for Sport claim — this SKU does not carry that mark",
    ],
  },
];
