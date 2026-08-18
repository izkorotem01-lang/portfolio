import { GradientOrb } from "@/components/rizz/ui/GradientOrb";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { cn } from "@/lib/utils";
import { MotionConfig, motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  Box,
  ChartNoAxesCombined,
  Clapperboard,
  Cpu,
  Search,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProcessStep, ProcessTier } from "@/lib/sanitySite";

const PROCESS_ICONS: Record<string, LucideIcon> = {
  search: Search,
  box: Box,
  clapperboard: Clapperboard,
  cpu: Cpu,
  chart: ChartNoAxesCombined,
  trending: TrendingUp,
};

const REQUIRED_TIERS: readonly ProcessTier[] = [
  "root",
  "creative",
  "tech",
  "canopy",
];

const EASE = [0.22, 1, 0.36, 1] as const;
const NODE_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 20,
  mass: 1,
};

/**
 * The two engines share a delay rather than being staggered, because they are
 * parallel arms of the tree rather than sequential steps.
 */
const TIMELINE = {
  root: 0,
  trunkTop: 0.45,
  splitBar: 0.75,
  splitCorner: 0.9,
  splitDrop: 0.95,
  engines: 1.3,
  mergeDrop: 1.9,
  mergeCorner: 2.05,
  mergeBar: 2.1,
  trunkBottom: 2.35,
  canopy: 2.5,
} as const;

type Lane = "neutral" | "creative" | "tech";

const LANE_STYLES: Record<
  Lane,
  { tile: string; ring: string; label: string; panel: string }
> = {
  neutral: {
    tile: "border-[#187BFF]/45 shadow-[0_0_24px_rgba(24,123,255,0.3)]",
    ring: "border-[#38bdf8]/35",
    label: "text-[#38bdf8]",
    panel: "",
  },
  creative: {
    tile: "border-[#FF6A00]/45 shadow-[0_0_24px_rgba(255,106,0,0.28)]",
    ring: "border-[#FF6A00]/40",
    label: "text-[#FF6A00]",
    panel: "border-[#FF6A00]/20 bg-[#FF6A00]/[0.035]",
  },
  tech: {
    tile: "border-[#187BFF]/45 shadow-[0_0_24px_rgba(24,123,255,0.3)]",
    ring: "border-[#38bdf8]/35",
    label: "text-[#38bdf8]",
    panel: "border-[#187BFF]/20 bg-[#187BFF]/[0.035]",
  },
};

/**
 * Distance from the container edge to a branch card's centre. With a grid gap
 * of G the card centre sits at 25% - G/4, not 25%, so the gap is read from a
 * shared variable that also drives the card grid. The 1.5px pulls the 3px line
 * onto the centre rather than beside it.
 */
const ARM_OUTER = "calc(25% - (var(--branch-gap) / 4) - 1.5px)";
const CORNER = "1rem";

const TrunkLine = ({
  height,
  delay,
  animate,
  shine,
}: {
  height: string;
  delay: number;
  animate: boolean;
  shine: boolean;
}) => (
  // The dot is a sibling of the scaled track, not a child: nesting it would
  // squash it into an ellipse for the duration of the scaleY reveal.
  <div className="relative mx-auto w-[3px]" style={{ height }} aria-hidden>
    <motion.div
      className={cn(
        "how-we-connector-track how-we-connector-track--vertical absolute inset-0",
        shine && "how-we-connector-track--shining",
      )}
      style={{
        transformOrigin: "top center",
        ["--shine-delay" as string]: `${delay + 0.6}s`,
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={animate ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
      transition={{
        scaleY: { duration: 0.55, delay, ease: EASE },
        opacity: { duration: 0.3, delay },
      }}
    />
    {shine && (
      <motion.span
        className="how-we-connector-dot absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
        initial={{ opacity: 0, top: "0%" }}
        animate={{ opacity: [0, 1, 1, 0], top: "100%" }}
        transition={{ duration: 0.7, delay, ease: EASE }}
      />
    )}
  </div>
);

/**
 * One half of the branching bracket: a straight run to the corner, a
 * fixed-size corner, and a straight drop to the card.
 *
 * The corner is the only rounded element and is revealed with opacity alone —
 * scaling it would distort both its radius and its border width. The two
 * straight runs carry no radius, so they can be scaled freely without
 * deforming.
 */
const BranchArm = ({
  side,
  variant,
  animate,
  shine,
  delayScale,
}: {
  side: "left" | "right";
  variant: "split" | "merge";
  animate: boolean;
  shine: boolean;
  delayScale: number;
}) => {
  const isLeft = side === "left";
  const isSplit = variant === "split";

  const barDelay = (isSplit ? TIMELINE.splitBar : TIMELINE.mergeBar) * delayScale;
  const cornerDelay =
    (isSplit ? TIMELINE.splitCorner : TIMELINE.mergeCorner) * delayScale;
  const dropDelay =
    (isSplit ? TIMELINE.splitDrop : TIMELINE.mergeDrop) * delayScale;

  // Split flows centre -> corner -> card; merge flows card -> corner -> centre.
  // The merge is rendered rotated, so its local "bottom" is the card end.
  const barOrigin = isSplit
    ? isLeft
      ? "right center"
      : "left center"
    : isLeft
      ? "left center"
      : "right center";
  const dropOrigin = isSplit ? "top center" : "bottom center";

  return (
    <div
      className="absolute top-0 bottom-0"
      style={
        isLeft
          ? { left: ARM_OUTER, right: "50%" }
          : { right: ARM_OUTER, left: "50%" }
      }
      aria-hidden
    >
      <motion.div
        className={cn(
          "how-we-connector-track absolute top-0",
          shine && "how-we-connector-track--shining",
        )}
        style={{
          transformOrigin: barOrigin,
          ...(isLeft ? { left: CORNER, right: 0 } : { left: 0, right: CORNER }),
          ["--shine-delay" as string]: `${barDelay + 0.6}s`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          animate ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
        }
        transition={{
          scaleX: { duration: 0.6, delay: barDelay, ease: EASE },
          opacity: { duration: 0.3, delay: barDelay },
        }}
      />

      <motion.div
        className={cn(
          "how-we-branch-corner absolute top-0",
          !isLeft && "how-we-branch-corner--right",
        )}
        style={{
          height: CORNER,
          width: CORNER,
          ...(isLeft ? { left: 0 } : { right: 0 }),
        }}
        initial={{ opacity: 0 }}
        animate={animate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: cornerDelay, ease: EASE }}
      />

      <motion.div
        className={cn(
          "how-we-connector-track how-we-connector-track--vertical absolute bottom-0",
          shine && "how-we-connector-track--shining",
        )}
        style={{
          top: CORNER,
          transformOrigin: dropOrigin,
          ...(isLeft ? { left: 0 } : { right: 0 }),
          ["--shine-delay" as string]: `${dropDelay + 0.6}s`,
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={
          animate ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }
        }
        transition={{
          scaleY: { duration: 0.5, delay: dropDelay, ease: EASE },
          opacity: { duration: 0.3, delay: dropDelay },
        }}
      />
    </div>
  );
};

/**
 * The rounded bracket connecting one node to the two parallel engines. The
 * merge is the split rotated 180deg, which also maps every transform origin
 * onto its mirror, so the reveal still runs from the cards towards the centre.
 */
const BranchFork = ({
  variant,
  animate,
  shine,
  delayScale,
}: {
  variant: "split" | "merge";
  animate: boolean;
  shine: boolean;
  delayScale: number;
}) => (
  <div
    className={cn(
      "relative hidden h-16 w-full md:block",
      variant === "merge" && "rotate-180",
    )}
    aria-hidden
  >
    {(["left", "right"] as const).map((side) => (
      <BranchArm
        key={side}
        side={side}
        variant={variant}
        animate={animate}
        shine={shine}
        delayScale={delayScale}
      />
    ))}
  </div>
);

const ProcessNode = ({
  step,
  lane,
  delay,
  animate,
  panelled = false,
}: {
  step: ProcessStep;
  lane: Lane;
  delay: number;
  animate: boolean;
  panelled?: boolean;
}) => {
  const { requirePick, pick } = useSiteContent();
  const Icon = PROCESS_ICONS[step.icon ?? "search"] ?? Search;
  const styles = LANE_STYLES[lane];
  const laneLabel = pick(step.laneLabel);

  return (
    <motion.div
      className={cn(
        "flex h-full flex-col items-center text-center",
        panelled && "rounded-2xl border p-5 md:p-6",
        panelled && styles.panel,
      )}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        animate
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{ ...NODE_SPRING, delay }}
    >
      {laneLabel && (
        <p
          className={cn(
            "mb-3 text-[10px] font-semibold uppercase tracking-[0.45em] md:hidden",
            styles.label,
          )}
        >
          {laneLabel}
        </p>
      )}

      <motion.div
        className={cn(
          "relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border bg-[#030712] text-[#F5F7FA]",
          styles.tile,
        )}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={animate ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 340,
          damping: 16,
          delay: delay + 0.08,
        }}
      >
        <Icon size={28} strokeWidth={1.65} />
        <motion.span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl border",
            styles.ring,
          )}
          initial={{ opacity: 0, scale: 1 }}
          animate={
            animate
              ? { opacity: [0, 0.8, 0], scale: [1, 1.35, 1.5] }
              : { opacity: 0, scale: 1 }
          }
          transition={{ duration: 0.95, delay: delay + 0.15, ease: "easeOut" }}
          aria-hidden
        />
      </motion.div>

      <motion.span
        className="mb-1.5 text-sm font-bold text-[#FF6A00] md:text-base"
        initial={{ opacity: 0, y: 8 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.55, delay: delay + 0.2, ease: EASE }}
      >
        {step.step}
      </motion.span>

      <motion.h4
        className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#F5F7FA] md:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6, delay: delay + 0.28, ease: EASE }}
      >
        {requirePick(
          step.title,
          `rizzPage.howWeGetYouThere.process[${step.tier}].title`,
        )}
      </motion.h4>

      <motion.p
        className="max-w-[22rem] text-sm leading-relaxed text-[#A7B0C0] md:text-base"
        initial={{ opacity: 0, y: 12 }}
        animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.65, delay: delay + 0.36, ease: EASE }}
      >
        {requirePick(
          step.description,
          `rizzPage.howWeGetYouThere.process[${step.tier}].description`,
        )}
      </motion.p>
    </motion.div>
  );
};

export const HowWeGetYouThereSection = () => {
  // Every hook must run before the guard below returns. In production the
  // provider renders once with baked JSON and again with live Sanity data, so
  // this component really can render with tiers missing and then present; an
  // early return above a hook would change the hook count between those passes.
  const { rizzPage, requirePick } = useSiteContent();
  const { dir } = useLanguage();
  const reduceMotion = useReducedMotion();
  const treeRef = useRef<HTMLOListElement>(null);
  const isInView = useInView(treeRef, { once: true, margin: "-60px" });

  if (!rizzPage?.howWeGetYouThere) {
    throw new Error("Missing required Sanity content: rizzPage.howWeGetYouThere");
  }

  const copy = rizzPage.howWeGetYouThere;
  const animate = reduceMotion || isInView;
  const shine = animate && !reduceMotion;
  // Collapse the 2.5s choreography to a single beat for reduced motion, rather
  // than merely starting it early. MotionConfig then drops the transform
  // animations too, leaving a plain fade.
  const delayScale = reduceMotion ? 0 : 1;

  const steps = copy.process ?? [];
  const byTier = (tier: ProcessTier) => steps.find((s) => s.tier === tier);

  const root = byTier("root");
  const creative = byTier("creative");
  const tech = byTier("tech");
  const canopy = byTier("canopy");

  if (!root || !creative || !tech || !canopy) {
    console.warn(
      "HowWeWork: Missing required tier content, skipping section rendering",
      {
        missingTiers: REQUIRED_TIERS.filter((tier) => !byTier(tier)),
        receivedTiers: steps.map((s) => s.tier),
      },
    );
    return null;
  }

  return (
    <section
      id="how-we-get-you-there"
      className="relative overflow-hidden bg-transparent pb-20 md:pb-28"
      dir={dir}
    >
      <GradientOrb color="blue" className="-left-32 top-10" size="420px" opacity={0.1} />
      <GradientOrb color="orange" className="-right-24 bottom-0" size="360px" opacity={0.07} />

      <div className="relative w-full px-8">
        <SectionWrapper delay={0.35} className="mx-auto max-w-[900px]">
          <h3
            className="mb-8 w-full text-center font-semibold uppercase leading-[0.95] text-[#F5F7FA] md:mb-10"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)", letterSpacing: "-0.03em" }}
          >
            {requirePick(copy.howWeWork, "rizzPage.howWeGetYouThere.howWeWork")}
          </h3>

          <MotionConfig reducedMotion="user">
            <ol
              ref={treeRef}
              className="relative"
              style={{ ["--branch-gap" as string]: "2rem" }}
            >
              <li>
                <ProcessNode
                  step={root}
                  lane="neutral"
                  delay={TIMELINE.root * delayScale}
                  animate={animate}
                />
              </li>

              <li>
                <div className="hidden md:block">
                  <TrunkLine
                    height="2.5rem"
                    delay={TIMELINE.trunkTop * delayScale}
                    animate={animate}
                    shine={shine}
                  />
                </div>
                <BranchFork
                  variant="split"
                  animate={animate}
                  shine={shine}
                  delayScale={delayScale}
                />

                <ol className="mt-10 grid grid-cols-1 gap-[var(--branch-gap)] md:mt-0 md:grid-cols-2">
                  <li>
                    <ProcessNode
                      step={creative}
                      lane="creative"
                      delay={TIMELINE.engines * delayScale}
                      animate={animate}
                      panelled
                    />
                  </li>
                  <li>
                    <ProcessNode
                      step={tech}
                      lane="tech"
                      delay={TIMELINE.engines * delayScale}
                      animate={animate}
                      panelled
                    />
                  </li>
                </ol>

                <BranchFork
                  variant="merge"
                  animate={animate}
                  shine={shine}
                  delayScale={delayScale}
                />
                <div className="hidden md:block">
                  <TrunkLine
                    height="2.5rem"
                    delay={TIMELINE.trunkBottom * delayScale}
                    animate={animate}
                    shine={shine}
                  />
                </div>
              </li>

              <li className="mt-10 md:mt-0">
                <ProcessNode
                  step={canopy}
                  lane="neutral"
                  delay={TIMELINE.canopy * delayScale}
                  animate={animate}
                />
              </li>
            </ol>
          </MotionConfig>
        </SectionWrapper>
      </div>
    </section>
  );
};
