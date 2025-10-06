import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const ReviewsSection = () => {
  const { language } = useLanguage();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Multiple reviews content based on language
  const reviewsContent = {
    hebrew: [
      {
        name: "מישל זוויגי",
        company: "שאפו דיגיטל",
        rating: 5,
        text: "כפרילנסר מוכשר בתחומי העיצוב הגרפי, עריכת הווידאו ויצירת הקריאייטיבים עבור חברתנו, שאפו דיגיטל. במסגרת עבודתו, רותם הוא גורם קריטי להצלחת הקמפיינים שלנו. הוא אחראי על מגוון רחב של תוצרים, ביניהם: קריאייטיבים חזקים לפרסומות, עם יכולת יוצאת דופן לייצר מודעות בולטות ואפקטיביות. פרסומות בבינה מלאכותית (AI) ברמה גבוהה מאוד, המשלבות טכנולוגיה מתקדמת עם חשיבה עיצובית. עריכות וידאו מקצועיות ואיכותיות. גרפיקות ופוסטים מגוונים, כולל תוכן ייעודי לחגים ואירועים שונים. שביעות הרצון שלנו מרותם היא מלאה. הוא מקצוען אמיתי שמפגין כישורים יוצאי דופן לצד תכונות אופי חיוניות: מקצועיות ואיכות בלתי מתפשרת, עמידה קפדנית בזמנים, ויכולת עבודה תחת לחץ. אנו ממליצים על רותם לכל חברה או גורם הזקוק לשירותי קריאייטיב, גרפיקה ועריכת וידאו ברמה הגבוהה ביותר.",
      },
      {
        name: "שקד סירואה",
        company: "יוצר תוכן",
        rating: 5,
        text: "אני עובד עם רותם כבר מעל ל-3 שנים, והוא אחד האנשים הכי מקצועיים ואמינים שיצא לי לעבוד איתם. הוא ערך עבורי עשרות סרטונים, כולל חלק מהסרטונים שהכי התפרסמו שלי, ותמיד ידע להביא עריכה ברמה גבוהה שמייצרת תוצאה מושכת וצורחת מקצועיות. הוא לא רק מבצע את מה שמבקשים ממנו, אלא גם חושב מחוץ לקופסה, מביא רעיונות חדשים ומוסיף ערך אמיתי לכל פרויקט. הוא שותף עסקי מצוין: מסודר, אחראי, יוזם ויודע לעבוד גם בצוות וגם עצמאית. מי שמחפש עורך וידאו יצירתי, חד, שיודע לקחת חומר גלם ולהפוך אותו למוצר איכותי ומושך קהל – אני ממליץ עליו בלב שלם.",
      },
    ],
    english: [
      {
        name: "Michel Zvigi",
        company: "Shapo Digital",
        rating: 5,
        text: "As a talented freelancer in the fields of graphic design, video editing, and creative production for our company, Shapo Digital. In the course of his work, Rotem is a critical factor in the success of our campaigns. He is responsible for a wide variety of deliverables, including: Strong creative advertisements, with exceptional ability to produce prominent and effective ads. High-level artificial intelligence (AI) advertisements, combining advanced technology with design thinking. Professional and quality video editing. Diverse graphics and posts, including content dedicated to holidays and various events. Our satisfaction with Rotem is complete. He is a true professional who demonstrates exceptional skills alongside essential character traits: Professionalism and uncompromising quality, strict adherence to deadlines, and ability to work under pressure. We recommend Rotem to any company or entity in need of creative, graphics, and video editing services at the highest level.",
      },
      {
        name: "Shaked Siroa",
        company: "Content Creator",
        rating: 5,
        text: "I've been working with Rotem for over 3 years, and he's one of the most professional and reliable people I've had the pleasure of working with. He has edited dozens of videos for me, including some of my most popular videos, and always knows how to deliver high-level editing that produces attractive and professional results. He doesn't just do what's asked of him, but also thinks outside the box, brings new ideas, and adds real value to every project. He's an excellent business partner: organized, responsible, proactive, and knows how to work both in a team and independently. For anyone looking for a creative, sharp video editor who knows how to take raw material and turn it into a quality product that attracts audiences – I wholeheartedly recommend him.",
      },
    ],
  };

  const reviews =
    language === "he" ? reviewsContent.hebrew : reviewsContent.english;
  const currentReview = reviews[currentReviewIndex];

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 5000); // Switch every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length, isTransitioning]);

  // Reset to first review when language changes
  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [language]);

  const nextReview = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const prevReview = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentReviewIndex(
        (prev) => (prev - 1 + reviews.length) % reviews.length
      );
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleReviewClick = (index: number) => {
    if (isTransitioning || index === currentReviewIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentReviewIndex(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

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
                ? "מה הלקוחות שלי אומרים על העבודה שלי"
                : "What my clients say about my work"}
            </p>
          </div>

          {/* Reviews Carousel */}
          <div className="relative">
            <div className="glass-card p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30 h-[520px] md:h-[550px]">
              <div className="text-center relative h-full flex flex-col">
                {/* Quote Icon */}
                <div className="mb-8 md:mb-6 flex-shrink-0">
                  <Quote className="w-12 h-12 text-primary mx-auto" />
                </div>

                {/* Review Content - Fixed height with scroll */}
                <div
                  className={`flex-1 transition-opacity duration-300 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  } flex flex-col justify-center min-h-0`}
                >
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="max-h-64 md:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                      <p
                        className={`text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 ${
                          language === "he" ? "text-right" : "text-left"
                        }`}
                      >
                        "{currentReview.text}"
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center pt-3 mb-4">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    {/* Reviewer Info */}
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-1">
                        {currentReview.name}
                      </h4>
                      <p className="text-foreground/70">
                        {currentReview.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-4 mt-8 flex-shrink-0">
                  <button
                    onClick={language === "he" ? nextReview : prevReview}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={
                      language === "he" ? "ביקורת הבאה" : "Previous review"
                    }
                  >
                    {language === "he" ? (
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    ) : (
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    )}
                  </button>

                  {/* Review Indicators */}
                  <div className="flex gap-2">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleReviewClick(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentReviewIndex
                            ? "bg-primary"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`${
                          language === "he" ? "ביקורת" : "Review"
                        } ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={language === "he" ? prevReview : nextReview}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={
                      language === "he" ? "ביקורת קודמת" : "Next review"
                    }
                  >
                    {language === "he" ? (
                      <ChevronLeft className="w-5 h-5 text-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-foreground" />
                    )}
                  </button>
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
