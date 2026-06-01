import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Video,
  Sparkles,
  Share2,
  Camera,
  Music,
  Image,
  Zap,
  Target,
  TrendingUp,
  Mic,
} from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/use-scroll-animation";

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Video,
      title: t("services.video"),
      description: "Professional video editing with cutting-edge techniques",
    },
    {
      icon: Sparkles,
      title: t("services.motion"),
      description: "Eye-catching motion graphics and animations",
    },
    {
      icon: Share2,
      title: t("services.social"),
      description: "Optimized content for all social platforms",
    },
    {
      icon: Camera,
      title: t("services.photo"),
      description: "Professional photo editing and retouching",
    },
    {
      icon: Music,
      title: t("services.aiSongs"),
      description: "Create original songs and music using AI technology",
    },
    {
      icon: Image,
      title: t("services.aiContent"),
      description: "Generate stunning images, videos and graphics with AI",
    },
    {
      icon: Zap,
      title: t("services.logos"),
      description: "Professional logo design and brand identity",
    },
    {
      icon: Target,
      title: t("services.aiAdvertising"),
      description: "AI-powered advertising creation and campaigns",
    },
    {
      icon: Mic,
      title: t("services.voiceover"),
      description: "Professional voiceover and narration services",
    },
    {
      icon: TrendingUp,
      title: t("services.digitalPresence"),
      description: "Build your complete digital presence across all platforms",
    },
  ];

  const {
    ref: sectionRef,
    visibleItems,
    isVisible,
  } = useStaggeredAnimation(services.length, 100, { threshold: 0.1 });

  return (
    <section ref={sectionRef} id="services" className="py-24 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div
            className={`text-center mb-16 ${
              isVisible ? "animate-fade-in-up" : ""
            }`}
          >
            <h2 className="section-title">
              {t("services.title")}
            </h2>
          </div>

          {/* Services Grid - Ultra Mobile Optimized */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className={`md:group bg-background/60 md:backdrop-blur-2xl border border-border/30 md:border-white/20 rounded-lg md:rounded-2xl p-2 md:p-4 md:hover:scale-105 cursor-pointer flex flex-col items-center justify-center min-h-[70px] md:min-h-[120px] w-[110px] md:w-[200px] ${
                  visibleItems.includes(index) ? "animate-slide-up-stagger" : ""
                }`}
                style={{
                  backgroundColor: "rgba(13, 19, 31, 0.6)",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Icon */}
                <div className="mb-1 md:mb-3">
                  <div
                    className="w-7 h-7 md:w-12 md:h-12 rounded-md md:rounded-xl bg-brand-cyan/12 border border-brand-cyan/30 p-1.5 md:p-3 flex items-center justify-center"
                  >
                    <service.icon className="w-3.5 h-3.5 md:w-6 md:h-6 text-brand-cyan" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs md:text-lg font-bold text-foreground md:group-hover:text-primary text-center w-full leading-tight">
                  {service.title}
                </h3>

                {/* Hover Effect - Desktop only */}
                <div className="hidden md:block absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-smooth" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
