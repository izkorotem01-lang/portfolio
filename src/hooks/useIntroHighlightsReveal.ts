import { useEffect, useRef, useState, type RefObject } from "react";
import {
  INTRO_HIGHLIGHTS_RESET_BELOW,
  INTRO_HIGHLIGHTS_TICKS_DELAY_MS,
  INTRO_HIGHLIGHTS_TICKS_EXIT_MS,
  INTRO_HIGHLIGHTS_TITLE_EXIT_MS,
  INTRO_HIGHLIGHTS_TITLE_TRIGGER,
  type IntroScrollPhases,
} from "@/hooks/useIntroHighlightsScroll";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type FrozenScrollMetrics = {
  trackTop: number;
  scrollable: number;
};

function progressFromMetrics(scrollY: number, metrics: FrozenScrollMetrics) {
  return clamp((scrollY - metrics.trackTop) / metrics.scrollable, 0, 1);
}

export function useIntroHighlightsReveal(
  phases: IntroScrollPhases,
  sceneRef: RefObject<HTMLElement | null>,
) {
  const [titleActive, setTitleActive] = useState(false);
  const [titleExiting, setTitleExiting] = useState(false);
  const [ticksActive, setTicksActive] = useState(false);
  const [ticksExiting, setTicksExiting] = useState(false);
  const [inFlowLatched, setInFlowLatched] = useState(false);
  const [mayReenter, setMayReenter] = useState(true);
  const [latchedMorph, setLatchedMorph] = useState<{
    flatten: number;
    vivid: number;
  } | null>(null);
  const ticksEnterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frozenScrollRef = useRef<FrozenScrollMetrics | null>(null);

  const captureFrozenScroll = () => {
    const track = sceneRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    frozenScrollRef.current = {
      trackTop: window.scrollY + rect.top,
      scrollable: Math.max(track.offsetHeight - window.innerHeight, 1),
    };
  };

  const revealProgress =
    inFlowLatched && frozenScrollRef.current
      ? progressFromMetrics(window.scrollY, frozenScrollRef.current)
      : phases.progress;

  const belowReset = revealProgress < INTRO_HIGHLIGHTS_RESET_BELOW;
  const canEnter =
    mayReenter &&
    !inFlowLatched &&
    !belowReset &&
    !titleExiting &&
    !ticksExiting &&
    phases.progress >= INTRO_HIGHLIGHTS_TITLE_TRIGGER;

  const clearInFlowLatch = () => {
    frozenScrollRef.current = null;
    setLatchedMorph(null);
    setInFlowLatched(false);
    setMayReenter(false);
  };

  useEffect(() => {
    if (!inFlowLatched && phases.progress < INTRO_HIGHLIGHTS_RESET_BELOW) {
      setMayReenter(true);
    }
  }, [phases.progress, inFlowLatched]);

  /* Latched: in-flow layout uses frozen scroll metrics so height changes do not re-trigger */
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
      captureFrozenScroll();
      setLatchedMorph({
        flatten: phases.flatten,
        vivid: phases.vivid,
      });
      setMayReenter(false);
      setInFlowLatched(true);
      setTitleExiting(false);
      setTitleActive(true);
    }
  }, [
    belowReset,
    canEnter,
    mayReenter,
    phases.progress,
    titleActive,
    titleExiting,
    ticksActive,
    ticksExiting,
    inFlowLatched,
  ]);

  const titleVisible = titleActive || titleExiting;
  const ticksVisible = ticksActive || ticksExiting;

  useEffect(() => {
    if (inFlowLatched && belowReset && !titleVisible && !ticksVisible) {
      clearInFlowLatch();
    }
  }, [inFlowLatched, belowReset, titleVisible, ticksVisible]);

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

  const highlightsReveal = titleVisible;

  return {
    titleActive,
    titleExiting,
    ticksActive,
    ticksExiting,
    titleVisible,
    ticksVisible,
    highlightsReveal,
    inFlowLatched,
    latchedMorph,
  };
}
