import React from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import {
  Share2,
  Sparkles,
  Target,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const capabilityIconMap: Record<string, LucideIcon> = {
  video: Video,
  sparkles: Sparkles,
  target: Target,
  share: Share2,
};

const AboutSection = () => {
  const { homePage, requirePick } = useSiteContent();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.08,
    rootMargin: "0px 0px -5% 0px",
  });

  const about = homePage?.about;
  const founders = about?.founders?.length
    ? [...about.founders].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : null;

  const capabilities = (about?.capabilities ?? []).map((item) => ({
    icon: capabilityIconMap[item.icon ?? "video"] ?? Video,
    label: requirePick(item.title, `homePage.about.capabilities[${item._key}].title`),
  }));

  const headline = requirePick(about?.headline, "homePage.about.headline");
  const subline = requirePick(about?.subline, "homePage.about.subline");
  const audience = requirePick(about?.audience, "homePage.about.audience");

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-band py-24 md:py-28 relative z-10"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-background/80 backdrop-blur-sm md:backdrop-blur-xl p-6 md:p-12 rounded-2xl md:rounded-3xl border border-border/30 md:border-white/30">
            <header className="intro-scroll-showcase-header mx-auto mb-10">
              <h2
                className={`showcase-productions-title intro-scroll-showcase-title${
                  isVisible ? " is-active" : ""
                }`}
              >
                {requirePick(about?.title, "homePage.about.title")}
              </h2>
              <div
                className={`showcase-productions-ticks${
                  isVisible ? " intro-ticks-active" : ""
                }`}
                aria-hidden
              />
            </header>

            <div
              className={`mx-auto mb-14 max-w-4xl text-center ${
                isVisible ? "animate-fade-in-up animate-delay-100" : ""
              }`}
            >
              <h3 className="text-2xl md:text-4xl font-bold leading-tight text-primary mb-4">
                {headline}
              </h3>
              <p className="text-lg md:text-2xl font-semibold text-foreground/90">
                {subline}
              </p>
            </div>

            <div className="mb-16 flex flex-col gap-16 md:gap-20">
              {(founders ?? []).map((founder, index) => {
                const glow =
                  founder.glowColor ?? (index % 2 === 0 ? "cyan" : "orange");
                const photo = founder.photoUrl;
                if (!photo) {
                  throw new Error(
                    `Missing required founder photoUrl at homePage.about.founders[${founder._key}].photoUrl`
                  );
                }

                return (
                  <div
                    key={founder._key}
                    className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-5 xl:gap-6 ${
                      isVisible
                        ? index === 0
                          ? "animate-fade-in-left animate-delay-200"
                          : "animate-fade-in-right animate-delay-200"
                        : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                        {requirePick(founder.name, `homePage.about.founders[${founder._key}].name`)}
                      </h3>
                      <p className="text-xl md:text-2xl font-semibold text-foreground/90 mb-4">
                        {requirePick(founder.role, `homePage.about.founders[${founder._key}].role`)}
                      </p>
                      <p className="text-xl md:text-2xl leading-relaxed text-foreground/90">
                        {requirePick(founder.bio, `homePage.about.founders[${founder._key}].bio`)}
                      </p>
                    </div>
                    <div className="flex justify-center lg:justify-start">
                      <div
                        className={`about-portrait-neon about-portrait-neon--${glow} w-full max-w-[9.5rem] shrink-0 sm:max-w-[10.5rem] md:max-w-xs`}
                      >
                        <div className="about-portrait-neon__ring">
                          <img
                            src={photo}
                            alt={requirePick(founder.photoAlt, `homePage.about.founders[${founder._key}].photoAlt`)}
                            className="about-portrait-neon__photo aspect-[4/5] max-h-56 w-full object-cover md:max-h-64"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`max-w-4xl mx-auto text-center bg-brand-cyan/8 border border-brand-cyan/20 rounded-2xl p-6 md:p-8 mb-12 ${
                isVisible ? "animate-fade-in-up animate-delay-400" : ""
              }`}
            >
              <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed">
                {audience}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {capabilities.map((capability, index) => (
                <div
                  key={`${capability.label}-${index}`}
                  className={`text-center ${isVisible ? "animate-scale-in-up" : ""}`}
                  style={{ animationDelay: `${0.45 + index * 0.08}s` }}
                >
                  <div className="glass-card p-4 md:p-5 rounded-2xl mb-3 hover:scale-105 transition-smooth h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-brand-cyan/12 border border-brand-cyan/30 flex items-center justify-center">
                      <capability.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-cyan" />
                    </div>
                    <div className="text-sm md:text-base font-semibold text-foreground/90 leading-snug">
                      {capability.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
