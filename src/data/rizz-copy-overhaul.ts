/**
 * English copy for the sections added in the Website Copy Overhaul Plan.
 * Hebrew is intentionally not included yet: per the plan, the Hebrew page is
 * rewritten (adapted, not translated) only after the English version is approved.
 * Until then these sections render on /en only.
 */

export const SERVICES_COPY_EN = {
  eyebrow: "What We Do",
  titlePrimary: "OUR",
  titleAccent: "SERVICES",
  cards: [
    {
      title: "YouTube Videos",
      description:
        "Full production and editing that keeps people watching and turns viewers into an audience.",
    },
    {
      title: "Reels & Shorts",
      description:
        "Scroll-stopping short-form content built for consistency, not one-off posts.",
    },
    {
      title: "Video Ads",
      description: "Ad creative built to convert, not just look good.",
    },
    {
      title: "Content Strategy",
      description: "Planning, scripting, and direction behind every piece of content.",
    },
  ],
  footnote:
    "We also build the tech behind it — websites, landing pages, and marketing funnels that turn your content into leads.",
} as const;

export const FAQ_COPY_EN = {
  eyebrow: "FAQ",
  titlePrimary: "QUESTIONS,",
  titleAccent: "ANSWERED.",
  items: [
    {
      q: "Do you film, or do we need our own crew?",
      a: "No — we bring our own crew.",
    },
    {
      q: "What's included in a package?",
      a: "Depends entirely on the business's needs — no two packages are the same.",
    },
    {
      q: "How is pricing structured?",
      a: "Based on the scope of work in your package.",
    },
    {
      q: "How many revisions are included?",
      a: "We work on monthly retainers, so it's ongoing — not capped per round.",
    },
    {
      q: "Do you work with businesses outside Israel?",
      a: "Yes — we work with international clients and are fluent in English.",
    },
    {
      q: "Do you run the ad campaigns too, or just create the content?",
      a: "Yes, both.",
    },
    {
      q: "How long is a typical engagement?",
      a: "We start with a 3-month pilot. If it's working for both sides, we move to a yearly contract — because businesses that are actually growing need content consistency, not a one-off project.",
    },
    // OPEN: "How long does it take to get my finished video?" — answer still
    // pending from the team (see plan's Next Steps). Add it here once confirmed.
  ],
} as const;

export const SERVICES_NAV_LINK_EN = { label: "Services", href: "#services" } as const;

/** EN SEO title matching the new hero headline (code fallback until Sanity seo.title is updated). */
export const SEO_TITLE_EN = "RIZZ Productions | We turn your videos into clients";

/** Linear How It Works steps (EN). Used until Sanity holds the 5-step process. */
export const HOW_IT_WORKS_EN = {
  title: "How It Works",
  steps: [
    { title: "Discovery Call", description: "We learn the business, the goals, and who you're trying to reach." },
    { title: "Custom Package", description: "Built around what you actually need, not a template." },
    { title: "Production", description: "Scripts, creative, strategy, filming, and editing, all handled." },
    { title: "Your Approval", description: "Everything comes to you for review before anything goes out." },
    { title: "Launch", description: "Once approved, we publish." },
  ],
} as const;
