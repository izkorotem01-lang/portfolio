import type { ContentLocale } from "@/i18n/locale";

export type NavLink = { label: string; href: string };

export type AudienceCard = {
  icon: "play" | "graduation" | "crown" | "cart";
  title: string;
  description: string;
};

export type ServiceItem = {
  number: string;
  title: string;
  titleAccent: string;
  icon: "play" | "clapperboard" | "zap" | "target";
};

export type ProcessStep = {
  step: string;
  title: string;
  icon: "search" | "box" | "clapperboard" | "chart" | "trending";
  description: string;
};

export type FounderItem = {
  name: string;
  role: string;
  keywords?: string;
  bio: string;
  badge?: string;
  variant: "portrait" | "team";
  imageKey?: "rotem" | "shaked";
};

export type RizzTranslations = {
  nav: {
    logoAlt: string;
    openMenu: string;
    bookCall: string;
    viewWork: string;
    switchToEn: string;
    switchToHb: string;
    links: NavLink[];
    footerLinks: NavLink[];
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    description: string;
    tagline: string;
  };
  proof: {
    eyebrow: string;
    titlePrimary: string;
    titleAccent: string;
    subtitle: string;
  };
  howWeGetYouThere: {
    whoItsFor: string;
    whatWeBuild: string;
    headlineBefore: string;
    headlineAccent: string;
    headlineAfter: string;
    howWeWork: string;
    audience: AudienceCard[];
    services: ServiceItem[];
    process: ProcessStep[];
  };
  portfolio: {
    eyebrow: string;
    titlePrimary: string;
    titleAccent: string;
    allVideos: string;
    categoriesAria: string;
    emptyState: string;
    untitled: string;
  };
  testimonials: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    starsAria: (count: number) => string;
  };
  founders: {
    eyebrow: string;
    titleFilmed: string;
    titleEdited: string;
    titleLived: string;
    titleBefore: string;
    titleAfter: string;
    intro: string;
    values: string;
    trustedBy: string;
    showBio: string;
    hideBio: string;
    cards: FounderItem[];
  };
  cta: {
    eyebrow: string;
    titleLine1: string;
    titleAccent: string;
    description: string;
    tagline: string;
    bookCall: string;
    whatsapp: string;
  };
  footer: {
    description: string;
    navigation: string;
    getStarted: string;
    getStartedDescription: string;
    copyright: (year: number) => string;
    tagline: string;
  };
};

const NAV_HREFS = {
  results: "#proof",
  howWeGetYouThere: "#how-we-get-you-there",
  work: "#work",
  testimonials: "#testimonials",
  about: "#about",
  contact: "#contact",
} as const;

const en: RizzTranslations = {
  nav: {
    logoAlt: "RIZZ Productions",
    openMenu: "Open menu",
    bookCall: "Book a Strategy Call →",
    viewWork: "View Our Work",
    switchToEn: "EN",
    switchToHb: "עב",
    links: [
      { label: "Results", href: NAV_HREFS.results },
      { label: "Work", href: NAV_HREFS.work },
      { label: "Testimonials", href: NAV_HREFS.testimonials },
      { label: "About", href: NAV_HREFS.about },
    ],
    footerLinks: [
      { label: "Results", href: NAV_HREFS.results },
      { label: "Work", href: NAV_HREFS.work },
      { label: "Testimonials", href: NAV_HREFS.testimonials },
      { label: "About", href: NAV_HREFS.about },
      { label: "Contact", href: NAV_HREFS.contact },
    ],
  },
  hero: {
    eyebrow: "RIZZ PRODUCTIONS",
    titleLine1: "CONTENT THAT",
    titleLine2: "TURNS INTO",
    titleAccent: "CLIENTS.",
    description:
      "A premium creative production studio for creators, entrepreneurs, brands and mentors. We craft scroll-stopping content and growth systems that turn attention into real, measurable business.",
    tagline: "Strategy · Creative · Production · Growth",
  },
  proof: {
    eyebrow: "Case Studies",
    titlePrimary: "REAL RESULTS,",
    titleAccent: "REAL PEOPLE.",
    subtitle: "Real businesses. Real content. Real transformation.",
  },
  howWeGetYouThere: {
    whoItsFor: "Who it's for",
    whatWeBuild: "What we build",
    headlineBefore: "For people who are already good at what they do but",
    headlineAccent: "invisible",
    headlineAfter: "on video",
    howWeWork: "How we work",
    audience: [
      {
        icon: "play",
        title: "Creators",
        description: "Build audiences people remember.",
      },
      {
        icon: "graduation",
        title: "Mentors",
        description: "Turn expertise into authority.",
      },
      {
        icon: "crown",
        title: "Brands",
        description: "Create content that drives real growth.",
      },
      {
        icon: "cart",
        title: "E-commerce",
        description: "Scale attention into customers.",
      },
    ],
    services: [
      {
        number: "01",
        title: "A YouTube system that turns views into",
        titleAccent: "bookings.",
        icon: "play",
      },
      {
        number: "02",
        title: "Brand films that make people",
        titleAccent: "stop scrolling.",
        icon: "clapperboard",
      },
      {
        number: "03",
        title: "Short-form that builds",
        titleAccent: "authority on autopilot.",
        icon: "zap",
      },
      {
        number: "04",
        title: "Campaigns built for a single",
        titleAccent: "launch or offer.",
        icon: "target",
      },
    ],
    process: [
      {
        step: "01",
        title: "Diagnose",
        icon: "search",
        description: "Clarity on your goals, audience, and content gaps.",
      },
      {
        step: "02",
        title: "Build",
        icon: "box",
        description: "Production plan built for impact.",
      },
      {
        step: "03",
        title: "Produce",
        icon: "clapperboard",
        description: "Premium content designed to connect and convert.",
      },
      {
        step: "04",
        title: "Optimize",
        icon: "chart",
        description: "Refine for reach, engagement, and results.",
      },
      {
        step: "05",
        title: "Scale",
        icon: "trending",
        description: "More output, same quality, compounding growth.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Our Portfolio",
    titlePrimary: "SELECTED",
    titleAccent: "WORK",
    allVideos: "All Videos",
    categoriesAria: "Portfolio categories",
    emptyState: "No videos found for this category.",
    untitled: "Untitled",
  },
  testimonials: {
    eyebrow: "Testimonials",
    titleLine1: "WHAT OUR CLIENTS",
    titleAccent: "SAY ABOUT US.",
    starsAria: (count) => `${count} out of 5 stars`,
  },
  founders: {
    eyebrow: "Studio / Founders",
    titleBefore: "BUILT BY SOMEONE WHO",
    titleFilmed: "FILMED IT",
    titleEdited: "EDITED IT",
    titleLived: "AND LIVED IT",
    titleAfter: "FIRST.",
    intro:
      "RIZZ Productions is led by founders who have been on both sides of the camera — building systems that scale content without sacrificing quality.",
    values: "International Perspective. | Creative Discipline. | Real Results.",
    trustedBy: "Trusted by ambitious brands",
    showBio: "show bio",
    hideBio: "hide bio",
    cards: [
      {
        name: "Rotem Itzkovich",
        role: "Co-Founder",
        keywords: "Strategy • Growth • Systems",
        bio: "Responsible for content strategy, production system architecture, and turning brand goals into measurable content output.",
        variant: "portrait",
        imageKey: "rotem",
      },
      {
        name: "Shaked Siroa",
        role: "Co-Founder",
        keywords: "Creative • Storytelling • Presence",
        bio: "Concept development, visual storytelling, and transforming ideas into content that connects with real audiences.",
        variant: "portrait",
        imageKey: "shaked",
      },
      {
        name: "Our Extended Team",
        role: "Editors • Producers • AI Agents",
        badge: "The engine behind it all",
        bio: "A global team of elite creatives, editors, and AI specialists — aligned to deliver more than content. We deliver results.",
        variant: "team",
      },
    ],
  },
  cta: {
    eyebrow: "Let's Build Your System",
    titleLine1: "READY TO LOOK",
    titleAccent: "UNDENIABLE ON VIDEO?",
    description:
      "We help creators, entrepreneurs, brands and mentors turn ideas into high-impact content systems that attract attention, build trust and drive measurable growth.",
    tagline: "Strategy · Production · Distribution",
    bookCall: "Book a Strategy Call →",
    whatsapp: "Message Us on WhatsApp",
  },
  footer: {
    description:
      "Content that turns into clients. We build high-impact video systems for creators, entrepreneurs, brands, and mentors — with real results you can measure.",
    navigation: "Navigation",
    getStarted: "Get Started",
    getStartedDescription:
      "Ready to look undeniable on video? Book a strategy call and we'll map a content system built for attention, trust, and growth.",
    copyright: (year) => `© ${year} RIZZ Productions. All rights reserved.`,
    tagline: "Strategy · Production · Distribution",
  },
};

const he: RizzTranslations = {
  nav: {
    logoAlt: "RIZZ Productions",
    openMenu: "פתח תפריט",
    bookCall: "קבעו שיחת אסטרטגיה ←",
    viewWork: "צפו בעבודות שלנו",
    switchToEn: "EN",
    switchToHb: "עב",
    links: [
      { label: "תוצאות", href: NAV_HREFS.results },
      { label: "עבודות", href: NAV_HREFS.work },
      { label: "המלצות", href: NAV_HREFS.testimonials },
      { label: "אודות", href: NAV_HREFS.about },
    ],
    footerLinks: [
      { label: "תוצאות", href: NAV_HREFS.results },
      { label: "עבודות", href: NAV_HREFS.work },
      { label: "המלצות", href: NAV_HREFS.testimonials },
      { label: "אודות", href: NAV_HREFS.about },
      { label: "צור קשר", href: NAV_HREFS.contact },
    ],
  },
  hero: {
    eyebrow: "RIZZ PRODUCTIONS",
    titleLine1: "תוכן שהופך",
    titleLine2: "ל",
    titleAccent: "לקוחות.",
    description:
      "סטודיו הפקה קריאייטיבי פרימיום ליוצרים, יזמים, מותגים ומנטורים. אנחנו בונים תוכן שעוצר גלילה ומערכות צמיחה שהופכות תשומת לב לעסק מדיד ואמיתי.",
    tagline: "אסטרטגיה · קריאייטיב · הפקה · צמיחה",
  },
  proof: {
    eyebrow: "מקרי בוחן",
    titlePrimary: "תוצאות אמיתיות,",
    titleAccent: "אנשים אמיתיים.",
    subtitle: "עסקים אמיתיים. תוכן אמיתי. טרנספורמציה אמיתית.",
  },
  howWeGetYouThere: {
    whoItsFor: "למי זה מתאים",
    whatWeBuild: "מה אנחנו בונים",
    headlineBefore: "לאנשים שכבר טובים במה שהם עושים אבל",
    headlineAccent: "בלתי נראים",
    headlineAfter: "בווידאו",
    howWeWork: "איך אנחנו עובדים",
    audience: [
      {
        icon: "play",
        title: "יוצרים",
        description: "בונים קהלים שאנשים זוכרים.",
      },
      {
        icon: "graduation",
        title: "מנטורים",
        description: "הופכים מומחיות לסמכות.",
      },
      {
        icon: "crown",
        title: "מותגים",
        description: "יוצרים תוכן שמניע צמיחה אמיתית.",
      },
      {
        icon: "cart",
        title: "מסחר אלקטרוני",
        description: "ממירים תשומת לב ללקוחות.",
      },
    ],
    services: [
      {
        number: "01",
        title: "מערכת YouTube שהופכת צפיות ל",
        titleAccent: "פגישות.",
        icon: "play",
      },
      {
        number: "02",
        title: "סרטי מותג שגורמים לאנשים",
        titleAccent: "להפסיק לגלול.",
        icon: "clapperboard",
      },
      {
        number: "03",
        title: "תוכן קצר שבונה",
        titleAccent: "סמכות על אוטומט.",
        icon: "zap",
      },
      {
        number: "04",
        title: "קמפיינים שנבנים עבור",
        titleAccent: "השקה או הצעה אחת.",
        icon: "target",
      },
    ],
    process: [
      {
        step: "01",
        title: "אבחון",
        icon: "search",
        description: "בהירות על המטרות, הקהל ופערי התוכן שלכם.",
      },
      {
        step: "02",
        title: "בנייה",
        icon: "box",
        description: "תוכנית הפקה שנבנית להשפעה.",
      },
      {
        step: "03",
        title: "הפקה",
        icon: "clapperboard",
        description: "תוכן פרימיום שמתוכנן להתחבר ולהמיר.",
      },
      {
        step: "04",
        title: "אופטימיזציה",
        icon: "chart",
        description: "שיפור לטובת reach, engagement ותוצאות.",
      },
      {
        step: "05",
        title: "סקייל",
        icon: "trending",
        description: "יותר output, אותה איכות, צמיחה מצטברת.",
      },
    ],
  },
  portfolio: {
    eyebrow: "תיק העבודות שלנו",
    titlePrimary: "עבודות",
    titleAccent: "נבחרות",
    allVideos: "כל הסרטונים",
    categoriesAria: "קטגוריות תיק עבודות",
    emptyState: "לא נמצאו סרטונים בקטגוריה זו.",
    untitled: "ללא כותרת",
  },
  testimonials: {
    eyebrow: "המלצות",
    titleLine1: "מה הלקוחות שלנו",
    titleAccent: "אומרים עלינו.",
    starsAria: (count) => `${count} מתוך 5 כוכבים`,
  },
  founders: {
    eyebrow: "הסטודיו / המייסדים",
    titleBefore: "נבנה על ידי מישהו ש",
    titleFilmed: "צילם את זה",
    titleEdited: "ערך את זה",
    titleLived: "וחי את זה",
    titleAfter: "קודם.",
    intro:
      "RIZZ Productions מובילים על ידי מייסדים שעמדו משני צידי המצלמה — ובונים מערכות שמגדילות תוכן בלי לוותר על איכות.",
    values: "פרספקטיבה בינלאומית. | משמעת קריאייטיבית. | תוצאות אמיתיות.",
    trustedBy: "סומכים עלינו מותגים שאפתניים",
    showBio: "הצג ביו",
    hideBio: "הסתר ביו",
    cards: [
      {
        name: "רותם איצקוביץ'",
        role: "מייסד שותף",
        keywords: "אסטרטגיה • צמיחה • מערכות",
        bio: "אחראי על אסטרטגיית תוכן, ארכיטקטורת מערכות הפקה והפיכת מטרות מותג לתוצר תוכן מדיד.",
        variant: "portrait",
        imageKey: "rotem",
      },
      {
        name: "שקד סירואה",
        role: "מייסד שותף",
        keywords: "קריאייטיב • סטוריטelling • נוכחות",
        bio: "פיתוח קונספטים, סטוריטelling ויזואלי והפיכת רעיונות לתוכן שמתחבר לקהלים אמיתיים.",
        variant: "portrait",
        imageKey: "shaked",
      },
      {
        name: "הצוות המורחב שלנו",
        role: "עורכים • מפיקים • סוכני AI",
        badge: "המנוע שמאחורי הכל",
        bio: "צוות גלובלי של קריאייטיבים, עורכים ומומחי AI — שמיישרים קו כדי לספק יותר מתוכן. אנחנו מספקים תוצאות.",
        variant: "team",
      },
    ],
  },
  cta: {
    eyebrow: "בואו נבנה את המערכת שלכם",
    titleLine1: "מוכנים להיראות",
    titleAccent: "בלתי ניתנים לעמידה בווידאו?",
    description:
      "אנחנו עוזרים ליוצרים, יזמים, מותגים ומנטורים להפוך רעיונות למערכות תוכן בעלות impact שמושכות תשומת לב, בונות אמון ומניעות צמיחה מדידה.",
    tagline: "אסטרטגיה · הפקה · הפצה",
    bookCall: "קבעו שיחת אסטרטגיה ←",
    whatsapp: "שלחו לנו הודעה ב-WhatsApp",
  },
  footer: {
    description:
      "תוכן שהופך ללקוחות. אנחנו בונים מערכות וידאו בעלות impact ליוצרים, יזמים, מותגים ומנטורים — עם תוצאות אמיתיות שאפשר למדוד.",
    navigation: "ניווט",
    getStarted: "התחילו כאן",
    getStartedDescription:
      "מוכנים להיראות בלתי ניתנים לעמידה בווידאו? קבעו שיחת אסטרטגיה ונבנה יחד מערכת תוכן לתשומת לב, אמון וצמיחה.",
    copyright: (year) => `© ${year} RIZZ Productions. כל הזכויות שמורות.`,
    tagline: "אסטרטגיה · הפקה · הפצה",
  },
};

export const rizzTranslations: Record<ContentLocale, RizzTranslations> = {
  en,
  he,
};
