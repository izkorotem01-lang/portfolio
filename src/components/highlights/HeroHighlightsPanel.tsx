import React from "react";
import { useIntroHighlights } from "@/contexts/IntroHighlightsContext";
import HeroHighlightsCube from "@/components/highlights/HeroHighlightsCube";

/** Dimmed 3D reel layer behind centered hero title + subtitle */
const HeroHighlightsPanel = () => {
  const { videos, isLoading, activeHeroIndex } = useIntroHighlights();

  return (
    <div
      id="hero-highlights"
      className="hero-highlights--backdrop intro-reveal intro-reveal--opacity"
      aria-hidden
    >
      <div className="hero-highlights-shell">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {!isLoading && videos.length > 0 && (
          <HeroHighlightsCube videos={videos} activeIndex={activeHeroIndex} />
        )}
      </div>
    </div>
  );
};

export default HeroHighlightsPanel;
