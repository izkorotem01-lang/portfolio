import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import review3Video from "@/assets/reviews/review3_video.mp4";
import review3Thumbnail from "@/assets/reviews/review3_tn.jpeg";

export type ReviewItem = {
  name: string;
  company: string;
  rating: number;
  text: string;
  video?: string;
  thumbnail?: string;
};

/** Time each review stays visible before auto-advance */
const REVIEW_AUTO_ADVANCE_MS = 10_000;

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
    {
      name: "ישי גביאן",
      company: "מלך האטסי",
      rating: 5,
      text: "",
      video: review3Video,
      thumbnail: review3Thumbnail,
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
      text: "I've been working with Rotem for over 8 years, and he's one of the most professional and reliable people I've had the pleasure of working with. He has edited dozens of videos for me, including some of my most popular videos, and always knows how to deliver high-level editing that produces attractive and professional results. He doesn't just do what's asked of him, but also thinks outside the box, brings new ideas, and adds real value to every project. He's an excellent business partner: organized, responsible, proactive, and knows how to work both in a team and independently. For anyone looking for a creative, sharp video editor who knows how to take raw material and turn it into a quality product that attracts audiences – I wholeheartedly recommend him.",
    },
    {
      name: "Yishai Gabian",
      company: "King of Atsi",
      rating: 5,
      text: "I recently had the opportunity to work with Yishai Gabian - the most insane Atsi wizard in the country",
      video: review3Video,
      thumbnail: review3Thumbnail,
    },
  ],
};

type ReviewsCarouselProps = {
  variant?: "hero" | "section";
  className?: string;
};

type ReviewSlideProps = {
  review: ReviewItem;
  isHero: boolean;
  language: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isVideoPlaying?: boolean;
  onToggleVideo?: () => void;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  onVideoEnded?: () => void;
  forMeasure?: boolean;
};

const ReviewSlide = ({
  review,
  isHero,
  language,
  videoRef,
  isVideoPlaying = false,
  onToggleVideo,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
  forMeasure = false,
}: ReviewSlideProps) => {
  const hasVideo = Boolean(review.video && review.thumbnail);

  return (
    <div className="flex flex-col">
      {hasVideo && (
        <div
          className={`flex flex-shrink-0 justify-center ${isHero ? "mb-4" : "mb-8"}`}
        >
          <div
            className={`relative w-full overflow-hidden rounded-2xl border border-brand-cyan/35 shadow-[0_0_28px_hsl(var(--brand-cyan)/0.18)] ${
              isHero ? "max-w-full" : "max-w-xs md:max-w-sm"
            }`}
          >
            {forMeasure || !videoRef ? (
              <img
                src={review.thumbnail}
                alt=""
                className="h-auto w-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={review.video}
                  poster={review.thumbnail}
                  className="h-auto w-full object-contain"
                  controls={isVideoPlaying}
                  onPlay={onVideoPlay}
                  onPause={onVideoPause}
                  onEnded={onVideoEnded}
                />
                {videoRef && !isVideoPlaying && onToggleVideo && (
                  <button
                    type="button"
                    onClick={onToggleVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 hover:bg-black/30"
                    aria-label="Play video"
                  >
                    <div
                      className={`flex items-center justify-center rounded-full bg-brand-orange/85 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-brand-orange ${
                        isHero ? "h-14 w-14" : "h-20 w-20 md:h-24 md:w-24"
                      }`}
                    >
                      <Play
                        className={`text-white ${isHero ? "ml-0.5 h-6 w-6" : "ml-1 h-10 w-10 md:h-12 md:w-12"}`}
                        fill="white"
                      />
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!hasVideo && review.text && (
        <p
          className={`leading-relaxed text-foreground/90 ${
            isHero ? "mb-4 text-sm sm:text-base" : "mb-6 text-lg md:text-xl"
          } ${language === "he" ? "text-right" : "text-left"}`}
        >
          &ldquo;{review.text}&rdquo;
        </p>
      )}

      <div className={`flex flex-col items-center ${hasVideo ? "mt-1" : ""}`}>
        <div className={`flex justify-center ${isHero ? "mb-3" : "mb-5"}`}>
          {[...Array(review.rating)].map((_, i) => (
            <Star
              key={i}
              className={`mx-0.5 fill-current text-yellow-400 ${
                isHero ? "h-4 w-4" : "mx-1 h-6 w-6 md:h-7 md:w-7"
              }`}
            />
          ))}
        </div>
        <div className="text-center">
          <h4
            className={`font-bold text-foreground ${
              isHero ? "mb-1 text-base sm:text-lg" : "mb-2 text-xl md:text-2xl"
            }`}
          >
            {review.name}
          </h4>
          <p
            className={`text-foreground/60 ${
              isHero ? "text-xs sm:text-sm" : "text-base md:text-lg"
            }`}
          >
            {review.company}
          </p>
        </div>
      </div>
    </div>
  );
};

const ReviewsCarousel = ({
  variant = "section",
  className = "",
}: ReviewsCarouselProps) => {
  const { language } = useLanguage();
  const isHero = variant === "hero";
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [measureWidth, setMeasureWidth] = useState<number | null>(null);

  const reviews =
    language === "he" ? reviewsContent.hebrew : reviewsContent.english;
  const currentReview = reviews[currentReviewIndex];

  const measureSlides = useCallback(() => {
    if (cardRef.current) {
      setMeasureWidth(cardRef.current.clientWidth);
    }
    const heights = measureRefs.current.map(
      (el) => el?.getBoundingClientRect().height ?? 0
    );
    const maxHeight = Math.max(...heights, 0);
    if (maxHeight > 0) {
      setViewportHeight(Math.ceil(maxHeight));
    }
  }, []);

  useLayoutEffect(() => {
    measureRefs.current = measureRefs.current.slice(0, reviews.length);
    measureSlides();

    const observer = new ResizeObserver(measureSlides);
    measureRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    if (cardRef.current) observer.observe(cardRef.current);

    window.addEventListener("resize", measureSlides);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureSlides);
    };
  }, [reviews, language, isHero, measureSlides]);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, REVIEW_AUTO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length, isTransitioning]);

  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [language]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, [currentReviewIndex]);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

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
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onFocusCapture={() => setIsAutoPlaying(false)}
      onBlurCapture={() => setIsAutoPlaying(true)}
    >
      <div
        ref={cardRef}
        className={`bg-transparent ${isHero ? "p-0" : "p-8 md:p-12"}`}
      >
        <div className="relative flex flex-col text-center">
          <div
            className="relative w-full"
            style={
              viewportHeight != null ? { height: viewportHeight } : undefined
            }
          >
            {reviews.map((review, index) => {
              const isActive = index === currentReviewIndex;
              return (
                <div
                  key={`slide-${index}`}
                  className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-300 ${
                    isActive && !isTransitioning
                      ? "z-10 opacity-100"
                      : "pointer-events-none z-0 opacity-0"
                  }`}
                  aria-hidden={!isActive}
                >
                  <ReviewSlide
                    review={review}
                    isHero={isHero}
                    language={language}
                    videoRef={isActive ? videoRef : undefined}
                    isVideoPlaying={isActive ? isVideoPlaying : false}
                    onToggleVideo={isActive ? toggleVideo : undefined}
                    onVideoPlay={
                      isActive ? () => setIsVideoPlaying(true) : undefined
                    }
                    onVideoPause={
                      isActive ? () => setIsVideoPlaying(false) : undefined
                    }
                    onVideoEnded={
                      isActive ? () => setIsVideoPlaying(false) : undefined
                    }
                  />
                </div>
              );
            })}
          </div>

          <div
            className={`relative z-20 mt-4 flex items-center justify-center gap-3 ${
              isHero ? "" : "mt-8 gap-4"
            }`}
          >
            <button
              type="button"
              onClick={language === "he" ? nextReview : prevReview}
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              aria-label={language === "he" ? "ביקורת הבאה" : "Previous review"}
            >
              {language === "he" ? (
                <ChevronRight className="h-4 w-4 text-foreground" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-foreground" />
              )}
            </button>

            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleReviewClick(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === currentReviewIndex
                      ? "bg-primary"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`${language === "he" ? "ביקורת" : "Review"} ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={language === "he" ? prevReview : nextReview}
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              aria-label={language === "he" ? "ביקורת קודמת" : "Next review"}
            >
              {language === "he" ? (
                <ChevronLeft className="h-4 w-4 text-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Off-screen measurement — must not affect card layout height */}
      <div
        aria-hidden
        className="reviews-carousel-measure pointer-events-none fixed left-[-100vw] top-0 -z-50 opacity-0"
        style={{ width: measureWidth ?? undefined }}
      >
        {reviews.map((review, index) => (
          <div
            key={`measure-${index}`}
            ref={(el) => {
              measureRefs.current[index] = el;
            }}
            className="w-full"
          >
            <ReviewSlide
              review={review}
              isHero={isHero}
              language={language}
              forMeasure
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsCarousel;
