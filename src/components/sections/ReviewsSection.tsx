import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { toReviewItem } from "@/lib/sanityReviews";

const ReviewsSection = () => {
  const { language } = useLanguage();
  const { homePage, reviews, pick } = useSiteContent();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.08,
    rootMargin: "0px 0px -5% 0px",
  });

  const reviewItems = useMemo(
    () => reviews.map((review) => toReviewItem(review, pick)),
    [reviews, pick]
  );

  const title = pick(homePage?.reviewsSection?.title) ||
    (language === "hb" ? "המלצות" : "Reviews");
  const subtitle =
    pick(homePage?.reviewsSection?.subtitle) ||
    (language === "hb"
      ? "מה הלקוחות שלי אומרים על העבודה שלי"
      : "What my clients say about my work");

  return (
    <section ref={sectionRef} id="reviews" className="relative py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <header className="intro-scroll-showcase-header mx-auto mb-8 md:mb-10">
            <h2
              className={`showcase-productions-title intro-scroll-showcase-title${
                isVisible ? " is-active" : ""
              }`}
            >
              {title}
            </h2>
            <div
              className={`showcase-productions-ticks${
                isVisible ? " intro-ticks-active" : ""
              }`}
              aria-hidden
            />
            <p className="mx-auto mt-5 max-w-2xl text-center text-base font-medium text-foreground/70 md:text-lg">
              {subtitle}
            </p>
          </header>

          <ReviewsCarousel
            variant="section"
            reviews={reviewItems.length > 0 ? reviewItems : undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
