import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import trustedByClients from "@/data/trusted-by.json";
import timelapseIcon from "@/assets/client-icons/timelapse.png";
import ilayEditsIcon from "@/assets/client-icons/ilay-edits.png";
import noamFiruzIcon from "@/assets/client-icons/noam-firuz.png";

const iconMap: Record<string, string> = {
  timelapse: timelapseIcon,
  "ilay-edits": ilayEditsIcon,
  "noam-firuz": noamFiruzIcon,
};

type TrustedClient = {
  name: string;
  icon: string;
  url: string | null;
};

const TrustedBySection = () => {
  const { t } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const clients = (trustedByClients as TrustedClient[]).map((client) => ({
    ...client,
    iconSrc: iconMap[client.icon],
  }));

  return (
    <section
      ref={sectionRef}
      id="trusted-by"
      className="py-12 md:py-16 relative z-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-8 ${isVisible ? "animate-fade-in-up" : ""}`}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              {t("trusted.title")}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {clients.map((client, index) => {
              const logoClassName = `group flex items-center justify-center transition-all duration-300 ${
                client.url
                  ? "cursor-pointer hover:-translate-y-1"
                  : "cursor-default"
                } ${isVisible ? "animate-scale-in-up" : ""}`;

              const content = (
                <img
                  src={client.iconSrc}
                  alt={client.name}
                  loading="lazy"
                  className="h-12 md:h-16 w-auto object-contain opacity-80 transition-all duration-300 group-hover:opacity-100"
                />
              );

              if (!client.url) {
                return (
                  <div
                    key={client.name}
                    className={logoClassName}
                    style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                    aria-label={client.name}
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={client.name}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={logoClassName}
                  style={{ animationDelay: `${0.15 + index * 0.1}s` }}
                  aria-label={`${client.name} website`}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
