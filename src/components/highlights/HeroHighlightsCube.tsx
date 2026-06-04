import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PortfolioVideo } from "@/lib/portfolioService";
import HighlightVideoCard from "@/components/highlights/HighlightVideoCard";

const FLIP_MS = 1200;
const FLIP_PEAK_X = 18;
const FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function cubeTransform(rotateY: number, rotateX: number) {
  return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

type HeroHighlightsCubeProps = {
  videos: PortfolioVideo[];
  activeIndex: number;
  /** When false, holds on the current face (e.g. during scroll morph to grid). */
  flipEnabled?: boolean;
};

const HeroHighlightsCube = ({
  videos,
  activeIndex,
  flipEnabled = true,
}: HeroHighlightsCubeProps) => {
  const { language } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const [halfZ, setHalfZ] = useState(0);
  const [ready, setReady] = useState(false);
  const prevIndexRef = useRef(0);
  const rotationYRef = useRef(0);
  const animFromYRef = useRef(0);
  const animToYRef = useRef(0);

  const count = videos.length;
  const faceAngle = count > 0 ? 360 / count : 0;

  const spinSign =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("dir") === "rtl"
      ? 1
      : -1;

  useLayoutEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const measure = () => {
      const w = node.offsetWidth;
      if (w > 0) {
        setHalfZ(w / 2);
        setReady(true);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    rotationYRef.current = spinSign * activeIndex * faceAngle;
    prevIndexRef.current = activeIndex;
    const cube = cubeRef.current;
    if (cube) {
      cube.style.transform = cubeTransform(rotationYRef.current, 0);
    }
  }, [count, faceAngle, spinSign]);

  useEffect(() => {
    if (count <= 1 || !ready || !flipEnabled) return;

    const cube = cubeRef.current;
    if (!cube) return;

    const prev = prevIndexRef.current;
    if (prev === activeIndex) return;

    let steps = activeIndex - prev;
    if (steps > count / 2) steps -= count;
    if (steps < -count / 2) steps += count;

    prevIndexRef.current = activeIndex;

    if (animRef.current) {
      const running = animRef.current;
      const duration =
        (running.effect?.getComputedTiming().duration as number) || FLIP_MS;
      const progress = Math.min(1, (running.currentTime ?? 0) / duration);
      const interruptedY =
        animFromYRef.current +
        (animToYRef.current - animFromYRef.current) * progress;
      rotationYRef.current = interruptedY;
      running.cancel();
      cube.style.transform = cubeTransform(interruptedY, 0);
    }

    const startY = rotationYRef.current;
    const endY = startY + spinSign * steps * faceAngle;
    const midY = startY + spinSign * steps * faceAngle * 0.5;

    animFromYRef.current = startY;
    animToYRef.current = endY;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      rotationYRef.current = endY;
      cube.style.transform = cubeTransform(endY, 0);
      return;
    }

    const anim = cube.animate(
      [
        { transform: cubeTransform(startY, 0) },
        { transform: cubeTransform(midY, FLIP_PEAK_X), offset: 0.5 },
        { transform: cubeTransform(endY, 0) },
      ],
      {
        duration: FLIP_MS,
        easing: FLIP_EASING,
        fill: "forwards",
      }
    );

    animRef.current = anim;

    anim.onfinish = () => {
      rotationYRef.current = endY;
      cube.style.transform = cubeTransform(endY, 0);
      animRef.current = null;
    };

    anim.oncancel = () => {
      animRef.current = null;
    };
  }, [activeIndex, count, faceAngle, flipEnabled, ready, spinSign]);

  useEffect(() => () => animRef.current?.cancel(), []);

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div ref={stageRef} className="hero-cube-stage hero-cube-stage--flat">
        <HighlightVideoCard
          video={videos[0]}
          language={language}
          isActive
          onActivate={() => {}}
          mode="hero"
          forceMuted
          fillContainer
        />
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      className="hero-cube-stage"
      aria-live="polite"
      aria-label={
        language === "he"
          ? `היילייט ${activeIndex + 1} מתוך ${count}`
          : `Highlight ${activeIndex + 1} of ${count}`
      }
    >
      <div className="hero-cube-scene">
        <div className="hero-cube-iso">
          <div
            ref={cubeRef}
            className={`hero-cube${ready ? " hero-cube--ready" : ""}`}
          >
            {ready &&
              videos.map((video, index) => (
                <div
                  key={video.id}
                  className="hero-cube__face"
                  style={{
                    transform: `rotateY(${index * faceAngle}deg) translate3d(0, 0, ${halfZ}px)`,
                  }}
                >
                  <HighlightVideoCard
                    video={video}
                    language={language}
                    isActive={index === activeIndex}
                    onActivate={() => {}}
                    mode="hero"
                    forceMuted
                    fillContainer
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroHighlightsCube;
