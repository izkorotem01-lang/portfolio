import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import HeroBlendHeadline from "@/components/HeroBlendHeadline";
import HeroHighlightsPanel from "@/components/highlights/HeroHighlightsPanel";

const HeroSection = () => {
  const { t } = useLanguage();

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
      className="relative z-10 overflow-x-clip overflow-y-visible pt-2 pb-6 md:pt-5 md:pb-8"
    >
      <div className="hero-container">
        <div className="hero-layout hero-layout--stacked">
          <HeroHighlightsPanel />

          <div className="hero-foreground relative z-10 flex w-full flex-col items-center gap-4 text-center">
            <HeroBlendHeadline />

            <p className="hero-subtitle intro-reveal intro-reveal--delay-1 intro-reveal--soft m-0 w-full max-w-2xl px-4 text-center font-semibold leading-snug tracking-wide text-foreground/95">
              {t("hero.subtitle")}
            </p>

            <div className="intro-reveal intro-reveal--delay-2 hidden flex-wrap justify-center gap-3 md:flex">
              <Button onClick={scrollToPortfolio} className="btn-hero group">
                <Play className="transition-transform group-hover:scale-110 ltr:mr-2 rtl:ml-2" />
                {t("hero.cta")}
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                className="btn-glass"
              >
                {t("contact.title")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
