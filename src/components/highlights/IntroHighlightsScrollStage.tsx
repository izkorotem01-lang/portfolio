import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIntroHighlights } from "@/contexts/IntroHighlightsContext";
import { useIntroHighlightsScrollContext } from "@/contexts/IntroHighlightsScrollContext";
import HeroHighlightsCube from "@/components/highlights/HeroHighlightsCube";
import HighlightVideoCard from "@/components/highlights/HighlightVideoCard";
import { PortfolioVideo } from "@/lib/portfolioService";

function pickFlankVideos(videos: PortfolioVideo[], activeIndex: number) {
  if (videos.length === 0) {
    return { left: null as PortfolioVideo | null, right: null as PortfolioVideo | null };
  }
  if (videos.length === 1) {
    return { left: videos[0], right: videos[0] };
  }
  if (videos.length === 2) {
    return { left: videos[0], right: videos[1] };
  }
  const others = videos.filter((_, index) => index !== activeIndex);
  return {
    left: others[0] ?? videos[0],
    right: others[1] ?? others[0] ?? videos[0],
  };
}

const flankRevealClass = (active: boolean, exiting: boolean) =>
  `${active ? " is-active" : ""}${exiting ? " is-exiting" : ""}`;

const IntroHighlightsScrollStage = () => {
  const { language, t } = useLanguage();
  const { videos, isLoading, activeHeroIndex } = useIntroHighlights();
  const { phases, reveal } = useIntroHighlightsScrollContext();
  const {
    titleActive,
    titleExiting,
    ticksActive,
    ticksExiting,
    titleVisible,
    highlightsReveal,
    inFlowLatched,
    latchedMorph,
  } = reveal;

  const introFlatten = latchedMorph ? latchedMorph.flatten : phases.flatten;
  const introVivid = latchedMorph ? latchedMorph.vivid : phases.vivid;

  const { left: leftVideo, right: rightVideo } = useMemo(
    () => pickFlankVideos(videos, activeHeroIndex),
    [videos, activeHeroIndex]
  );

  return (
    <div
      className={`intro-highlights-scroll-stage hero-highlights--backdrop${
        highlightsReveal ? " is-highlights-reveal" : ""
      }`}
      aria-hidden={!titleVisible}
      style={
        {
          "--intro-p": inFlowLatched ? 1 : phases.progress,
          "--intro-flatten": introFlatten,
          "--intro-vivid": introVivid,
        } as React.CSSProperties
      }
    >
      <div className="intro-highlights-scroll-stage__inner">
        <header className="intro-scroll-showcase-header">
          <h2
            className={`showcase-productions-title intro-scroll-showcase-title${flankRevealClass(titleActive, titleExiting)}`}
          >
            {t("showcase.title")}
          </h2>
          <div
            className={`showcase-productions-ticks intro-scroll-showcase-ticks${flankRevealClass(ticksActive, ticksExiting)}`}
            aria-hidden
          />
        </header>

        <div
          className={`intro-highlights-scroll-stage__body${
            highlightsReveal ? " is-highlights-reveal" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex h-48 w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="intro-scroll-stage-row">
              <div className="intro-scroll-flank-slot intro-scroll-flank-slot--left">
                {leftVideo && (
                  <div
                    className={`intro-scroll-flank intro-scroll-flank--left${flankRevealClass(titleActive, titleExiting)}`}
                  >
                    <HighlightVideoCard
                      video={leftVideo}
                      language={language}
                      isActive={titleActive}
                      onActivate={() => {}}
                      mode="grid"
                      forceMuted
                      fillContainer
                    />
                  </div>
                )}
              </div>

              <div className="intro-scroll-cube-slot">
                <div className="intro-scroll-cube-layer">
                  <div className="hero-highlights-shell hero-highlights-shell--scroll">
                    {videos.length > 0 && (
                      <HeroHighlightsCube
                        videos={videos}
                        activeIndex={activeHeroIndex}
                        flipEnabled
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="intro-scroll-flank-slot intro-scroll-flank-slot--right">
                {rightVideo && (
                  <div
                    className={`intro-scroll-flank intro-scroll-flank--right${flankRevealClass(titleActive, titleExiting)}`}
                  >
                    <HighlightVideoCard
                      video={rightVideo}
                      language={language}
                      isActive={titleActive}
                      onActivate={() => {}}
                      mode="grid"
                      forceMuted
                      fillContainer
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroHighlightsScrollStage;
