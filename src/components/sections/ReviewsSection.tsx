import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Quote } from "lucide-react";

const ReviewsSection = () => {
  const { language } = useLanguage();

  // Single review content based on language
  const reviewContent = {
    hebrew: {
      name: "מישל זוויגי",
      company: "שפו דיגיטל",
      rating: 5,
      text: "כפרילנסר מוכשר בתחומי העיצוב הגרפי, עריכת הווידאו ויצירת הקריאייטיבים עבור חברתנו, שפו דיגיטל. במסגרת עבודתו, רותם הוא גורם קריטי להצלחת הקמפיינים שלנו. הוא אחראי על מגוון רחב של תוצרים, ביניהם: קריאייטיבים חזקים לפרסומות, עם יכולת יוצאת דופן לייצר מודעות בולטות ואפקטיביות. פרסומות בבינה מלאכותית (AI) ברמה גבוהה מאוד, המשלבות טכנולוגיה מתקדמת עם חשיבה עיצובית. עריכות וידאו מקצועיות ואיכותיות. גרפיקות ופוסטים מגוונים, כולל תוכן ייעודי לחגים ואירועים שונים. שביעות הרצון שלנו מרותם היא מלאה. הוא מקצוען אמיתי שמפגין כישורים יוצאי דופן לצד תכונות אופי חיוניות: מקצועיות ואיכות בלתי מתפשרת, עמידה קפדנית בזמנים, ויכולת עבודה תחת לחץ. אנו ממליצים על רותם לכל חברה או גורם הזקוק לשירותי קריאייטיב, גרפיקה ועריכת וידאו ברמה הגבוהה ביותר.",
    },
    english: {
      name: "Michel Zvigi",
      company: "Shapo Digital",
      rating: 5,
      text: "As a talented freelancer in the fields of graphic design, video editing, and creative production for our company, Shapo Digital. In the course of his work, Rotem is a critical factor in the success of our campaigns. He is responsible for a wide variety of deliverables, including: Strong creative advertisements, with exceptional ability to produce prominent and effective ads. High-level artificial intelligence (AI) advertisements, combining advanced technology with design thinking. Professional and quality video editing. Diverse graphics and posts, including content dedicated to holidays and various events. Our satisfaction with Rotem is complete. He is a true professional who demonstrates exceptional skills alongside essential character traits: Professionalism and uncompromising quality, strict adherence to deadlines, and ability to work under pressure. We recommend Rotem to any company or entity in need of creative, graphics, and video editing services at the highest level.",
    },
  };

  const review =
    language === "he" ? reviewContent.hebrew : reviewContent.english;

  return (
    <section id="reviews" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {language === "he" ? "המלצות" : "Reviews"}
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {language === "he"
                ? "מה הלקוחות שלנו אומרים על העבודה שלנו"
                : "What our clients say about our work"}
            </p>
          </div>

          {/* Single Review */}
          <div className="relative">
            <div className="glass-card p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30">
              <div className="text-center">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-primary mx-auto" />
                </div>

                {/* Review Content */}
                <div className="mb-8">
                  <p
                    className={`text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 ${
                      language === "he" ? "text-right" : "text-left"
                    }`}
                  >
                    "{review.text}"
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Reviewer Info */}
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-1">
                      {review.name}
                    </h4>
                    <p className="text-foreground/70">{review.company}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
