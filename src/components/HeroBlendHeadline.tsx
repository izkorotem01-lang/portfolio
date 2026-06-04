import React from "react";
import titleWordmark from "@/assets/title.png";

const HeroBlendHeadline = () => {
  return (
    <div className="hero-headline-stage intro-reveal intro-reveal--scale mb-3 w-full md:mb-4">
      <h1 className="hero-headline-wordmark m-0 w-full">
        <img
          src={titleWordmark}
          alt="Rotem Izko"
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
