import { GradientOrb } from "@/components/rizz/ui/GradientOrb";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { SERVICE_BUILD_IMAGES } from "@/data/service-build-images";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  Box,
  ChartNoAxesCombined,
  Clapperboard,
  Play,
  Search,
  Target,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_STAGGER = 0.38;
const SERVICE_STAGGER = 0.22;
const STEP_SPRING = { type: "spring" as const, stiffness: 240, damping: 20, mass: 1 };
const ICON_CENTER_TOP = "2rem";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  play: Play,
  clapperboard: Clapperboard,
  zap: Zap,
  target: Target,
};

const PROCESS_ICONS: Record<string, LucideIcon> = {
  search: Search,
  box: Box,
  clapperboard: Clapperboard,
  chart: ChartNoAxesCombined,
  trending: TrendingUp,
};

const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 w-full text-center text-[10px] font-semibold uppercase tracking-[0.45em] text-[#38bdf8] md:text-xs">
    {children}
  </p>
);

const ProofColumnNeonDivider = () => (
  <div
    className="proof-column-neon-divider how-we-connector-track how-we-connector-track--shining mb-7 md:mb-8"
    aria-hidden
  />
);

const ServiceCard = ({
  service,
  index,
  animate,
}: {
  service: {
    number?: string;
    title?: unknown;
    titleAccent?: unknown;
    icon?: string;
  };
  index: number;
  animate: boolean;
}) => {
  const { requirePick } = useSiteContent();
  const Icon = SERVICE_ICONS[service.icon ?? "play"] ?? Play;
  const cardDelay = index * SERVICE_STAGGER;
  const imageSrc = service.number ? SERVICE_BUILD_IMAGES[service.number] : undefined;

  return (
    <motion.div
      className="proof-column-item overflow-hidden p-0"
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={
        animate
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.94 }
      }
      transition={{ ...STEP_SPRING, delay: cardDelay }}
    >
      {imageSrc && (
        <motion.div
          className="relative h-28 w-full overflow-hidden md:h-32"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={
            animate
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 1.08 }
          }
          transition={{
            duration: 0.75,
            delay: cardDelay + 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/35 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-transparent to-transparent" />
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-3 p-4 text-center md:p-5">
        <div className="flex items-center gap-2">
          <motion.span
            className="proof-column-service-number"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              animate
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 16,
              delay: cardDelay + 0.12,
            }}
          >
            {service.number}
          </motion.span>
          <motion.div
            className="proof-column-item-icon proof-column-item-icon--service relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              animate
                ? { scale: 1, opacity: 1 }
                : { scale: 0.5, opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 16,
              delay: cardDelay + 0.16,
            }}
          >
            <Icon size={16} strokeWidth={2.25} />
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-[0.625rem] border border-[#38bdf8]/35"
              initial={{ opacity: 0, scale: 1 }}
              animate={
                animate
                  ? { opacity: [0, 0.8, 0], scale: [1, 1.35, 1.5] }
                  : { opacity: 0, scale: 1 }
              }
              transition={{ duration: 0.95, delay: cardDelay + 0.22, ease: "easeOut" }}
              aria-hidden
            />
          </motion.div>
        </div>
        <motion.p
          className="text-sm font-medium leading-snug text-[#F5F7FA] md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: cardDelay + 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {requirePick(service.title as any, `rizzPage.howWeGetYouThere.columns.services[${service.number}].title`)}{" "}
          <span className="rizz-title-accent">
            {requirePick(
              service.titleAccent as any,
              `rizzPage.howWeGetYouThere.columns.services[${service.number}].titleAccent`,
            )}
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export const WhatWeBuildPanel = ({
  services,
  label,
}: {
  services: Array<{ number?: string; title?: unknown; titleAccent?: unknown; icon?: string }>;
  label: string;
}) => {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(listRef, { once: true, margin: "-40px" });
  const animate = reduceMotion || isInView;

  return (
    <div className="w-full">
      <ProofColumnNeonDivider />
      <div className="proof-column-panel p-4 md:p-5">
        <ColumnLabel>{label}</ColumnLabel>
        <div
          ref={listRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} animate={animate} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProcessConnector = ({
  index,
  animate,
  isRtl,
}: {
  index: number;
  animate: boolean;
  isRtl: boolean;
}) => {
  const lineDelay = index * STEP_STAGGER + 0.45;

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-0 hidden lg:block",
        isRtl ? "right-1/2" : "left-1/2",
      )}
      style={{ top: `calc(${ICON_CENTER_TOP} - 1.5px)`, width: "calc(100% + 1rem)" }}
      aria-hidden
    >
      <motion.div
        className="h-[3px] w-full"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={animate ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.9, delay: lineDelay, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.35, delay: lineDelay },
        }}
        style={{
          transformOrigin: isRtl ? "right center" : "left center",
        }}
      >
        <div
          className={cn(
            "how-we-connector-track relative h-full w-full",
            animate && "how-we-connector-track--shining",
            isRtl && "how-we-connector-track--rtl",
          )}
          style={{ ["--shine-delay" as string]: `${lineDelay + 0.9}s` }}
        >
          <motion.span
            className="how-we-connector-dot absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            initial={{ opacity: 0, ...(isRtl ? { right: "0%" } : { left: "0%" }) }}
            animate={
              animate
                ? {
                    opacity: [0, 1, 1, 0],
                    ...(isRtl ? { right: "100%" } : { left: "100%" }),
                  }
                : { opacity: 0, ...(isRtl ? { right: "0%" } : { left: "0%" }) }
            }
            transition={{
              duration: 0.85,
              delay: lineDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

const ProcessStepCard = ({
  step,
  index,
  isLast,
  animate,
  isRtl,
}: {
  step: { step?: string; title?: unknown; icon?: string; description?: unknown };
  index: number;
  isLast: boolean;
  animate: boolean;
  isRtl: boolean;
}) => {
  const { requirePick } = useSiteContent();
  const Icon = PROCESS_ICONS[step.icon ?? "search"] ?? Search;
  const stepDelay = index * STEP_STAGGER;

  return (
    <motion.li
      className={cn(
        "relative isolate flex min-w-0 flex-1 flex-col items-center text-center",
        isLast && "col-span-2 sm:col-span-1",
      )}
      initial={{ opacity: 0, y: 56, scale: 0.94 }}
      animate={
        animate
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 56, scale: 0.94 }
      }
      transition={{ ...STEP_SPRING, delay: stepDelay }}
    >
      {!isLast && <ProcessConnector index={index} animate={animate} isRtl={isRtl} />}

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <motion.div
          className="relative z-20 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#187BFF]/45 bg-[#030712] text-[#F5F7FA] shadow-[0_0_24px_rgba(24,123,255,0.3)]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={
            animate
              ? { scale: 1, opacity: 1 }
              : { scale: 0.5, opacity: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 16,
            delay: stepDelay + 0.08,
          }}
        >
          <Icon size={28} strokeWidth={1.65} />
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-2xl border border-[#38bdf8]/35"
            initial={{ opacity: 0, scale: 1 }}
            animate={
              animate
                ? { opacity: [0, 0.8, 0], scale: [1, 1.35, 1.5] }
                : { opacity: 0, scale: 1 }
            }
            transition={{ duration: 0.95, delay: stepDelay + 0.15, ease: "easeOut" }}
            aria-hidden
          />
        </motion.div>

        <motion.span
          className="relative z-10 mb-1.5 text-sm font-bold text-[#FF6A00] md:text-base"
          initial={{ opacity: 0, y: 8 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.55, delay: stepDelay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {step.step}
        </motion.span>
        <motion.h4
          className="relative z-10 mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#F5F7FA] md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: stepDelay + 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {requirePick(step.title as any, `rizzPage.howWeGetYouThere.process[${step.step}].title`)}
        </motion.h4>
        <motion.p
          className="relative z-10 max-w-[14rem] text-sm leading-relaxed text-[#A7B0C0] md:max-w-[15rem] md:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, delay: stepDelay + 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {requirePick(
            step.description as any,
            `rizzPage.howWeGetYouThere.process[${step.step}].description`,
          )}
        </motion.p>
      </div>
    </motion.li>
  );
};

export const HowWeGetYouThereSection = () => {
  const { rizzPage, requirePick } = useSiteContent();
  const { dir } = useLanguage();
  if (!rizzPage?.howWeGetYouThere) {
    throw new Error("Missing required Sanity content: rizzPage.howWeGetYouThere");
  }
  const copy = rizzPage.howWeGetYouThere;
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const isInView = useInView(listRef, { once: true, margin: "-60px" });
  const animate = reduceMotion || isInView;
  const isRtl = dir === "rtl";

  return (
    <section
      id="how-we-get-you-there"
      className="relative overflow-hidden bg-[#030712] pb-20 md:pb-28"
      dir={dir}
    >
      <GradientOrb color="blue" className="-left-32 top-10" size="420px" opacity={0.1} />
      <GradientOrb color="orange" className="-right-24 bottom-0" size="360px" opacity={0.07} />

      <div className="relative w-full px-8">
        <SectionWrapper delay={0.35} className="mx-auto max-w-[1440px]">
          <h3
            className="mb-8 w-full text-center font-semibold uppercase leading-[0.95] text-[#F5F7FA] md:mb-10"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", letterSpacing: "-0.03em" }}
          >
            {requirePick(copy.howWeWork, "rizzPage.howWeGetYouThere.howWeWork")}
          </h3>

          <motion.ol
            ref={listRef}
            className="relative isolate grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6"
          >
            {(copy.process ?? []).map((step, index, steps) => (
              <ProcessStepCard
                key={step.step ?? String(index)}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
                animate={animate}
                isRtl={isRtl}
              />
            ))}
          </motion.ol>
        </SectionWrapper>
      </div>
    </section>
  );
};
