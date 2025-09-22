import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import showreelVideo from "@/assets/Showreel_3.mp4";

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
    <section id="hero" className="min-h-screen relative overflow-hidden">
      {/* Dynamic Smoky Background */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(20, 20, 20)"
        firstColor="240, 123, 0"
        secondColor="217, 47, 15"
        thirdColor="147, 0, 97"
        fourthColor="32, 0, 155"
        fifthColor="0, 0, 0"
        pointerColor="217, 47, 15"
        size="150%"
        blendingValue="screen"
        interactive={true}
        containerClassName="absolute inset-0"
        className="opacity-80"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/40" />

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Content Section - Left */}
            <div className="text-center lg:text-left">
              {/* Main Title */}
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-up"
                style={{
                  animationDelay: "0.2s",
                  filter: "drop-shadow(0 4px 5px rgba(0, 0, 0, 0.6))",
                }}
              >
                {t("hero.name")}
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl text-foreground/95 mb-8 leading-relaxed animate-fade-up drop-shadow-md"
                style={{ animationDelay: "0.4s" }}
              >
                {t("hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-up"
                style={{ animationDelay: "0.6s" }}
              >
                <Button onClick={scrollToPortfolio} className="btn-hero group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.cta")}
                </Button>

                <Button
                  onClick={scrollToContact}
                  variant="outline"
                  className="btn-glass text-lg px-8 py-4 backdrop-blur-md"
                >
                  {t("contact.title")}
                </Button>
              </div>
            </div>

            {/* Video Section - Right */}
            <div className="flex justify-center lg:justify-end animate-fade-up">
              <div className="relative">
                {/* Phone-style container for vertical video */}
                <div className="glass-card p-4 rounded-3xl max-w-sm mx-auto backdrop-blur-xl bg-black/20 border border-white/10">
                  <video
                    src={showreelVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto rounded-2xl shadow-2xl aspect-[9/16] object-cover"
                  />
                </div>

                {/* Floating elements around video */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/30 rounded-full animate-float backdrop-blur-sm" />
                <div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary-glow/40 rounded-full animate-float backdrop-blur-sm"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
            <ChevronDown className="w-8 h-8 text-primary animate-pulse drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
