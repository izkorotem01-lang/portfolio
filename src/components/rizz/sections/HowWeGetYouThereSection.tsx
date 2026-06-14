import { GradientOrb } from "@/components/rizz/ui/GradientOrb";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import {
  Box,
  ChartNoAxesCombined,
  Clapperboard,
  Crown,
  GraduationCap,
  Play,
  Search,
  ShoppingCart,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { AudienceCard, ProcessStep, ServiceItem } from "@/i18n/rizz-translations";

const AUDIENCE_ICONS: Record<AudienceCard["icon"], LucideIcon> = {
  play: Play,
  graduation: GraduationCap,
  crown: Crown,
  cart: ShoppingCart,
};

const SERVICE_ICONS: Record<ServiceItem["icon"], LucideIcon> = {
  play: Play,
  clapperboard: Clapperboard,
  zap: Zap,
  target: Target,
};

const PROCESS_ICONS: Record<ProcessStep["icon"], LucideIcon> = {
  search: Search,
  box: Box,
  clapperboard: Clapperboard,
  chart: ChartNoAxesCombined,
  trending: TrendingUp,
};

const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 w-full text-center text-[11px] font-bold uppercase tracking-[0.35em] text-[#187BFF]">
    {children}
  </p>
);

const ProcessIconBadge = ({ icon: Icon }: { icon: LucideIcon }) => (
  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#187BFF]/45 bg-[#187BFF]/12 text-[#F5F7FA] shadow-[0_0_24px_rgba(24,123,255,0.3)]">
    <Icon size={22} strokeWidth={1.75} />
  </div>
);

const ProcessStepConnector = () => (
  <div className="flex w-6 shrink-0 justify-center py-1">
    <div
      aria-hidden="true"
      className="h-10 w-px md:h-11"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(24, 123, 255, 0.2) 14%, rgba(24, 123, 255, 1) 42%, rgba(24, 123, 255, 1) 58%, rgba(24, 123, 255, 0.2) 86%, transparent 100%)",
        boxShadow:
          "0 0 6px rgba(24, 123, 255, 0.65), 0 0 14px rgba(24, 123, 255, 0.35)",
      }}
    />
  </div>
);

const LEFT_CONTENT_WIDTH = "w-full max-w-[300px]";
const PROCESS_CONTENT_WIDTH = "w-full max-w-[22rem]";

export const HowWeGetYouThereSection = () => {
  const t = useRizzTranslations();

  return (
    <section
      id="how-we-get-you-there"
      className="relative overflow-hidden bg-[#030712] pt-8 pb-20 md:pt-12 md:pb-28"
    >
      <GradientOrb color="blue" className="-left-32 top-10" size="420px" opacity={0.1} />
      <GradientOrb color="orange" className="-right-24 bottom-0" size="360px" opacity={0.07} />

      <div className="relative w-full px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-3 lg:items-center lg:gap-8 xl:gap-12">
          <div className="order-2 flex flex-col items-center lg:order-none">
            <SectionWrapper delay={0.08} className={`${LEFT_CONTENT_WIDTH} mx-auto`}>
              <ColumnLabel>{t.howWeGetYouThere.whoItsFor}</ColumnLabel>
              <ul className="mb-10 space-y-4 md:mb-12">
                {t.howWeGetYouThere.audience.map((card) => {
                  const Icon = AUDIENCE_ICONS[card.icon];
                  return (
                    <li key={card.title} className="flex gap-3 text-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF6A00]">
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#F5F7FA]">
                          {card.title}
                        </p>
                        <p className="text-sm leading-snug text-[#A7B0C0]">{card.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionWrapper>

            <SectionWrapper delay={0.12} className={`${LEFT_CONTENT_WIDTH} mx-auto`}>
              <ColumnLabel>{t.howWeGetYouThere.whatWeBuild}</ColumnLabel>
              <ul className="space-y-5">
                {t.howWeGetYouThere.services.map((service) => {
                  const Icon = SERVICE_ICONS[service.icon];
                  return (
                    <li key={service.number} className="flex gap-3 text-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#187BFF]/35 bg-[#187BFF]/10 text-[#187BFF]">
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F7A8C]">
                          {service.number}
                        </p>
                        <p className="text-sm font-semibold leading-snug text-[#F5F7FA]">
                          {service.title}{" "}
                          <span className="rizz-title-accent">{service.titleAccent}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </SectionWrapper>
          </div>

          <SectionWrapper
            delay={0.05}
            className="order-1 flex items-center justify-center px-2 text-center lg:order-none lg:self-center"
          >
            <h2
              className="font-semibold uppercase leading-[0.95] text-[#F5F7FA]"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.04em" }}
            >
              {t.howWeGetYouThere.headlineBefore}{" "}
              <span className="rizz-title-accent">{t.howWeGetYouThere.headlineAccent}</span>{" "}
              {t.howWeGetYouThere.headlineAfter}
            </h2>
          </SectionWrapper>

          <div className="order-3 flex flex-col items-center lg:order-none">
            <SectionWrapper delay={0.05} className={`${PROCESS_CONTENT_WIDTH} mx-auto`}>
              <h3
                className="mb-6 w-full text-center font-semibold uppercase leading-[0.95] text-[#F5F7FA] md:mb-8"
                style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", letterSpacing: "-0.03em" }}
              >
                {t.howWeGetYouThere.howWeWork}
              </h3>

              <ol>
                {t.howWeGetYouThere.process.map((step, i) => {
                  const Icon = PROCESS_ICONS[step.icon];
                  const isLast = i === t.howWeGetYouThere.process.length - 1;

                  return (
                    <li key={step.step}>
                      <div className="flex items-start gap-3 text-start">
                        <span className="w-6 shrink-0 pt-3.5 text-sm font-bold text-[#FF6A00] md:text-base">
                          {step.step}
                        </span>
                        <ProcessIconBadge icon={Icon} />
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h4 className="mb-1 text-sm font-bold uppercase tracking-[0.14em] text-[#F5F7FA] md:text-base">
                            {step.title}
                          </h4>
                          <p className="text-sm leading-snug text-[#A7B0C0]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {!isLast && <ProcessStepConnector />}
                    </li>
                  );
                })}
              </ol>
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};
