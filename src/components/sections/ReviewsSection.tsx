import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ReviewsCarousel from "@/components/ReviewsCarousel";

const ReviewsSection = () => {
  const { language } = useLanguage();

  return (
    <section id="reviews" className="relative py-24 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="section-title">
              {language === "he" ? "המלצות" : "Reviews"}
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-foreground/70">
              {language === "he"
                ? "מה הלקוחות שלי אומרים על העבודה שלי"
                : "What my clients say about my work"}
            </p>
          </div>

          <ReviewsCarousel variant="section" />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
