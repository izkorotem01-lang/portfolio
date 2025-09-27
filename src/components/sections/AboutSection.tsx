import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Award, Video, Zap } from "lucide-react";
import rotemImage from "@/assets/rotem.JPG";

const AboutSection = () => {
  const { t, language } = useLanguage();

  const stats = [
    { icon: Video, number: "500+", label: "Videos Edited" },
    { icon: User, number: "100+", label: "Happy Clients" },
    { icon: Award, number: "3+", label: "Years Experience" },
    { icon: Zap, number: "24/7", label: "Support" },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="glass-card p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                {t("about.title")}
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
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

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
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
              </div>

              {/* Rotem Image */}
              <div className="relative">
                <div className="glass-card p-6 rounded-3xl backdrop-blur-xl bg-black/50 border border-white/20">
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={rotemImage}
                      alt="Rotem Izko - Professional Video Editor"
                      className="w-full h-auto object-cover rounded-2xl shadow-2xl"
                    />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full animate-float" />
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-glow/30 rounded-full animate-float"
                  style={{ animationDelay: "2s" }}
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
