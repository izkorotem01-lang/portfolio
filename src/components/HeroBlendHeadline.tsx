import React from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import titleWordmarkFallback from "@/assets/title.png";

const HeroBlendHeadline = () => {
  const { homePage, pick } = useSiteContent();
  const wordmarkSrc = homePage?.hero?.wordmarkUrl || titleWordmarkFallback;
  const wordmarkAlt = pick(homePage?.hero?.wordmarkAlt) || "RIZ Productions";

  return (
    <div className="hero-headline-stage intro-reveal intro-reveal--scale mb-3 w-full md:mb-4">
      <h1 className="hero-headline-wordmark m-0 w-full">
        <img
          src={wordmarkSrc}
          alt={wordmarkAlt}
          className="hero-title-image"
          width={960}
          height={320}
          decoding="async"
          fetchPriority="high"
        />
      </h1>
    </div>
  );
};

export default HeroBlendHeadline;
