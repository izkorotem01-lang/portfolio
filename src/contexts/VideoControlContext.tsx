import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { PortfolioVideo } from "@/lib/portfolioService";

interface VideoControlState {
  // Global video control
  globalCurrentIndex: number;
  globalVideos: PortfolioVideo[];

  // Category-specific video control
  categoryCurrentIndex: { [categoryId: string]: number };
  categoryVideos: { [categoryId: string]: PortfolioVideo[] };

  // Currently playing video
  playingVideoId: string | null;

  // Video refs for direct control
  videoRefs: { [videoId: string]: React.RefObject<HTMLVideoElement> };
}

interface VideoControlActions {
  // Global controls
  setGlobalVideos: (videos: PortfolioVideo[]) => void;
  playGlobalVideo: (index: number) => void;
  playNextGlobalVideo: () => void;
  playPreviousGlobalVideo: () => void;

  // Category controls
  setCategoryVideos: (categoryId: string, videos: PortfolioVideo[]) => void;
  playCategoryVideo: (categoryId: string, index: number) => void;
  playNextCategoryVideo: (categoryId: string) => void;
  playPreviousCategoryVideo: (categoryId: string) => void;

  // Direct video controls
  playVideo: (videoId: string) => void;
  pauseVideo: (videoId: string) => void;
  stopAllVideos: () => void;

  // Video ref management
  registerVideoRef: (
    videoId: string,
    ref: React.RefObject<HTMLVideoElement>
  ) => void;
  unregisterVideoRef: (videoId: string) => void;
}

type VideoControlContextType = VideoControlState & VideoControlActions;

const VideoControlContext = createContext<VideoControlContextType | undefined>(
  undefined
);

export const useVideoControl = () => {
  const context = useContext(VideoControlContext);
  if (!context) {
    throw new Error(
      "useVideoControl must be used within a VideoControlProvider"
    );
  }
  return context;
};

interface VideoControlProviderProps {
  children: React.ReactNode;
}

export const VideoControlProvider: React.FC<VideoControlProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<VideoControlState>({
    globalCurrentIndex: 0,
    globalVideos: [],
    categoryCurrentIndex: {},
    categoryVideos: {},
    playingVideoId: null,
    videoRefs: {},
  });

  // Global video controls
  const setGlobalVideos = useCallback((videos: PortfolioVideo[]) => {
    setState((prev) => ({
      ...prev,
      globalVideos: videos,
      globalCurrentIndex: 0,
    }));
  }, []);

  const playGlobalVideo = useCallback((index: number) => {
    setState((prev) => {
      if (index < 0 || index >= prev.globalVideos.length) return prev;

      const video = prev.globalVideos[index];
      return {
        ...prev,
        globalCurrentIndex: index,
        playingVideoId: video.id,
      };
    });
  }, []);

  const playNextGlobalVideo = useCallback(() => {
    setState((prev) => {
      const nextIndex =
        (prev.globalCurrentIndex + 1) % prev.globalVideos.length;
      const video = prev.globalVideos[nextIndex];
      return {
        ...prev,
        globalCurrentIndex: nextIndex,
        playingVideoId: video.id,
      };
    });
  }, []);

  const playPreviousGlobalVideo = useCallback(() => {
    setState((prev) => {
      const prevIndex =
        prev.globalCurrentIndex === 0
          ? prev.globalVideos.length - 1
          : prev.globalCurrentIndex - 1;
      const video = prev.globalVideos[prevIndex];
      return {
        ...prev,
        globalCurrentIndex: prevIndex,
        playingVideoId: video.id,
      };
    });
  }, []);

  // Category video controls
  const setCategoryVideos = useCallback(
    (categoryId: string, videos: PortfolioVideo[]) => {
      setState((prev) => ({
        ...prev,
        categoryVideos: {
          ...prev.categoryVideos,
          [categoryId]: videos,
        },
        categoryCurrentIndex: {
          ...prev.categoryCurrentIndex,
          [categoryId]: 0,
        },
      }));
    },
    []
  );

  const playCategoryVideo = useCallback((categoryId: string, index: number) => {
    setState((prev) => {
      const categoryVideos = prev.categoryVideos[categoryId] || [];
      if (index < 0 || index >= categoryVideos.length) return prev;

      const video = categoryVideos[index];
      return {
        ...prev,
        categoryCurrentIndex: {
          ...prev.categoryCurrentIndex,
          [categoryId]: index,
        },
        playingVideoId: video.id,
      };
    });
  }, []);

  const playNextCategoryVideo = useCallback((categoryId: string) => {
    setState((prev) => {
      const categoryVideos = prev.categoryVideos[categoryId] || [];
      const currentIndex = prev.categoryCurrentIndex[categoryId] || 0;
      const nextIndex = (currentIndex + 1) % categoryVideos.length;
      const video = categoryVideos[nextIndex];

      return {
        ...prev,
        categoryCurrentIndex: {
          ...prev.categoryCurrentIndex,
          [categoryId]: nextIndex,
        },
        playingVideoId: video.id,
      };
    });
  }, []);

  const playPreviousCategoryVideo = useCallback((categoryId: string) => {
    setState((prev) => {
      const categoryVideos = prev.categoryVideos[categoryId] || [];
      const currentIndex = prev.categoryCurrentIndex[categoryId] || 0;
      const prevIndex =
        currentIndex === 0 ? categoryVideos.length - 1 : currentIndex - 1;
      const video = categoryVideos[prevIndex];

      return {
        ...prev,
        categoryCurrentIndex: {
          ...prev.categoryCurrentIndex,
          [categoryId]: prevIndex,
        },
        playingVideoId: video.id,
      };
    });
  }, []);

  // Direct video controls
  const playVideo = useCallback((videoId: string) => {
    setState((prev) => ({
      ...prev,
      playingVideoId: videoId,
    }));
  }, []);

  const pauseVideo = useCallback((videoId: string) => {
    setState((prev) => ({
      ...prev,
      playingVideoId:
        prev.playingVideoId === videoId ? null : prev.playingVideoId,
    }));
  }, []);

  const stopAllVideos = useCallback(() => {
    setState((prev) => ({
      ...prev,
      playingVideoId: null,
    }));
  }, []);

  // Video ref management
  const registerVideoRef = useCallback(
    (videoId: string, ref: React.RefObject<HTMLVideoElement>) => {
      setState((prev) => ({
        ...prev,
        videoRefs: {
          ...prev.videoRefs,
          [videoId]: ref,
        },
      }));
    },
    []
  );

  const unregisterVideoRef = useCallback((videoId: string) => {
    setState((prev) => {
      const newRefs = { ...prev.videoRefs };
      delete newRefs[videoId];
      return {
        ...prev,
        videoRefs: newRefs,
      };
    });
  }, []);

  const value: VideoControlContextType = {
    ...state,
    setGlobalVideos,
    playGlobalVideo,
    playNextGlobalVideo,
    playPreviousGlobalVideo,
    setCategoryVideos,
    playCategoryVideo,
    playNextCategoryVideo,
    playPreviousCategoryVideo,
    playVideo,
    pauseVideo,
    stopAllVideos,
    registerVideoRef,
    unregisterVideoRef,
  };

  return (
    <VideoControlContext.Provider value={value}>
      {children}
    </VideoControlContext.Provider>
  );
};
