import { useEffect, useState, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type IntroScrollPhases = {
  /** 0–1 scroll through intro-highlights-scroll__scene (physical, not scaled) */
  progress: number;
  flatten: number;
  vivid: number;
  grid: number;
};

/**
 * Physical scene progress (0–1) when highlights lock in.
 * Tweak this only — do not multiply progress elsewhere.
 */
export const INTRO_HIGHLIGHTS_TITLE_TRIGGER = 0.93;
/** Scroll back above this (within the scene) to run exit animations */
export const INTRO_HIGHLIGHTS_RESET_BELOW = 0.9;
export const INTRO_HIGHLIGHTS_TICKS_DELAY_MS = 450;
export const INTRO_HIGHLIGHTS_TITLE_EXIT_MS = 180;
export const INTRO_HIGHLIGHTS_TICKS_EXIT_MS = 140;

export function phasesFromProgress(progress: number): IntroScrollPhases {
  return {
    progress,
    flatten: clamp((progress - 0.12) / 0.74, 0, 1),
    vivid: clamp((progress - 0.1) / 0.68, 0, 1),
    grid: clamp((progress - 0.5) / 0.38, 0, 1),
  };
}

export function useIntroHighlightsScroll(
  trackRef: RefObject<HTMLElement | null>,
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const rect = track.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const scrollable = Math.max(track.offsetHeight - window.innerHeight, 1);
      const next = clamp((window.scrollY - trackTop) / scrollable, 0, 1);
      setProgress(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [trackRef]);

  return phasesFromProgress(progress);
}

export function useIntroScrollMorphEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 769px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setEnabled(mqWide.matches && !mqMotion.matches);
    };

    sync();
    mqWide.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqWide.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}
