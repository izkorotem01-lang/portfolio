import { GradientOrb } from "@/components/rizz/ui/GradientOrb";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
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

const STEP_STAGGER = 0.38;
const STEP_SPRING = { type: "spring" as const, stiffness: 240, damping: 20, mass: 1 };
const ICON_CENTER_TOP = "2rem";

type HowWeColumn = {
  audience: AudienceCard[];
  services: ServiceItem[];
};

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

const AudienceList = ({ items }: { items: AudienceCard[] }) => (
  <ul className="space-y-3">
    {items.map((card) => {
      const Icon = AUDIENCE_ICONS[card.icon];
      return (
        <li key={card.title} className="proof-column-item p-4 md:p-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="proof-column-item-icon">
              <Icon size={16} strokeWidth={2.25} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#F5F7FA] md:text-base">
              {card.title}
            </p>
            <p className="text-sm leading-relaxed text-[#8B95A8] md:text-[0.9375rem]">
              {card.description}
            </p>
          </div>
        </li>
      );
    })}
  </ul>
);

const ServiceList = ({ items }: { items: ServiceItem[] }) => (
  <ul className="space-y-3">
    {items.map((service) => {
      const Icon = SERVICE_ICONS[service.icon];
      return (
        <li key={service.number} className="proof-column-item p-4 md:p-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <span className="proof-column-service-number">{service.number}</span>
              <div className="proof-column-item-icon proof-column-item-icon--service">
                <Icon size={16} strokeWidth={2.25} />
              </div>
            </div>
            <p className="text-sm font-medium leading-snug text-[#F5F7FA] md:text-base">
              {service.title}{" "}
              <span className="rizz-title-accent">{service.titleAccent}</span>
            </p>
          </div>
        </li>
      );
    })}
  </ul>
);

const ProcessConnector = ({
  index,
  animate,
}: {
  index: number;
  animate: boolean;
}) => {
  const lineDelay = index * STEP_STAGGER + 0.45;

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-0 hidden lg:block"
      style={{ top: `calc(${ICON_CENTER_TOP} - 1.5px)`, width: "calc(100% + 1rem)" }}
      aria-hidden
    >
      <motion.div
        className={`how-we-connector-track relative ${animate ? "how-we-connector-track--shining" : ""}`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={animate ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{
          scaleX: { duration: 0.9, delay: lineDelay, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.35, delay: lineDelay },
        }}
        style={{
          transformOrigin: "left center",
          ["--shine-delay" as string]: `${lineDelay + 0.9}s`,
        }}
      >
        <motion.span
          className="how-we-connector-dot absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
          initial={{ left: "0%", opacity: 0 }}
          animate={
            animate
              ? { left: "100%", opacity: [0, 1, 1, 0] }
              : { left: "0%", opacity: 0 }
          }
          transition={{
            duration: 0.85,
            delay: lineDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </motion.div>
    </div>
  );
};

const ProcessStepCard = ({
  step,
  index,
  isLast,
  animate,
}: {
  step: ProcessStep;
  index: number;
  isLast: boolean;
  animate: boolean;
}) => {
  const Icon = PROCESS_ICONS[step.icon];
  const stepDelay = index * STEP_STAGGER;

  return (
    <motion.li
      className="relative isolate flex min-w-0 flex-1 flex-col items-center text-center"
      initial={{ opacity: 0, y: 56, scale: 0.94 }}
      animate={
        animate
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 56, scale: 0.94 }
      }
      transition={{ ...STEP_SPRING, delay: stepDelay }}
    >
      {!isLast && <ProcessConnector index={index} animate={animate} />}

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
          {step.title}
        </motion.h4>
        <motion.p
          className="relative z-10 max-w-[14rem] text-sm leading-relaxed text-[#A7B0C0] md:max-w-[15rem] md:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, delay: stepDelay + 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {step.description}
        </motion.p>
      </div>
    </motion.li>
  );
};

export const HowWeGetYouThereColumn = ({
  column,
  labels,
  className = "",
}: {
  column: HowWeColumn;
  labels: { whoItsFor: string; whatWeBuild: string };
  className?: string;
}) => (
  <div className={`w-full ${className}`}>
    <ProofColumnNeonDivider />
    <div className="proof-column-panel flex flex-col gap-6 p-4 md:gap-7 md:p-5">
      <div>
        <ColumnLabel>{labels.whoItsFor}</ColumnLabel>
        <AudienceList items={column.audience} />
      </div>
      <div className="proof-column-section-divider" aria-hidden />
      <div>
        <ColumnLabel>{labels.whatWeBuild}</ColumnLabel>
        <ServiceList items={column.services} />
      </div>
    </div>
  </div>
);

export const HowWeGetYouThereSection = () => {
  const t = useRizzTranslations();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const isInView = useInView(listRef, { once: true, margin: "-60px" });
  const animate = reduceMotion || isInView;

  return (
    <section
      id="how-we-get-you-there"
      className="relative overflow-hidden bg-[#030712] pb-20 md:pb-28"
    >
      <GradientOrb color="blue" className="-left-32 top-10" size="420px" opacity={0.1} />
      <GradientOrb color="orange" className="-right-24 bottom-0" size="360px" opacity={0.07} />

      <div className="relative w-full px-8">
        <SectionWrapper delay={0.35} className="mx-auto max-w-[1440px]">
          <h3
            className="mb-8 w-full text-center font-semibold uppercase leading-[0.95] text-[#F5F7FA] md:mb-10"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", letterSpacing: "-0.03em" }}
          >
            {t.howWeGetYouThere.howWeWork}
          </h3>

          <motion.ol
            ref={listRef}
            className="relative isolate grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6"
          >
            {t.howWeGetYouThere.process.map((step, index, steps) => (
              <ProcessStepCard
                key={step.step}
                step={step}
                index={index}
                isLast={index === steps.length - 1}
                animate={animate}
              />
            ))}
          </motion.ol>
        </SectionWrapper>
      </div>
    </section>
  );
};
