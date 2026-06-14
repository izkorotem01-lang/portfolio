/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  contentLocaleToUrlLocale,
  DEFAULT_URL_LOCALE,
  isUrlLocale,
  type ContentLocale,
  type UrlLocale,
  urlLocaleToContentLocale,
} from "@/i18n/locale";

const urlLocaleFromPath = (pathname: string): UrlLocale => {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isUrlLocale(segment) ? segment : DEFAULT_URL_LOCALE;
};

interface LanguageContextType {
  language: ContentLocale;
  urlLocale: UrlLocale;
  setLanguage: (lang: ContentLocale) => void;
  switchUrlLocale: (locale: UrlLocale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

/** Legacy site copy — kept for older section components not on the Rizz page */
const legacyTranslations = {
  en: {
    "nav.about": "About",
    "nav.services": "Services",
    "nav.packages": "Packages",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",
    "hero.name": "ROTEM IZKO",
    "hero.subtitle":
      "A content and creative agency specializing in building digital presence for businesses, content creators, and personal brands.",
    "hero.headline.line1": "ROTEM",
    "hero.headline.line2": "IZK",
    "hero.headline.line2Accent": "O",
    "hero.cta": "View My Work",
    "trusted.title": "Trusted By",
    "trusted.subtitle":
      "Brands and creators I have helped with sharp, high-converting content.",
    "trusted.visit": "Visit site",
    "trusted.client": "Client partner",
    "showcase.title": "HIGHLIGHTS",
    "about.title": "Who Are We",
    "about.rotem.title": "Rotem Itzkovich",
    "about.rotem.role": "Co-founder of RIZZ Productions.",
    "about.rotem.content":
      "Responsible for content strategy, content system development, and production processes. Specializes in building digital presence for businesses, brands, and creators through marketing thinking, viewing psychology, and content that serves business goals.",
    "about.shaked.title": "Shaked Siroa",
    "about.shaked.role": "Co-founder of RIZZ Productions.",
    "about.shaked.content":
      "Content creator and creative specializing in storytelling, concept development, and content creation. Responsible for developing ideas, creative direction, and turning messages into content that connects people to brands.",
    "about.riz.title": "RIZZ Productions",
    "about.riz.content":
      "is a content and creative agency specializing in building digital presence for businesses, content creators, and personal brands. We combine strategy, creative, filming, editing, and marketing thinking to create content that doesn't just look good — but also serves a real business purpose.",
    "about.riz.mission":
      "Our goal is to turn content into an asset that generates authority, attention, and growth over time.",
    "services.title": "What I Do",
    "services.video": "Video Editing",
    "services.motion": "Motion Graphics",
    "services.social": "Social Media Content",
    "services.photo": "Photo Editing",
    "services.aiSongs": "AI Song Creation",
    "services.aiContent": "AI Content Creation",
    "services.logos": "Logo Design",
    "services.aiAdvertising": "AI Advertising Creation",
    "services.voiceover": "Voiceover & Narration",
    "services.digitalPresence": "Digital Presence Building",
    "packages.title": "Content Systems",
    "packages.statement":
      "I don't sell videos — I build content systems that drive results",
    "packages.badge": "Main Package",
    "packages.cta": "Let's Build Your System",
    "packages.core.title": "Content System",
    "packages.core.subtitle": "A monthly content system that delivers results",
    "packages.core.price": "₪6,500 - ₪7,500",
    "packages.growth.title": "Growth System",
    "packages.growth.subtitle":
      "For brands that want to grow and turn content into an engine",
    "packages.growth.price": "₪9,000 - ₪12,000",
    "packages.full.title": "Full Content Engine",
    "packages.full.subtitle":
      "A complete content system for a business that wants real results",
    "packages.full.price": "₪12,000 - ₪15,000",
    "portfolio.title": "Our Work",
    "portfolio.allWork": "All Work",
    "portfolio.social": "Social Media Content",
    "portfolio.business": "Business Advertisements",
    "portfolio.creator": "Content Creator Collaborations",
    "portfolio.construction": "Construction Industry",
    "portfolio.brand": "Brand Identity Videos",
    "portfolio.podcast": "Podcast Production",
    "portfolio.expandVideo": "Large view",
    "contact.title": "Let's Work Together",
    "contact.subtitle": "Ready to take your content to the next level?",
    "contact.email": "contact@rotemizko.com",
    "contact.phone": "+972 54-970-2996",
    "contact.whatsapp": "WhatsApp Consultation",
    "reviews.title": "What Clients Say",
    "reviews.subtitle":
      "Real feedback from satisfied clients who transformed their content with my help",
    "reviews.cta.title": "Ready to Join Them?",
    "reviews.cta.subtitle":
      "Let's create something amazing together and grow your business",
    "reviews.cta.contact": "Start Your Project",
    "reviews.cta.portfolio": "View My Work",
    "feature.core.volume": "12-16 Reels videos",
    "feature.core.audience": "Audience-fit content planning",
    "feature.core.message": "A clear message built for every video",
    "feature.core.premium": "Premium editing (AE + AI)",
    "feature.core.optimization": "Ongoing optimization",
    "feature.core.guidance": "Shooting guidance",
    "feature.core.leads": "Content designed for leads and conversions",
    "feature.growth.volume": "20-30 videos",
    "feature.growth.strategy": "Content strategy development",
    "feature.growth.concepts": "Tailored content concepts",
    "feature.growth.platforms": "Platform-specific adaptation",
    "feature.growth.performance": "Monthly performance improvement",
    "feature.growth.marketing": "Deep marketing thinking",
    "feature.full.everything": "Everything in Growth",
    "feature.full.shootDays": "Shoot days",
    "feature.full.strategy": "Full strategy build",
    "feature.full.guidance": "Personal guidance",
    "feature.full.analysis": "Performance analysis",
    "feature.full.improvement": "Continuous improvement",
  },
  he: {
    "nav.about": "אודות",
    "nav.services": "שירותים",
    "nav.packages": "חבילות",
    "nav.portfolio": "תיק עבודות",
    "nav.contact": "צור קשר",
    "hero.name": "רותם איצקוביץ",
    "hero.subtitle":
      "סוכנות תוכן וקריאייטיב המתמחה בבניית נוכחות דיגיטלית עבור עסקים, יוצרי תוכן ומותגים אישיים.",
    "hero.headline.line1": "רותם",
    "hero.headline.line2": "איצקובי",
    "hero.headline.line2Accent": "ץ",
    "hero.cta": "צפה בעבודות שלי",
    "trusted.title": "סומכים עליי",
    "trusted.subtitle": "מותגים ויוצרים שליוויתי עם תוכן חד, מקצועי וממיר.",
    "trusted.visit": "לאתר",
    "trusted.client": "לקוח פעיל",
    "showcase.title": "HIGHLIGHTS",
    "about.title": "מי אנחנו",
    "about.rotem.title": "על רותם איצקוביץ",
    "about.rotem.role": "מייסד שותף ב־RIZZ Productions.",
    "about.rotem.content":
      "אחראי על אסטרטגיית התוכן, פיתוח מערכות תוכן ותהליכי הפקה. מתמחה בבניית נוכחות דיגיטלית לעסקים, מותגים ויוצרים באמצעות חשיבה שיווקית, פסיכולוגיית צפייה ותוכן שמשרת מטרות עסקיות.",
    "about.shaked.title": "על שקד סירואה",
    "about.shaked.role": "מייסד שותף ב־RIZZ Productions.",
    "about.shaked.content":
      "יוצר תוכן ואיש קריאייטיב המתמחה ב־Storytelling, פיתוח קונספטים ויצירת תוכן. אחראי על פיתוח הרעיונות, הקריאייטיב והפיכת מסרים לתוכן שמחבר אנשים למותגים.",
    "about.riz.title": "RIZZ Productions",
    "about.riz.content":
      "היא סוכנות תוכן וקריאייטיב המתמחה בבניית נוכחות דיגיטלית עבור עסקים, יוצרי תוכן ומותגים אישיים. אנחנו משלבים אסטרטגיה, קריאייטיב, צילום, עריכה וחשיבה שיווקית כדי ליצור תוכן שלא רק נראה טוב — אלא גם משרת מטרה עסקית אמיתית.",
    "about.riz.mission":
      "המטרה שלנו היא להפוך תוכן לנכס שמייצר סמכות, תשומת לב וצמיחה לאורך זמן.",
    "services.title": "מה אני עושה",
    "services.video": "עריכת וידאו",
    "services.motion": "גרפיקה בתנועה",
    "services.social": "תוכן לרשתות חברתיות",
    "services.photo": "עריכת תמונות",
    "services.aiSongs": "יצירת שירים ב-AI",
    "services.aiContent": "יצירת תוכן ב-AI",
    "services.logos": "עיצוב לוגואים",
    "services.aiAdvertising": "יצירת פרסום ב-AI",
    "services.voiceover": "קריינות והקלטה",
    "services.digitalPresence": "בניית נוכחות דיגיטלית",
    "packages.title": "מערכות תוכן",
    "packages.statement":
      "אני לא מוכר סרטונים — אני בונה מערכת תוכן שמביאה תוצאות",
    "packages.badge": "החבילה המרכזית",
    "packages.cta": "בואו נבנה את המערכת שלכם",
    "packages.core.title": "Content System",
    "packages.core.subtitle": "מערכת תוכן חודשית שמביאה תוצאות",
    "packages.core.price": "₪6,500 - ₪7,500",
    "packages.growth.title": "Growth System",
    "packages.growth.subtitle": "למי שרוצה לגדול ולהפוך את התוכן למנוע",
    "packages.growth.price": "₪9,000 - ₪12,000",
    "packages.full.title": "Full Content Engine",
    "packages.full.subtitle": "מערכת תוכן מלאה לעסק שרוצה תוצאות אמיתיות",
    "packages.full.price": "₪12,000 - ₪15,000",
    "portfolio.title": "העבודות שלנו",
    "portfolio.allWork": "כל העבודות",
    "portfolio.social": "תוכן לרשתות חברתיות",
    "portfolio.business": "פרסומות עסקיות",
    "portfolio.creator": "שיתופי פעולה עם יוצרי תוכן",
    "portfolio.construction": "תעשיית הבנייה",
    "portfolio.brand": "סרטוני זהות מותגית",
    "portfolio.podcast": "הפקת פודקאסטים",
    "portfolio.expandVideo": "תצוגה גדולה",
    "contact.title": "בואו נעבוד יחד",
    "contact.subtitle": "מוכנים לקחת את התוכן שלכם לשלב הבא?",
    "contact.email": "contact@rotemizko.com",
    "contact.phone": "+972 54-970-2996",
    "contact.whatsapp": "יעוץ בוואטסאפ",
    "reviews.title": "מה הלקוחות אומרים",
    "reviews.subtitle": "משוב אמיתי מלקוחות מרוצים שהפכו את התוכן שלהם בעזרתי",
    "reviews.cta.title": "מוכנים להצטרף אליהם?",
    "reviews.cta.subtitle": "בואו ניצור משהו מדהים יחד ונצמיח את העסק שלכם",
    "reviews.cta.contact": "התחל את הפרויקט שלך",
    "reviews.cta.portfolio": "צפה בעבודות שלי",
    "feature.core.volume": "12-16 סרטוני רילס",
    "feature.core.audience": "התאמה לקהל יעד",
    "feature.core.message": "בניית מסר לכל סרטון",
    "feature.core.premium": "עריכה פרימיום (AE + AI)",
    "feature.core.optimization": "אופטימיזציה תוך כדי",
    "feature.core.guidance": "ייעוץ לצילום",
    "feature.core.leads": "תוכן שמכוון ללידים והמרות",
    "feature.growth.volume": "20-30 סרטונים",
    "feature.growth.strategy": "בניית אסטרטגיית תוכן",
    "feature.growth.concepts": "קונספטים מותאמים",
    "feature.growth.platforms": "התאמה לפלטפורמות",
    "feature.growth.performance": "שיפור ביצועים חודשי",
    "feature.growth.marketing": "חשיבה שיווקית עמוקה",
    "feature.full.everything": "הכל מ-Growth",
    "feature.full.shootDays": "ימי צילום",
    "feature.full.strategy": "בניית אסטרטגיה מלאה",
    "feature.full.guidance": "ליווי אישי",
    "feature.full.analysis": "ניתוח ביצועים",
    "feature.full.improvement": "שיפור מתמיד",
  },
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlLocale = urlLocaleFromPath(location.pathname);
  const language = urlLocaleToContentLocale(urlLocale);
  const dir = language === "he" ? "rtl" : "ltr";

  const switchUrlLocale = (nextLocale: UrlLocale) => {
    if (nextLocale === urlLocale) return;
    navigate(`/${nextLocale}${location.hash}`, { replace: true });
  };

  const setLanguage = (lang: ContentLocale) => {
    switchUrlLocale(contentLocaleToUrlLocale(lang));
  };

  const t = (key: string): string => {
    const table = legacyTranslations[language];
    return table[key as keyof typeof table] || key;
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const value = useMemo(
    () => ({
      language,
      urlLocale,
      setLanguage,
      switchUrlLocale,
      t,
      dir,
    }),
    [language, urlLocale, dir],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div
        dir={dir}
        className={language === "he" ? "font-assistant min-h-screen" : "font-sans min-h-screen"}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export type { ContentLocale, UrlLocale };
