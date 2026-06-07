import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import type { DisplayVideo } from "@/lib/videoTypes";
import { resolveHighlightThumbnail } from "@/lib/sanitySite";

export const HIGHLIGHT_HERO_ADVANCE_MS = 5_000;

type IntroHighlightsContextValue = {
  videos: DisplayVideo[];
  isLoading: boolean;
  activeHeroIndex: number;
  setHeroRotationPaused: (paused: boolean) => void;
};

const IntroHighlightsContext = createContext<IntroHighlightsContextValue | null>(
  null
);

export const IntroHighlightsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { highlightVideos, isLoading: siteLoading } = useSiteContent();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [heroRotationPaused, setHeroRotationPaused] = useState(false);

  const videos = useMemo<DisplayVideo[]>(
    () =>
      highlightVideos.map((video) => ({
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        thumbnailUrl: resolveHighlightThumbnail(video),
      })),
    [highlightVideos]
  );

  useEffect(() => {
    if (videos.length <= 1 || heroRotationPaused) return;

    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % videos.length);
    }, HIGHLIGHT_HERO_ADVANCE_MS);

    return () => clearInterval(interval);
  }, [videos.length, heroRotationPaused]);

  useEffect(() => {
    setActiveHeroIndex(0);
  }, [videos]);

  const value = useMemo(
    () => ({
      videos,
      isLoading: siteLoading,
      activeHeroIndex,
      setHeroRotationPaused,
    }),
    [videos, siteLoading, activeHeroIndex]
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
