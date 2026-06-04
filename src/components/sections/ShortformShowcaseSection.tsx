import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIntroHighlights } from "@/contexts/IntroHighlightsContext";
import { useStaggeredAnimation } from "@/hooks/use-scroll-animation";
import HighlightVideoCard from "@/components/highlights/HighlightVideoCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";

const CARD_REVEAL_DELAYS = [
  "animate-delay-100",
  "animate-delay-200",
  "animate-delay-300",
  "animate-delay-400",
] as const;

const ShortformShowcaseSection = () => {
  const { t, language } = useLanguage();
  const { videos, isLoading } = useIntroHighlights();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { ref: sectionRef, visibleItems, isVisible } = useStaggeredAnimation(
    videos.length,
    140,
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  useEffect(() => {
    if (videos[0]) setActiveId(videos[0].id);
  }, [videos]);

  if (!isLoading && videos.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="shortform-showcase"
      className="relative z-10 py-12 md:py-16"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <header
            className={`mb-6 md:mb-10 transition-opacity duration-700 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h2 className="showcase-productions-title">
              {t("showcase.title")}
            </h2>
            <div
              className={`showcase-productions-ticks ${isVisible ? "intro-ticks-active" : ""}`}
              aria-hidden
            />
          </header>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={
                    visibleItems.includes(index)
                      ? `animate-scale-in-up ${CARD_REVEAL_DELAYS[index] ?? "animate-delay-400"}`
                      : "opacity-0"
                  }
                >
                  <HighlightVideoCard
                    video={video}
                    language={language}
                    isActive={activeId === video.id}
                    onActivate={() => setActiveId(video.id)}
                    mode="grid"
                  />
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <div
              id="intro-reviews"
              className="intro-reveal intro-reveal--delay-3 intro-reveal--soft mx-auto mt-10 max-w-3xl md:mt-14"
            >
              <ReviewsCarousel variant="section" className="w-full" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShortformShowcaseSection;
