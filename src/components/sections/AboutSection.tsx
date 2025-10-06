import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Award, Video, Zap } from "lucide-react";
import rotemImage from "@/assets/rotem.webp";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const AboutSection = () => {
  const { t, language } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const stats = [
    {
      icon: Video,
      number: "100+",
      label: language === "he" ? "סרטונים" : "Videos Edited",
    },
    {
      icon: User,
      number: "20+",
      label: language === "he" ? "לקוחות מרוצים" : "Happy Clients",
    },
    {
      icon: Award,
      number: "2+",
      label: language === "he" ? "שנות ניסיון" : "Years Experience",
    },
    { icon: Zap, number: "24/7", label: "Support" },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 relative overflow-hidden z-10"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container - Mobile Optimized */}
          <div className="bg-background/80 backdrop-blur-sm md:backdrop-blur-xl p-6 md:p-12 rounded-2xl md:rounded-3xl border border-border/30 md:border-white/30">
            {/* Section Title */}
            <div
              className={`text-center mb-16 ${
                isVisible ? "animate-fade-in-up" : ""
              }`}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                {language === "he" ? (
                  <>
                    <div>מי אני</div>
                    <div className="mt-2">מה אני מציע</div>
                  </>
                ) : (
                  <>
                    <div>Who Am I</div>
                    <div className="mt-2">What I Offer</div>
                  </>
                )}
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div
                className={`${
                  isVisible ? "animate-fade-in-left animate-delay-200" : ""
                }`}
              >
                <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                  {t("about.content")}
                </p>

                {/* Digital Presence Highlight */}
                <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border border-primary/20 rounded-2xl p-6 mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {language === "he" ? "המטרה שלי" : "My Mission"}
                  </h3>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    {t("about.digitalPresence")}
                  </p>
                </div>

                {/* Stats Grid - Hidden on mobile for performance */}
                <div className="hidden md:grid grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`text-center ${
                        isVisible ? "animate-scale-in-up" : ""
                      }`}
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="glass-card p-4 rounded-2xl mb-3 hover:scale-105 transition-smooth">
                        <stat.icon className="w-8 h-8 mx-auto text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-foreground/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Stats - 2x2 grid, smaller text */}
                <div className="md:hidden grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      100+
                    </div>
                    <div className="text-xs text-foreground/70">
                      Videos Edited
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      20+
                    </div>
                    <div className="text-xs text-foreground/70">
                      Happy Clients
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      2+
                    </div>
                    <div className="text-xs text-foreground/70">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      24/7
                    </div>
                    <div className="text-xs text-foreground/70">Support</div>
                  </div>
                </div>
              </div>

              {/* Rotem Image - Mobile Optimized */}
              <div
                className={`relative ${
                  isVisible ? "animate-fade-in-right animate-delay-400" : ""
                }`}
              >
                <div className="bg-background/40 md:bg-background/60 p-3 md:p-6 rounded-xl md:rounded-3xl border border-border/10 md:border-white/20">
                  <div className="rounded-lg md:rounded-2xl overflow-hidden">
                    <img
                      src={rotemImage}
                      alt="Rotem Izko - Professional Video Editor"
                      className="w-full h-auto object-cover rounded-lg md:rounded-2xl shadow-md md:shadow-2xl"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Floating Elements - Hidden on mobile for performance */}
                <div
                  className={`hidden md:block absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full animate-float ${
                    isVisible ? "animate-scale-in-up" : ""
                  }`}
                  style={{ animationDelay: "0.8s" }}
                />
                <div
                  className={`hidden md:block absolute -bottom-4 -left-4 w-16 h-16 bg-primary-glow/30 rounded-full animate-float ${
                    isVisible ? "animate-scale-in-up" : ""
                  }`}
                  style={{ animationDelay: "1.0s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
