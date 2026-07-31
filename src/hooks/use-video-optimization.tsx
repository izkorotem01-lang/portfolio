import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "./use-mobile";

interface VideoOptimizationConfig {
  maxConcurrentVideos: number;
  preloadDistance: number;
  unloadDistance: number;
}

const MOBILE_CONFIG: VideoOptimizationConfig = {
  maxConcurrentVideos: 1, // Only load 1 video at a time on mobile for better performance
  preloadDistance: 100, // Start loading 100px before entering viewport
  unloadDistance: 200, // Unload videos 200px after leaving viewport
};

const DESKTOP_CONFIG: VideoOptimizationConfig = {
  maxConcurrentVideos: 4, // Load up to 4 videos on desktop
  preloadDistance: 300,
  unloadDistance: 800,
};

export function useVideoOptimization() {
  const isMobile = useIsMobile();
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [loadingVideos, setLoadingVideos] = useState<Set<string>>(new Set());

  // Use refs to track current state without causing re-renders
  const loadedVideosRef = useRef<Set<string>>(new Set());
  const loadingVideosRef = useRef<Set<string>>(new Set());

  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;

  // Update refs when state changes
  useEffect(() => {
    loadedVideosRef.current = loadedVideos;
  }, [loadedVideos]);

  useEffect(() => {
    loadingVideosRef.current = loadingVideos;
  }, [loadingVideos]);

  const canLoadVideo = useCallback(() => {
    return (
      loadedVideosRef.current.size + loadingVideosRef.current.size <
      config.maxConcurrentVideos
    );
  }, [config.maxConcurrentVideos]);

  const loadVideo = useCallback(
    (videoId: string) => {
      if (
        loadedVideosRef.current.has(videoId) ||
        loadingVideosRef.current.has(videoId)
      ) {
        return;
      }

      if (!canLoadVideo()) {
        return;
      }

      setLoadingVideos((prev) => new Set(prev).add(videoId));

      // Simulate loading delay for better UX
      setTimeout(() => {
        setLoadingVideos((prev) => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        setLoadedVideos((prev) => new Set(prev).add(videoId));
      }, 100);
    },
    [canLoadVideo]
  );

  const unloadVideo = useCallback((videoId: string) => {
    setLoadedVideos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
    setLoadingVideos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(videoId);
      return newSet;
    });
  }, []);

  const isVideoLoaded = useCallback(
    (videoId: string) => {
      return loadedVideos.has(videoId);
    },
    [loadedVideos]
  );

  const isVideoLoading = useCallback(
    (videoId: string) => {
      return loadingVideos.has(videoId);
    },
    [loadingVideos]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setLoadedVideos(new Set());
      setLoadingVideos(new Set());
    };
  }, []);

  return {
    loadVideo,
    unloadVideo,
    isVideoLoaded,
    isVideoLoading,
    canLoadVideo,
    config,
  };
}
