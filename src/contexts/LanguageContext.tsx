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

    // About Section
    "about.title": "Who Am I & What I Offer",
    "about.content":
      "I'm a 23-year-old professional video editor specializing in creating immersive content for social media platforms including YouTube, Instagram, TikTok and more. I edit short/long form videos, podcasts, and upgrade each project to the highest level using leading software like Premiere Pro and After Effects. I don't just come to edit a video. I come to help your business grow.",
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
    "packages.title": "Choose Your Package",
    "packages.basic.title": "BASIC - Video for Business, No Headaches",
    "packages.basic.price": "₪250-₪400",
    "packages.premium.title": "PREMIUM - Complete Production in Your Hands",
    "packages.premium.price": "₪400-₪550",
    "packages.custom.title": "CUSTOM - Complete Solution",
    "packages.custom.price": "Custom Pricing",

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
    "contact.email": "izkorotem01@gmail.com",
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
    "feature.editing": "Video editing up to 3 minutes",
    "feature.music": "Copyright-free music",
    "feature.sound": "Quality sound",
    "feature.subtitles": "Basic subtitles",
    "feature.graphics": "General graphics (posts, banners, basic logo)",
    "feature.platform": "Platform optimization (Reels, Stories, YouTube)",
    "feature.revisions": "Up to 2 revision rounds",
    "feature.noafx": "❌ No After Effects",
    "feature.noai": "❌ No AI tools",
    "feature.animated": "Animated subtitles",
    "feature.aftereffects": "After Effects (intros, transitions, animations)",
    "feature.brand": "Brand integration (logo/brand colors/elements)",
    "feature.additional": "Additional 1-minute video (teaser, intro, ad)",
    "feature.creative": "Advanced creative concept",
    "feature.ai": "AI tools integration",
    "feature.revisions4": "Up to 4 revision rounds",
    "feature.planning": "Monthly content planning",
    "feature.multiple": "Multiple monthly videos",
    "feature.identity": "Complete brand identity",
    "feature.support": "Ongoing creative support",
    "feature.photography": "Photography services",
    "feature.consultation": "Marketing consultation",
    "feature.meetings": "Monthly strategy meetings",
    "feature.exclusive": "Exclusive creator support",
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

    // About Section
    "about.title": "מי אני ומה אני מציע",
    "about.content":
      "אני רותם איצקוביץ, עורך וידאו מקצועי בן 23. מתמחה ביצירת תוכן סוחף לרשתות החברתיות – יוטיוב, אינסטגרם, טיקטוק ועוד. אני עורך סרטונים קצרים וארוכים, פודקאסטים, ומשדרג כל פרויקט לרמה הגבוהה ביותר עם תוכנות מובילות כמו Premiere Pro ו-After Effects. אני לא מגיע רק כדי לערוך סרטון. אני מגיע כדי לעזור לעסק שלך לגדול.",
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
    "packages.title": "בחר את החבילה שלך",
    "packages.basic.title": "BASIC - וידאו לעסק, בלי כאב ראש",
    "packages.basic.price": "₪250-₪400",
    "packages.premium.title": "PREMIUM - הפקה שלמה בידיים שלך",
    "packages.premium.price": "₪400-₪550",
    "packages.custom.title": "CUSTOM - פתרון חודשי מלא לעסק",
    "packages.custom.price": "תמחור בהתאמה אישית",

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
    "contact.email": "izkorotem01@gmail.com",
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
    "feature.editing": "עריכת סרטון באורך של עד 3 דקות",
    "feature.music": "מוזיקה ללא קופירייט",
    "feature.sound": "סאונד איכותי",
    "feature.subtitles": "כתוביות בסיסיות",
    "feature.graphics": "גרפיקות כלליות (פוסטים, באנרים, לוגו בסיסי)",
    "feature.platform": "התאמה לפלטפורמות שונות",
    "feature.revisions": "עד 2 סבבי תיקונים",
    "feature.noafx": "❌ ללא After Effects",
    "feature.noai": "❌ ללא כלי AI",
    "feature.animated": "כתוביות מונפשות",
    "feature.aftereffects": "אפטר אפקטס (פתיחים, מעברים, אנימציות)",
    "feature.brand": "מותג אישי – שילוב לוגו/צבעי מותג",
    "feature.additional": "סרטון נוסף עד דקה",
    "feature.creative": "קריאייטיב מתקדם",
    "feature.ai": "שימוש בכלי AI",
    "feature.revisions4": "עד 4 סבבי תיקונים",
    "feature.planning": "בניית תכנית חודשית של תוכן ווידאו",
    "feature.multiple": "מספר סרטונים חודשי משתנה",
    "feature.identity": "זהות מותגית מלאה",
    "feature.support": "ליווי שוטף וקריאייטיב חודשי",
    "feature.photography": "שירותי צילום",
    "feature.consultation": "ייעוץ שיווקי",
    "feature.meetings": "פגישת תכנון חודשית",
    "feature.exclusive": "ליווי יוצר תוכן מומחה",
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
        locationData.countryCode === "IL" ? "en" : "en"; // "he" : "en";
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
