import React, { createContext, useContext } from "react";
import {
  IntroScrollPhases,
  phasesFromProgress,
} from "@/hooks/useIntroHighlightsScroll";

type IntroHighlightsScrollContextValue = {
  morphEnabled: boolean;
  phases: IntroScrollPhases;
};

const IntroHighlightsScrollContext =
  createContext<IntroHighlightsScrollContextValue>({
    morphEnabled: false,
    phases: phasesFromProgress(0),
  });

export const IntroHighlightsScrollProvider = ({
  morphEnabled,
  phases,
  children,
}: {
  morphEnabled: boolean;
  phases: IntroScrollPhases;
  children: React.ReactNode;
}) => (
  <IntroHighlightsScrollContext.Provider value={{ morphEnabled, phases }}>
    {children}
  </IntroHighlightsScrollContext.Provider>
);

export function useIntroHighlightsScrollContext() {
  return useContext(IntroHighlightsScrollContext);
}
