import React, { createContext, useContext } from "react";
import {
  IntroScrollPhases,
  phasesFromProgress,
} from "@/hooks/useIntroHighlightsScroll";
import type { useIntroHighlightsReveal } from "@/hooks/useIntroHighlightsReveal";

export type IntroHighlightsRevealState = ReturnType<
  typeof useIntroHighlightsReveal
>;

type IntroHighlightsScrollContextValue = {
  morphEnabled: boolean;
  phases: IntroScrollPhases;
  reveal: IntroHighlightsRevealState;
};

const defaultReveal: IntroHighlightsRevealState = {
  titleActive: false,
  titleExiting: false,
  ticksActive: false,
  ticksExiting: false,
  titleVisible: false,
  ticksVisible: false,
  highlightsReveal: false,
  inFlowLatched: false,
  latchedMorph: null,
};

const IntroHighlightsScrollContext =
  createContext<IntroHighlightsScrollContextValue>({
    morphEnabled: false,
    phases: phasesFromProgress(0),
    reveal: defaultReveal,
  });

export const IntroHighlightsScrollProvider = ({
  morphEnabled,
  phases,
  reveal,
  children,
}: {
  morphEnabled: boolean;
  phases: IntroScrollPhases;
  reveal: IntroHighlightsRevealState;
  children: React.ReactNode;
}) => (
  <IntroHighlightsScrollContext.Provider
    value={{ morphEnabled, phases, reveal }}
  >
    {children}
  </IntroHighlightsScrollContext.Provider>
);

export function useIntroHighlightsScrollContext() {
  return useContext(IntroHighlightsScrollContext);
}
