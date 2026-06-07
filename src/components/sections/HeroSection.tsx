import React, { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { Button } from "@/components/ui/button";
import HeroBlendHeadline from "@/components/HeroBlendHeadline";
import HeroHighlightsPanel from "@/components/highlights/HeroHighlightsPanel";
import { IntroReviewsRail } from "@/components/intro/IntroReviewsRails";
import { useIntroHighlightsScrollContext } from "@/contexts/IntroHighlightsScrollContext";
import { splitMainSectionReviews } from "@/lib/sanityReviews";

const HeroSection = () => {
  const { t } = useLanguage();
  const { homePage, reviews, pick } = useSiteContent();
  const { morphEnabled } = useIntroHighlightsScrollContext();
  const { left, right } = useMemo(
    () => splitMainSectionReviews(reviews),
    [reviews]
  );

  const scrollToPortfolio = () => {
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className={`relative overflow-x-clip overflow-y-visible pb-6 md:pb-8${
        morphEnabled ? " hero--scroll-morph pt-0" : " z-10 pt-2 md:pt-5"
      }`}
    >
      <div className="hero-container">
        <div className="hero-layout hero-layout--stacked">
          {!morphEnabled && <HeroHighlightsPanel />}

          <div className="hero-title-row">
            <IntroReviewsRail side="left" reviews={left} />

            <div className="hero-foreground relative z-10 flex w-full min-w-0 flex-col items-center gap-4 text-center">
              <HeroBlendHeadline />

              <p className="hero-subtitle intro-reveal intro-reveal--delay-1 intro-reveal--soft m-0 w-full max-w-2xl px-4 text-center font-semibold leading-snug tracking-wide text-foreground/95">
                {pick(homePage?.hero?.subtitle) || t("hero.subtitle")}
              </p>

              <div className="intro-reveal intro-reveal--delay-2 hidden flex-wrap justify-center gap-3 md:flex">
                <Button
                  onClick={scrollToPortfolio}
                  className="btn-glory btn-glory-orange"
                >
                  {pick(homePage?.hero?.cta) || t("hero.cta")}
                </Button>
                <Button
                  onClick={scrollToContact}
                  className="btn-glory btn-glory-cyan"
                >
                  {pick(homePage?.contactSection?.title) || t("contact.title")}
                </Button>
              </div>
            </div>

            <IntroReviewsRail side="right" reviews={right} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
