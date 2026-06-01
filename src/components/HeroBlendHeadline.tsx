import React from "react";

type HeroBlendHeadlineProps = {
  line1: string;
  line2: string;
  line2Accent: string;
};

const HeroBlendHeadline = ({
  line1,
  line2,
  line2Accent,
}: HeroBlendHeadlineProps) => {
  return (
    <div className="hero-headline-stage mb-6">
      <h1 className="hero-headline-text font-black uppercase tracking-tight">
        <span className="hero-headline-line hero-headline-line--first">
          <span className="hero-headline-line-text relative z-[1]">
            {line1}
          </span>
          <div
            className="hero-blend-box hero-blend-box--small"
            aria-hidden
          />
        </span>
        <span className="hero-headline-line hero-headline-line--second">
          <span className="hero-headline-line-text relative z-[1]">
            {line2}
            {line2Accent}
          </span>
          <div
            className="hero-blend-box hero-blend-box--large"
            aria-hidden
          >
            <span className="hero-blend-handle hero-blend-handle-tl" />
            <span className="hero-blend-handle hero-blend-handle-tr" />
            <span className="hero-blend-handle hero-blend-handle-bl" />
            <span className="hero-blend-handle hero-blend-handle-br" />
            <span className="hero-blend-handle hero-blend-handle-t" />
            <span className="hero-blend-handle hero-blend-handle-b" />
            <span className="hero-blend-handle hero-blend-handle-l" />
            <span className="hero-blend-handle hero-blend-handle-r" />
          </div>
        </span>
      </h1>
    </div>
  );
};

export default HeroBlendHeadline;
