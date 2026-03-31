/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "@/hooks/use-location";

type Language = "en" | "he";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isAutoDetected: boolean;
}

const translations = {
  en: {
    // Header
    "nav.about": "About",
    "nav.services": "Services",
    "nav.packages": "Packages",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",

    // Hero Section
    "hero.name": "ROTEM IZKO",
    "hero.subtitle": "PROFESSIONAL VIDEO EDITOR & MOTION GRAPHIC DESIGNER",
    "hero.cta": "View My Work",
    "trusted.title": "Trusted By",
    "trusted.subtitle": "Brands and creators I have helped with sharp, high-converting content.",
    "trusted.visit": "Visit site",
    "trusted.client": "Client partner",

    // About Section
    "about.title": "Who Am I & What I Offer",
    "about.content":
      "I'm a 23-year-old professional video editor specializing in creating immersive content for social media platforms including YouTube, Instagram, TikTok and more. I edit short/long form videos, podcasts, and upgrade each project to the highest level using leading software like Premiere Pro and After Effects. I don't just come to edit a video. I come to help your business grow.",
    "about.leadsImpact":
      "My videos generate hundreds — and even thousands — of leads for businesses.",
    "about.digitalPresence":
      "I build digital presence for everyone - whether you're a small business owner, large corporation, content creator, YouTuber, freelancer, or anyone who needs a strong digital presence on social networks. I'm your go-to solution for all digital presence needs.",

    // Services
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

    // Packages
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

    // Portfolio
    "portfolio.title": "My Work",
    "portfolio.social": "Social Media Content",
    "portfolio.business": "Business Advertisements",
    "portfolio.creator": "Content Creator Collaborations",
    "portfolio.construction": "Construction Industry",
    "portfolio.brand": "Brand Identity Videos",
    "portfolio.podcast": "Podcast Production",

    // Contact
    "contact.title": "Let's Work Together",
    "contact.subtitle": "Ready to take your content to the next level?",
    "contact.email": "contact@rotemizko.com",
    "contact.phone": "+972 54-970-2996",
    "contact.whatsapp": "WhatsApp Consultation",

    // Reviews
    "reviews.title": "What Clients Say",
    "reviews.subtitle":
      "Real feedback from satisfied clients who transformed their content with my help",
    "reviews.cta.title": "Ready to Join Them?",
    "reviews.cta.subtitle":
      "Let's create something amazing together and grow your business",
    "reviews.cta.contact": "Start Your Project",
    "reviews.cta.portfolio": "View My Work",

    // Features
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
    // Header
    "nav.about": "אודות",
    "nav.services": "שירותים",
    "nav.packages": "חבילות",
    "nav.portfolio": "תיק עבודות",
    "nav.contact": "צור קשר",

    // Hero Section
    "hero.name": "רותם איצקוביץ",
    "hero.subtitle": "עורך וידאו מקצועי ומעצב גרפיקה בתנועה",
    "hero.cta": "צפה בעבודות שלי",
    "trusted.title": "סומכים עליי",
    "trusted.subtitle": "מותגים ויוצרים שליוויתי עם תוכן חד, מקצועי וממיר.",
    "trusted.visit": "לאתר",
    "trusted.client": "לקוח פעיל",

    // About Section
    "about.title": "מי אני ומה אני מציע",
    "about.content":
      "אני רותם איצקוביץ, עורך וידאו מקצועי בן 23. מתמחה ביצירת תוכן סוחף לרשתות החברתיות – יוטיוב, אינסטגרם, טיקטוק ועוד. אני עורך סרטונים קצרים וארוכים, פודקאסטים, ומשדרג כל פרויקט לרמה הגבוהה ביותר עם תוכנות מובילות כמו Premiere Pro ו-After Effects. אני לא מגיע רק כדי לערוך סרטון. אני מגיע כדי לעזור לעסק שלך לגדול.",
    "about.leadsImpact": "הסרטונים שאני יוצר מביאים מאות ואלפי לידים לעסקים.",
    "about.digitalPresence":
      "אני בונה נוכחות דיגיטלית לכולם - בין אם אתה בעל עסק קטן, תאגיד גדול, יוצר תוכן, יוטיובר, פרילנסר, או כל מי שצריך נוכחות דיגיטלית חזקה ברשתות החברתיות. אני הכתובת שלך לכל צרכי הנוכחות הדיגיטלית.",

    // Services
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

    // Packages
    "packages.title": "מערכות תוכן",
    "packages.statement": "אני לא מוכר סרטונים — אני בונה מערכת תוכן שמביאה תוצאות",
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

    // Portfolio
    "portfolio.title": "העבודות שלי",
    "portfolio.social": "תוכן לרשתות חברתיות",
    "portfolio.business": "פרסומות עסקיות",
    "portfolio.creator": "שיתופי פעולה עם יוצרי תוכן",
    "portfolio.construction": "תעשיית הבנייה",
    "portfolio.brand": "סרטוני זהות מותגית",
    "portfolio.podcast": "הפקת פודקאסטים",

    // Contact
    "contact.title": "בואו נעבוד יחד",
    "contact.subtitle": "מוכנים לקחת את התוכן שלכם לשלב הבא?",
    "contact.email": "contact@rotemizko.com",
    "contact.phone": "+972 54-970-2996",
    "contact.whatsapp": "יעוץ בוואטסאפ",

    // Reviews
    "reviews.title": "מה הלקוחות אומרים",
    "reviews.subtitle": "משוב אמיתי מלקוחות מרוצים שהפכו את התוכן שלהם בעזרתי",
    "reviews.cta.title": "מוכנים להצטרף אליהם?",
    "reviews.cta.subtitle": "בואו ניצור משהו מדהים יחד ונצמיח את העסק שלכם",
    "reviews.cta.contact": "התחל את הפרויקט שלך",
    "reviews.cta.portfolio": "צפה בעבודות שלי",

    // Features
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
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const locationData = useLocation();

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  const dir = language === "he" ? "rtl" : "ltr";

  // Auto-detect language based on location
  useEffect(() => {
    if (
      !locationData.isLoading &&
      !isAutoDetected &&
      locationData.countryCode
    ) {
      const detectedLanguage: Language =
        locationData.countryCode === "IL" ? "he" : "en";
      setLanguage(detectedLanguage);
      setIsAutoDetected(true);

      // Store the auto-detection preference
      localStorage.setItem("language-auto-detected", "true");
    }
  }, [locationData, isAutoDetected]);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language-preference");
    const wasAutoDetected = localStorage.getItem("language-auto-detected");

    if (savedLanguage && wasAutoDetected) {
      setLanguage(savedLanguage as Language);
      setIsAutoDetected(true);
    }
  }, []);

  // Save language preference when changed manually
  const setLanguageWithPersistence = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language-preference", lang);
    localStorage.setItem("language-auto-detected", "false");
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLanguageWithPersistence,
        t,
        dir,
        isAutoDetected,
      }}
    >
      <div
        dir={dir}
        className={language === "he" ? "font-rubik" : "font-inter"}
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
