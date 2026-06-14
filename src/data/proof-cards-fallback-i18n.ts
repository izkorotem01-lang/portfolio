import type { ContentLocale } from "@/i18n/locale";
import type { ProofCard } from "@/lib/sanitySite";
import { PROOF_CARDS_FALLBACK } from "@/data/proof-cards-fallback";

const PROOF_CARDS_FALLBACK_HE: ProofCard[] = [
  {
    id: "proofCard-noam-firuz-he",
    cardNumber: "01",
    clientName: "Noam Firuz",
    clientRole: "יוצר תוכן",
    headerMedia: PROOF_CARDS_FALLBACK[0].headerMedia,
    titleSegments: [
      { id: "t1", text: "החיינו ערוץ YouTube מת — ", accent: false },
      { id: "t2", text: "50K צפיות ב-10 שעות.", accent: true },
    ],
    checkpoints: [
      "הערוץ היה לא פעיל כשנה לפני עריכת החזרה.",
      "סרטון החזרה חצה 50K צפיות בתוך 10 השעות הראשונות.",
      "התגובות זרמו — הקהל חזר להengage מיד.",
      "מעריצים שאלו מי ערך את הסרטון.",
    ],
    statistics: [
      { id: "s1", value: "50K", label: "צפיות" },
      { id: "s2", value: "10 שע'", label: "עד 50K" },
      { id: "s3", value: "+312%", label: "עלייה במנויים" },
      { id: "s4", value: "8.7%", label: "Engagement" },
    ],
    bottomMedia: [],
    order: 0,
  },
  {
    id: "proofCard-yishai-gabian-he",
    cardNumber: "02",
    clientName: "Yishai Gabian",
    clientRole: "יזם ומנטור",
    headerMedia: PROOF_CARDS_FALLBACK[1].headerMedia,
    titleSegments: [
      { id: "t1", text: "חצי מתקציב הפרסום. ", accent: false },
      { id: "t2", text: "מאות לידים בכל שבוע.", accent: true },
    ],
    checkpoints: [
      "עבדנו יחד יותר מ-6 חודשים על YouTube, רילס וקמפיינים.",
      "תקציב השיווק ירד ב-~50% בזמן שכמות הלידים המשיכה לטפס.",
      "מאות לידים איכותיים בכל שבוע מאורגני + paid.",
    ],
    statistics: [
      { id: "s1", value: "350+", label: "לידים שבועיים" },
      { id: "s2", value: "-50%", label: "תקציב שיווק" },
      { id: "s3", value: "4.3x", label: "עלייה ב-ROI" },
      { id: "s4", value: "-62%", label: "ירידה ב-CPA" },
    ],
    bottomMedia: [],
    order: 1,
  },
  {
    id: "proofCard-shaked-siroa-he",
    cardNumber: "03",
    clientName: "Shaked Siroa",
    clientRole: "יוצר תוכן",
    titleSegments: [
      { id: "t1", text: "יוצר שלקחנו מפוסטים יציבים ל", accent: false },
      { id: "t2", text: "וויראליות חוזרת.", accent: true },
    ],
    checkpoints: [
      "בנינו מערכת רילס שתוכננה לשיתוף, לא רק לעקביות.",
      "מספר סרטונים פרצו — צפיות, שמירות ושיתופים נערמו מהר.",
      "המותג האישי התחיל להיות מזוהה מעבר לקהל הקיים.",
    ],
    statistics: [
      { id: "s1", value: "120+", label: "סרטונים ויראליים" },
      { id: "s2", value: "2.3M+", label: "סה״כ צפיות" },
      { id: "s3", value: "48K", label: "ממוצע לוויראל" },
      { id: "s4", value: "850K+", label: "צפיות בריל המוביל" },
    ],
    bottomMedia: PROOF_CARDS_FALLBACK[2].bottomMedia,
    order: 2,
  },
];

export const getProofCardsFallback = (language: ContentLocale): ProofCard[] =>
  language === "he" ? PROOF_CARDS_FALLBACK_HE : PROOF_CARDS_FALLBACK;
