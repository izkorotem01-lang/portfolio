import type { ProofCard } from "@/lib/sanitySite";

/** Shown when Sanity has no proof cards — mirrors seeded outcome cards */
export const PROOF_CARDS_FALLBACK: ProofCard[] = [
  {
    id: "proofCard-noam-firuz",
    cardNumber: "01",
    clientName: "Noam Firuz",
    clientRole: "Content Creator",
    headerMedia: {
      id: "header",
      videoUrl: "https://www.youtube.com/watch?v=lPB_KyjWZko",
    },
    titleSegments: [
      { id: "t1", text: "One edit reignited a dead channel — ", accent: false },
      { id: "t2", text: "46K views, audience back.", accent: true },
    ],
    checkpoints: [
      "Channel was inactive for about a year before the comeback edit.",
      "Comeback video reached 46K views and kept climbing.",
      "Comments flooded in — audience re-engaged instantly.",
      "Fans asked who edited the video.",
    ],
    statistics: [
      { id: "s1", value: "46K", label: "Views" },
      { id: "s2", value: "+340", label: "New subs" },
      { id: "s3", value: "8.7%", label: "Engagement" },
      { id: "s4", value: "1 yr", label: "Channel dormant" },
    ],
    order: 0,
  },
  {
    id: "proofCard-yishai-gabian",
    cardNumber: "02",
    clientName: "Yishai Gabian",
    clientRole: "Entrepreneur & Mentor",
    headerMedia: {
      id: "header",
      videoUrl: "https://www.youtube.com/watch?v=DR0deXOlWJQ",
    },
    titleSegments: [
      { id: "t1", text: "Half the ad spend. ", accent: false },
      { id: "t2", text: "Hundreds of leads every week.", accent: true },
    ],
    checkpoints: [
      "Worked together for over 6 months on YouTube, reels, and campaigns.",
      "Marketing budget cut by ~50% while lead volume kept climbing.",
      "Hundreds of qualified leads every week from organic + paid.",
    ],
    statistics: [
      { id: "s1", value: "350+", label: "Weekly leads" },
      { id: "s2", value: "-50%", label: "Marketing budget" },
      { id: "s3", value: "4.3x", label: "ROI increase" },
      { id: "s4", value: "₪15", label: "Cost per lead" },
    ],
    order: 1,
  },
  {
    id: "proofCard-shaked-siroa",
    cardNumber: "03",
    clientName: "Shaked Siroa",
    clientRole: "Co-Founder · Personal Brand",
    titleSegments: [
      { id: "t1", text: "Our own personal brand — ", accent: false },
      { id: "t2", text: "a decade of content, now viral.", accent: true },
    ],
    checkpoints: [
      "Co-founder with nearly 10 years of content creation experience.",
      "Built a reel system with RIZZ that turned consistency into viral reach.",
      "Personal brand and RIZZ Productions grow together — same engine, same standards.",
      "Audience scaled through scroll-stopping branded content, not random posts.",
    ],
    statistics: [
      { id: "s1", value: "120+", label: "Viral videos" },
      { id: "s2", value: "10M+", label: "Total views" },
      { id: "s3", value: "10+", label: "Years creating" },
      { id: "s4", value: "1M+", label: "Top reel views" },
    ],
    order: 2,
  },
];
