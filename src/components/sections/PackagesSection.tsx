import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const PackagesSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const packages = [
    {
      id: "core",
      icon: Zap,
      popular: true,
      features: [
        { key: "feature.core.volume", included: true },
        { key: "feature.core.audience", included: true },
        { key: "feature.core.message", included: true },
        { key: "feature.core.premium", included: true },
        { key: "feature.core.optimization", included: true },
        { key: "feature.core.guidance", included: true },
        { key: "feature.core.leads", included: true },
      ],
    },
    {
      id: "growth",
      icon: Crown,
      popular: false,
      features: [
        { key: "feature.growth.volume", included: true },
        { key: "feature.growth.strategy", included: true },
        { key: "feature.growth.concepts", included: true },
        { key: "feature.growth.platforms", included: true },
        { key: "feature.growth.performance", included: true },
        { key: "feature.growth.marketing", included: true },
      ],
    },
    {
      id: "full",
      icon: Star,
      popular: false,
      features: [
        { key: "feature.full.everything", included: true },
        { key: "feature.full.shootDays", included: true },
        { key: "feature.full.strategy", included: true },
        { key: "feature.full.guidance", included: true },
        { key: "feature.full.analysis", included: true },
        { key: "feature.full.improvement", included: true },
      ],
    },
  ];

  // Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "0px 0px -100px 0px", // Start animation slightly before fully in view
      }
    );

    const node = sectionRef.current;

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="py-20 relative overflow-hidden z-10"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="glass-card p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                {t("packages.title")}
              </h2>
              <p className="max-w-3xl mx-auto text-lg md:text-2xl font-semibold text-foreground/90 leading-relaxed">
                {t("packages.statement")}
              </p>
            </div>

            {/* Packages Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => {
                // Calculate transforms based on visibility and device type
                let transform = "";
                let opacity = "";
                let zIndex = "";

                if (isMobile) {
                  // Mobile: no animation, show cards immediately
                  transform = "translateY(0)";
                  opacity = "1";
                  zIndex = "10";
                } else {
                  // Desktop animation: complex fan-out effect
                  if (isVisible) {
                    // Final positions when visible
                    if (index === 0) {
                      // Left card - move left
                      transform = "translateX(-30px) scale(1)";
                      opacity = "1";
                      zIndex = "10";
                    } else if (index === 1) {
                      // Center card - stay in center but scale up
                      transform = "translateX(0) scale(1.05)";
                      opacity = "1";
                      zIndex = "20"; // Higher z-index to stay on top
                    } else if (index === 2) {
                      // Right card - move right
                      transform = "translateX(30px) scale(1)";
                      opacity = "1";
                      zIndex = "10";
                    }
                  } else {
                    // Initial state - all cards start from center behind each other
                    transform = "translateX(0) scale(0.8)";
                    opacity = index === 1 ? "1" : "0"; // Only center card visible initially
                    zIndex = index === 1 ? "20" : "5"; // Center card on top initially
                  }
                }

                return (
                  <div
                    key={pkg.id}
                    className={`package-card relative flex flex-col h-full transition-all duration-1000 ease-out ${
                      pkg.popular ? "glow" : ""
                    }`}
                    style={{
                      transform: transform,
                      opacity: opacity,
                      zIndex: zIndex,
                      transitionDelay: isMobile
                        ? "0ms" // No delay on mobile
                        : index === 1
                        ? "0ms"
                        : `${300 + (index === 0 ? 0 : 200)}ms`, // Center first, then others for desktop
                    }}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                          {t("packages.badge")}
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
                        <pkg.icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="mb-2">
                        <h3 className="text-2xl font-bold text-foreground leading-tight">
                          {t(`packages.${pkg.id}.title`)}
                        </h3>
                        <div className="text-sm text-foreground/80 mt-1 leading-snug">
                          {t(`packages.${pkg.id}.subtitle`)}
                        </div>
                      </div>

                      <div className="text-3xl font-black text-primary mb-4">
                        {t(`packages.${pkg.id}.price`)}
                      </div>
                    </div>

                    {/* Features - This will grow to fill available space */}
                    <div className="flex-1 space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-foreground"
                                : "text-foreground/50"
                            }`}
                          >
                            {t(feature.key)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button - This will stick to the bottom */}
                    <Button
                      className={`w-full ${
                        pkg.popular ? "btn-hero" : "btn-glass"
                      }`}
                      onClick={() =>
                        document
                          .querySelector("#contact")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      {t("packages.cta")}
                    </Button>

                    {/* Background Glow */}
                    {pkg.popular && (
                      <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl -z-10" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
