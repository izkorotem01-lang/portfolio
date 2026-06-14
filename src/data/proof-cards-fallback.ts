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
      { id: "t1", text: "We revived a dead YouTube channel — ", accent: false },
      { id: "t2", text: "50K views in 10 hours.", accent: true },
    ],
    checkpoints: [
      "Channel was inactive for about a year before the comeback edit.",
      "Comeback video crossed 50K views within the first 10 hours.",
      "Comments flooded in — audience re-engaged instantly.",
      "Fans asked who edited the video.",
    ],
    statistics: [
      { id: "s1", value: "50K", label: "Views" },
      { id: "s2", value: "10 hrs", label: "To 50K" },
      { id: "s3", value: "+312%", label: "Subs gained" },
      { id: "s4", value: "8.7%", label: "Engagement" },
    ],
    bottomMedia: [],
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
      { id: "s4", value: "-62%", label: "CPA reduction" },
    ],
    bottomMedia: [],
    order: 1,
  },
  {
    id: "proofCard-shaked-siroa",
    cardNumber: "03",
    clientName: "Shaked Siroa",
    clientRole: "Content Creator",
    titleSegments: [
      { id: "t1", text: "A creator we took from steady posts to ", accent: false },
      { id: "t2", text: "repeat viral hits.", accent: true },
    ],
    checkpoints: [
      "Built a reel system designed for shareability, not just consistency.",
      "Multiple videos broke out — views, saves, and shares stacked fast.",
      "Personal brand started getting recognized beyond his existing audience.",
    ],
    statistics: [
      { id: "s1", value: "120+", label: "Viral videos" },
      { id: "s2", value: "2.3M+", label: "Total views" },
      { id: "s3", value: "48K", label: "Avg. per hit" },
      { id: "s4", value: "850K+", label: "Top reel views" },
    ],
    bottomMedia: [],
    order: 2,
  },
];
