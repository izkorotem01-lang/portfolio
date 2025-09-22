import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Check, X, Star, Crown, Zap } from "lucide-react";

const PackagesSection = () => {
  const { t } = useLanguage();

  const packages = [
    {
      id: "basic",
      icon: Zap,
      popular: false,
      features: [
        { key: "feature.editing", included: true },
        { key: "feature.music", included: true },
        { key: "feature.sound", included: true },
        { key: "feature.subtitles", included: true },
        { key: "feature.graphics", included: true },
        { key: "feature.platform", included: true },
        { key: "feature.revisions", included: true },
        { key: "feature.noafx", included: false },
        { key: "feature.noai", included: false },
      ],
    },
    {
      id: "premium",
      icon: Crown,
      popular: true,
      features: [
        { key: "feature.editing", included: true },
        { key: "feature.animated", included: true },
        { key: "feature.aftereffects", included: true },
        { key: "feature.brand", included: true },
        { key: "feature.additional", included: true },
        { key: "feature.creative", included: true },
        { key: "feature.ai", included: true },
        { key: "feature.revisions4", included: true },
      ],
    },
    {
      id: "custom",
      icon: Star,
      popular: false,
      features: [
        { key: "feature.planning", included: true },
        { key: "feature.multiple", included: true },
        { key: "feature.identity", included: true },
        { key: "feature.support", included: true },
        { key: "feature.photography", included: true },
        { key: "feature.consultation", included: true },
        { key: "feature.meetings", included: true },
        { key: "feature.exclusive", included: true },
      ],
    },
  ];

  return (
    <section id="packages" className="py-20 relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="glass-card p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                {t("packages.title")}
              </h2>
            </div>

            {/* Packages Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={`package-card relative animate-fade-up ${
                    pkg.popular ? "scale-105 glow" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <pkg.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                      {t(`packages.${pkg.id}.title`)}
                    </h3>

                    <div className="text-3xl font-black text-primary mb-4">
                      {t(`packages.${pkg.id}.price`)}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
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

                  {/* CTA Button */}
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
                    Get Started
                  </Button>

                  {/* Background Glow */}
                  {pkg.popular && (
                    <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-3xl -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
