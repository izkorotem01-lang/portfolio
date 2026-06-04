import React, { useRef } from "react";
import { IntroHighlightsScrollProvider } from "@/contexts/IntroHighlightsScrollContext";
import {
  useIntroHighlightsScroll,
  useIntroScrollMorphEnabled,
} from "@/hooks/useIntroHighlightsScroll";
import IntroHighlightsScrollStage from "@/components/highlights/IntroHighlightsScrollStage";
import TrustedBySection from "@/components/sections/TrustedBySection";
import HeroSection from "@/components/sections/HeroSection";
import ShortformShowcaseSection from "@/components/sections/ShortformShowcaseSection";

const IntroHighlightsScrollLayout = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const morphEnabled = useIntroScrollMorphEnabled();
  const phases = useIntroHighlightsScroll(sceneRef);
  return (
    <IntroHighlightsScrollProvider
      morphEnabled={morphEnabled}
      phases={phases}
    >
      <div
        className={
          morphEnabled
            ? "intro-highlights-scroll intro-highlights-scroll--morph"
            : "intro-highlights-scroll"
        }
      >
        <TrustedBySection />

        <div ref={sceneRef} className="intro-highlights-scroll__scene">
          {morphEnabled && (
            <div className="intro-highlights-scroll__pin">
              <IntroHighlightsScrollStage />
            </div>
          )}
          <HeroSection />
          {morphEnabled && (
            <div className="intro-highlights-scroll__hold" aria-hidden />
          )}
        </div>

        {morphEnabled && (
          <div className="intro-highlights-scroll__release" aria-hidden />
        )}

        <ShortformShowcaseSection />
      </div>
    </IntroHighlightsScrollProvider>
  );
};

export default IntroHighlightsScrollLayout;
