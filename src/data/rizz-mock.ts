import rotemImg from "@/assets/rotem.webp";
import shakedImg from "@/assets/shaked.webp";

import timelapseLogo from "@/assets/client-icons/timelapse.png";
import noamLogo from "@/assets/client-icons/noam-firuz.png";
import xauLogo from "@/assets/client-icons/xaufunded.png";
import mbLogo from "@/assets/client-icons/MB.png";
import itayLogo from "@/assets/client-icons/itay-dahari.png";
import margoaLogo from "@/assets/client-icons/margoa-natania.png";
import paletLogo from "@/assets/client-icons/palet-jewlry.png";
import saritLogo from "@/assets/client-icons/sarit-farjun.png";
import shapoLogo from "@/assets/client-icons/shapo-digital.png";
import boldLogo from "@/assets/client-icons/the-bold-crew.png";

export const NAV_LINKS = [
  { label: "Results", href: "#proof" },
  { label: "Work", href: "#work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About", href: "#about" },
];

export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: "Contact", href: "#contact" },
];

export const RIZZ_SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rotemizko_/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@RoTeMIZKo",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@rotem.izko",
  },
];

export const RIZZ_TAGLINE = "Strategy · Production · Distribution";

export const AUDIENCE_CARDS = [
  {
    icon: "play" as const,
    title: "Creators",
    description: "Build audiences people remember.",
    gradient: "from-slate-900 via-blue-950 to-slate-900",
  },
  {
    icon: "graduation" as const,
    title: "Mentors",
    description: "Turn expertise into authority.",
    gradient: "from-stone-900 via-amber-950/40 to-stone-900",
  },
  {
    icon: "crown" as const,
    title: "Brands",
    description: "Create content that drives real growth.",
    gradient: "from-zinc-900 via-emerald-950/30 to-zinc-900",
  },
  {
    icon: "cart" as const,
    title: "E-commerce",
    description: "Scale attention into customers.",
    gradient: "from-neutral-900 via-orange-950/30 to-neutral-900",
  },
];

export const SERVICES = [
  {
    number: "01",
    title: "A YouTube system that turns views into",
    titleAccent: "bookings.",
    description:
      "A content engine built for discovery, trust, and consistent high-intent leads.",
    gradient: "from-blue-950 via-slate-900 to-blue-950",
    icon: "play" as const,
  },
  {
    number: "02",
    title: "Brand films that make people",
    titleAccent: "stop scrolling.",
    description:
      "Cinematic brand stories that position you as the obvious choice.",
    gradient: "from-orange-950/80 via-stone-900 to-orange-950/60",
    icon: "clapperboard" as const,
  },
  {
    number: "03",
    title: "Short-form that builds",
    titleAccent: "authority on autopilot.",
    description:
      "High-retention content that builds trust, scales reach, and compounds over time.",
    gradient: "from-slate-900 via-indigo-950/50 to-slate-900",
    icon: "zap" as const,
  },
  {
    number: "04",
    title: "Campaigns built for a single",
    titleAccent: "launch or offer.",
    description:
      "High-impact campaigns engineered to drive urgency, conversions, and results.",
    gradient: "from-indigo-950 via-violet-950/40 to-indigo-950",
    icon: "target" as const,
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Diagnose",
    icon: "search" as const,
    description: "Clarity on your goals, audience, and content gaps.",
  },
  {
    step: "02",
    title: "Build",
    icon: "box" as const,
    description: "Production plan built for impact.",
  },
  {
    step: "03",
    title: "Produce",
    icon: "clapperboard" as const,
    description: "Premium content designed to connect and convert.",
  },
  {
    step: "04",
    title: "Optimize",
    icon: "chart" as const,
    description: "Refine for reach, engagement, and results.",
  },
  {
    step: "05",
    title: "Scale",
    icon: "trending" as const,
    description: "More output, same quality, compounding growth.",
  },
];

export const PROOF_CARDS = [
  { metric: "46K", label: "Views — comeback video", client: "Noam Firuz" },
  { metric: "892", label: "Weekly leads generated", client: "Yishai Gabian" },
  { metric: "+340%", label: "Watch time growth", client: "Nitai Nakel" },
  { metric: "2.3M+", label: "Total reel views", client: "Shaked Siroa" },
  { metric: "₪34K", label: "Ad spend saved monthly", client: "Yishai Gabian" },
];

export const CLIENT_LOGOS = [
  { name: "Timelapse IT", logo: timelapseLogo },
  { name: "Noam Firuz", logo: noamLogo },
  { name: "XAU Funded", logo: xauLogo },
  { name: "MB", logo: mbLogo },
  { name: "Itay Dahari", logo: itayLogo },
  { name: "Margoa Natania", logo: margoaLogo },
  { name: "Palet Jewelry", logo: paletLogo },
  { name: "Sarit Farjun", logo: saritLogo },
  { name: "Shapo Digital", logo: shapoLogo },
  { name: "The Bold Crew", logo: boldLogo },
];

export const CASE_STUDIES = [
  {
    number: "01",
    client: "Noam Firuz",
    category: "Content Creator",
    headline: "One edit changed how his audience saw him.",
    bullets: [
      "Channel was inactive for about a year.",
      "Comeback video reached 46K views.",
      "Audience re-engaged instantly.",
      "Fans asked who edited the video.",
    ],
    metrics: [
      { value: "46K", label: "Views" },
      { value: "8.7%", label: "Engagement" },
      { value: "+312%", label: "Subs gained" },
    ],
    gradient: "from-[#030712] via-[#0d1f3a] to-[#030712]",
  },
  {
    number: "02",
    client: "Yishai Gabian",
    category: "Entrepreneur & Mentor",
    headline: "A content engine that closes clients, not just views.",
    bullets: [
      "Worked together for over 6 months.",
      "Hundreds of weekly leads from campaigns, organic & YouTube.",
      "Reduced dependency on paid acquisition.",
      "Saved tens of thousands in marketing spend.",
    ],
    metrics: [
      { value: "350+", label: "Weekly leads" },
      { value: "-62%", label: "CPA reduction" },
      { value: "4.3x", label: "ROI increase" },
    ],
    gradient: "from-[#030712] via-[#150d2e] to-[#030712]",
  },
  {
    number: "03",
    client: "Nitai Nakel",
    category: "Bold Academy",
    headline: "Students started finding the school — not the other way around.",
    bullets: [
      "Authority growth across YouTube & social.",
      "Stronger positioning in a crowded market.",
      "Educational content system that scales.",
    ],
    metrics: [
      { value: "+215%", label: "Organic traffic" },
      { value: "+173%", label: "YouTube subs" },
      { value: "+89%", label: "Inquiries" },
    ],
    gradient: "from-[#030712] via-[#0d1a20] to-[#030712]",
  },
];

export const PORTFOLIO_ITEMS = [
  { title: "Coffee Project", category: "Hospitality", gradient: "from-amber-900 to-stone-900" },
  { title: "Jewelry Brand", category: "Luxury Retail", gradient: "from-yellow-900 to-zinc-900" },
  { title: "Plastic Factory", category: "Industrial Brand", gradient: "from-slate-800 to-zinc-900" },
  { title: "Tattoo Artist", category: "Personal Brand", gradient: "from-gray-900 to-neutral-800" },
  { title: "Bold Academy", category: "Education", gradient: "from-blue-950 to-indigo-950" },
  { title: "Fitness Coach", category: "Creator Brand", gradient: "from-orange-950 to-red-950" },
  { title: "Skincare Brand", category: "Beauty & Wellness", gradient: "from-rose-950 to-pink-950" },
  { title: "Real Estate Film", category: "Real Estate", gradient: "from-emerald-950 to-teal-950" },
];

export const TESTIMONIALS = [
  {
    name: "Noam Firuz",
    stars: 5,
    quote: {
      he: "נראה מעולה אחי. כל הכבוד.",
      en: "Looks amazing, bro. Well done.",
    },
  },
  {
    name: "Yishai Gabian",
    stars: 5,
    quote: {
      he: "הורדנו פי שתיים תקציב בזכותך — מ-30₪ לליד ל-15₪ לליד. חסכון של בערך 15,000₪.",
      en: "We cut the budget in half thanks to you — from ₪30 per lead to ₪15 per lead. Savings of about ₪15,000.",
    },
  },
  {
    name: "Nitai Nakel",
    stars: 5,
    quote: {
      he: "זה הנוכחי בכלל חולני. חשמל חשמל פיצוצים.",
      en: "This one's totally insane. Electric, electric, explosive.",
    },
  },
  {
    name: "Shaked Siroa",
    stars: 5,
    quote: {
      he: "הרבה מהקרדיט הולך לאיצקו על העריכה — אחרת הסרטון היה על 60K צפיות.",
      en: "A lot of the credit goes to Itzko for the editing — otherwise the video would've been at 60K views.",
    },
  },
  {
    name: "@ivri3235",
    stars: 5,
    quote: {
      he: "וואלה אהבתי את העריכה — אשכרה כל רגע, המעברים המהירים, וכל הדברים הקטנים. באמת סרטון אש.",
      en: "Wow, I loved the editing — literally every moment, the fast cuts, and all the little details. Truly a fire video.",
    },
  },
  {
    name: "@GhhvBdbbh",
    stars: 5,
    quote: {
      he: "מי עורך לך את הסרטונים ביוטיוב? אשמח ליצור קשר עם העורך.",
      en: "Who edits your YouTube videos? I'd love to get in touch with the editor.",
    },
  },
  {
    name: "Yishai Gabian",
    stars: 5,
    quote: {
      he: "הסרטון אש, לא צריך תיקונים.",
      en: "The video is fire — no revisions needed.",
    },
  },
  {
    name: "Shaked Siroa",
    stars: 5,
    quote: {
      he: "אתה מטורף אחי, איזה מלך.",
      en: "You're insane, bro — what a king.",
    },
  },
];

export const FOUNDERS_INTRO =
  "RIZZ Productions is led by founders who have been on both sides of the camera — building systems that scale content without sacrificing quality.";

export const FOUNDERS_VALUES =
  "International Perspective. | Creative Discipline. | Real Results.";

export const FOUNDERS = [
  {
    name: "Rotem Itzkovich",
    role: "Co-Founder",
    keywords: "Strategy • Growth • Systems",
    bio: "Responsible for content strategy, production system architecture, and turning brand goals into measurable content output.",
    image: rotemImg,
    variant: "portrait" as const,
  },
  {
    name: "Shaked Siroa",
    role: "Co-Founder",
    keywords: "Creative • Storytelling • Presence",
    bio: "Concept development, visual storytelling, and transforming ideas into content that connects with real audiences.",
    image: shakedImg,
    variant: "portrait" as const,
  },
  {
    name: "Our Extended Team",
    role: "Editors • Producers • AI Agents",
    badge: "The engine behind it all",
    bio: "A global team of elite creatives, editors, and AI specialists — aligned to deliver more than content. We deliver results.",
    variant: "team" as const,
  },
];

export const TRUSTED_BRANDS = [
  "Daikin", "Any.do", "Fiverr", "Monday.com", "Torras", "AirDoctor",
];
