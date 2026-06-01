import React from "react";
import titleWordmark from "@/assets/title.png";

const HeroBlendHeadline = () => {
  return (
    <div className="hero-headline-stage mb-6 w-full">
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
