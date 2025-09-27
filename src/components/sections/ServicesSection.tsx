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

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Video,
      title: t("services.video"),
      description: "Professional video editing with cutting-edge techniques",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Sparkles,
      title: t("services.motion"),
      description: "Eye-catching motion graphics and animations",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Share2,
      title: t("services.social"),
      description: "Optimized content for all social platforms",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Camera,
      title: t("services.photo"),
      description: "Professional photo editing and retouching",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Music,
      title: t("services.aiSongs"),
      description: "Create original songs and music using AI technology",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Image,
      title: t("services.aiContent"),
      description: "Generate stunning images, videos and graphics with AI",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: t("services.logos"),
      description: "Professional logo design and brand identity",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Target,
      title: t("services.aiAdvertising"),
      description: "AI-powered advertising creation and campaigns",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Mic,
      title: t("services.voiceover"),
      description: "Professional voiceover and narration services",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: TrendingUp,
      title: t("services.digitalPresence"),
      description: "Build your complete digital presence across all platforms",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t("services.title")}
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group animate-fade-up backdrop-blur-2xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  backgroundColor: "rgba(13, 19, 31, 0.8)",
                }}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${service.color} p-4 glow-hover`}
                    >
                      <service.icon className="w-full h-full text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-smooth">
                    {service.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-smooth" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
