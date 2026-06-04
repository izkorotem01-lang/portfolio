import { useEffect, useRef, useState } from "react";
import {
  INTRO_HIGHLIGHTS_RESET_BELOW,
  INTRO_HIGHLIGHTS_TICKS_DELAY_MS,
  INTRO_HIGHLIGHTS_TICKS_EXIT_MS,
  INTRO_HIGHLIGHTS_TITLE_EXIT_MS,
  INTRO_HIGHLIGHTS_TITLE_TRIGGER,
  type IntroScrollPhases,
} from "@/hooks/useIntroHighlightsScroll";

export function useIntroHighlightsReveal(phases: IntroScrollPhases) {
  const [titleActive, setTitleActive] = useState(false);
  const [titleExiting, setTitleExiting] = useState(false);
  const [ticksActive, setTicksActive] = useState(false);
  const [ticksExiting, setTicksExiting] = useState(false);
  const ticksEnterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const belowReset = phases.progress < INTRO_HIGHLIGHTS_RESET_BELOW;
  const canEnter =
    !belowReset &&
    !titleExiting &&
    !ticksExiting &&
    phases.progress >= INTRO_HIGHLIGHTS_TITLE_TRIGGER;

  /* Latched: stays revealed while scrolling down through the hold zone; exits only above RESET */
  useEffect(() => {
    if (belowReset) {
      if (ticksEnterRef.current) {
        clearTimeout(ticksEnterRef.current);
        ticksEnterRef.current = null;
      }
      if (ticksActive && !ticksExiting) {
        setTicksActive(false);
        setTicksExiting(true);
      }
      if (titleActive && !titleExiting) {
        setTitleActive(false);
        setTitleExiting(true);
      }
      return;
    }

    if (canEnter && !titleActive && !titleExiting) {
      setTitleExiting(false);
      setTitleActive(true);
    }
  }, [
    belowReset,
    canEnter,
    phases.progress,
    phases.flatten,
    titleActive,
    titleExiting,
    ticksActive,
    ticksExiting,
  ]);

  useEffect(() => {
    if (!titleExiting) return;
    const id = window.setTimeout(() => setTitleExiting(false), INTRO_HIGHLIGHTS_TITLE_EXIT_MS);
    return () => clearTimeout(id);
  }, [titleExiting]);

  useEffect(() => {
    if (!ticksExiting) return;
    const id = window.setTimeout(() => setTicksExiting(false), INTRO_HIGHLIGHTS_TICKS_EXIT_MS);
    return () => clearTimeout(id);
  }, [ticksExiting]);

  useEffect(() => {
    if (belowReset || !titleActive) {
      if (!ticksExiting) setTicksActive(false);
      return;
    }
    if (ticksActive || ticksExiting) return;

    ticksEnterRef.current = window.setTimeout(() => {
      setTicksActive(true);
      ticksEnterRef.current = null;
    }, INTRO_HIGHLIGHTS_TICKS_DELAY_MS);

    return () => {
      if (ticksEnterRef.current) {
        clearTimeout(ticksEnterRef.current);
        ticksEnterRef.current = null;
      }
    };
  }, [belowReset, titleActive, ticksActive, ticksExiting]);

  const titleVisible = titleActive || titleExiting;
  const highlightsReveal = titleVisible;
  const ticksVisible = ticksActive || ticksExiting;

  return {
    titleActive,
    titleExiting,
    ticksActive,
    ticksExiting,
    titleVisible,
    ticksVisible,
    highlightsReveal,
  };
}
