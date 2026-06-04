import React, { useRef } from "react";
import { IntroHighlightsScrollProvider } from "@/contexts/IntroHighlightsScrollContext";
import {
  useIntroHighlightsScroll,
  useIntroScrollMorphEnabled,
} from "@/hooks/useIntroHighlightsScroll";
import { useIntroHighlightsReveal } from "@/hooks/useIntroHighlightsReveal";
import IntroHighlightsScrollStage from "@/components/highlights/IntroHighlightsScrollStage";
import TrustedBySection from "@/components/sections/TrustedBySection";
import HeroSection from "@/components/sections/HeroSection";
import ShortformShowcaseSection from "@/components/sections/ShortformShowcaseSection";

const IntroHighlightsScrollLayout = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const morphEnabled = useIntroScrollMorphEnabled();
  const phases = useIntroHighlightsScroll(sceneRef);
  const reveal = useIntroHighlightsReveal(phases, sceneRef);
  const highlightsInFlow = morphEnabled && reveal.inFlowLatched;

  return (
    <IntroHighlightsScrollProvider
      morphEnabled={morphEnabled}
      phases={phases}
      reveal={reveal}
    >
      <div
        className={
          morphEnabled
            ? "intro-highlights-scroll intro-highlights-scroll--morph"
            : "intro-highlights-scroll"
        }
      >
        <TrustedBySection />

        <div
          ref={sceneRef}
          className={
            highlightsInFlow
              ? "intro-highlights-scroll__scene intro-highlights-scroll__scene--in-flow"
              : "intro-highlights-scroll__scene"
          }
        >
          {morphEnabled && (
            <div className="intro-highlights-scroll__pin">
              <IntroHighlightsScrollStage />
            </div>
          )}
          <HeroSection />
          {morphEnabled && !highlightsInFlow && (
            <div className="intro-highlights-scroll__hold" aria-hidden />
          )}
        </div>

        {morphEnabled && !highlightsInFlow && (
          <div className="intro-highlights-scroll__release" aria-hidden />
        )}

        <ShortformShowcaseSection />
      </div>
    </IntroHighlightsScrollProvider>
  );
};

export default IntroHighlightsScrollLayout;
