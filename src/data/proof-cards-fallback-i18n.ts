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
      { id: "t1", text: "עריכה אחת הדליקה מחדש ערוץ מת — ", accent: false },
      { id: "t2", text: "46K צפיות, הקהל חזר.", accent: true },
    ],
    checkpoints: [
      "הערוץ היה לא פעיל כשנה לפני עריכת החזרה.",
      "סרטון החזרה הגיע ל-46K צפיות והמשיך לטפס.",
      "התגובות זרמו — הקהל חזר להengage מיד.",
      "מעריצים שאלו מי ערך את הסרטון.",
    ],
    statistics: [
      { id: "s1", value: "46K", label: "צפיות" },
      { id: "s2", value: "+340", label: "מנויים חדשים" },
      { id: "s3", value: "8.7%", label: "Engagement" },
      { id: "s4", value: "שנה", label: "ערוץ לא פעיל" },
    ],
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
      { id: "s4", value: "₪15", label: "עלות לליד" },
    ],
    order: 1,
  },
  {
    id: "proofCard-shaked-siroa-he",
    cardNumber: "03",
    clientName: "Shaked Siroa",
    clientRole: "מייסד שותף · מותג אישי",
    titleSegments: [
      { id: "t1", text: "המותג האישי שלנו — ", accent: false },
      { id: "t2", text: "עשור של תוכן, עכשיו ויראלי.", accent: true },
    ],
    checkpoints: [
      "מייסד שותף עם כמעט עשור של ניסיון ביצירת תוכן.",
      "בנינו עם RIZZ מערכת רילס שהפכה עקביות להגעה ויראלית.",
      "המותג האישי ו-RIZZ Productions גדלים ביחד — אותו מנוע, אותם סטנדרטים.",
      "הקהל גדל דרך תוכן ממותג שעוצר גלילה — לא פוסטים אקראיים.",
    ],
    statistics: [
      { id: "s1", value: "120+", label: "סרטונים ויראליים" },
      { id: "s2", value: "10M+", label: "סה״כ צפיות" },
      { id: "s3", value: "10+", label: "שנות יצירה" },
      { id: "s4", value: "1M+", label: "צפיות בריל המוביל" },
    ],
    order: 2,
  },
];

export const getProofCardsFallback = (language: ContentLocale): ProofCard[] =>
  language === "he" ? PROOF_CARDS_FALLBACK_HE : PROOF_CARDS_FALLBACK;
