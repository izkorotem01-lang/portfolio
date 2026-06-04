import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCategories,
  getVideos,
  PortfolioVideo,
} from "@/lib/portfolioService";
import { pickRandomShortformVideos } from "@/lib/pickRandomShortformVideos";

export const HIGHLIGHT_HERO_ADVANCE_MS = 5_000;

type IntroHighlightsContextValue = {
  videos: PortfolioVideo[];
  isLoading: boolean;
  activeHeroIndex: number;
};

const IntroHighlightsContext = createContext<IntroHighlightsContextValue | null>(
  null
);

export const IntroHighlightsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [allVideos, categories] = await Promise.all([
          getVideos(),
          getCategories(),
        ]);
        if (!cancelled) {
          setVideos(pickRandomShortformVideos(allVideos, categories, 4));
        }
      } catch (error) {
        console.error("Intro highlights load failed:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % videos.length);
    }, HIGHLIGHT_HERO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [videos.length]);

  useEffect(() => {
    setActiveHeroIndex(0);
  }, [videos]);

  const value = useMemo(
    () => ({ videos, isLoading, activeHeroIndex }),
    [videos, isLoading, activeHeroIndex]
  );

  return (
    <IntroHighlightsContext.Provider value={value}>
      {children}
    </IntroHighlightsContext.Provider>
  );
};

export function useIntroHighlights() {
  const ctx = useContext(IntroHighlightsContext);
  if (!ctx) {
    throw new Error("useIntroHighlights must be used within IntroHighlightsProvider");
  }
  return ctx;
}
