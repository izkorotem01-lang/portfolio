import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "./use-mobile";

interface VideoLoadState {
  isLoading: boolean;
  isLoaded: boolean;
  canLoad: boolean;
}

/**
 * Hook to manage sequential video loading
 * Videos are loaded one after another to prevent overwhelming the network
 */
export function useSequentialVideoLoader(videoIds: string[]) {
  const isMobile = useIsMobile();
  const [videoStates, setVideoStates] = useState<Map<string, VideoLoadState>>(
    new Map()
  );
  const [loadQueue, setLoadQueue] = useState<string[]>([]);
  const [currentlyLoading, setCurrentlyLoading] = useState<string | null>(null);
  const loadedCountRef = useRef(0);

  // On mobile, be more conservative - load 1 at a time
  // On desktop, allow 2-3 concurrent loads for better performance
  const maxConcurrentLoads = isMobile ? 1 : 2;
  const initialLoadCount = isMobile ? 2 : 4; // Load first N videos immediately

  // Initialize video states
  useEffect(() => {
    const newStates = new Map<string, VideoLoadState>();
    videoIds.forEach((id, index) => {
      // First few videos can load immediately
      const canLoadInitially = index < initialLoadCount;
      newStates.set(id, {
        isLoading: false,
        isLoaded: false,
        canLoad: canLoadInitially,
      });
    });
    setVideoStates(newStates);

    // Queue remaining videos
    if (videoIds.length > initialLoadCount) {
      setLoadQueue(videoIds.slice(initialLoadCount));
    }
    loadedCountRef.current = 0;
  }, [videoIds, initialLoadCount]);

  // Mark video as loading
  const startLoading = useCallback((videoId: string) => {
    setVideoStates((prev) => {
      const newStates = new Map(prev);
      const state = newStates.get(videoId);
      if (state) {
        newStates.set(videoId, { ...state, isLoading: true });
      }
      return newStates;
    });
    setCurrentlyLoading(videoId);
  }, []);

  // Mark video as loaded and trigger next video to load
  const markAsLoaded = useCallback((videoId: string) => {
    setVideoStates((prev) => {
      const newStates = new Map(prev);
      const state = newStates.get(videoId);
      if (state) {
        newStates.set(videoId, {
          ...state,
          isLoading: false,
          isLoaded: true,
        });
      }
      return newStates;
    });

    loadedCountRef.current += 1;
    setCurrentlyLoading(null);

    // Load next video from queue
    setLoadQueue((prev) => {
      if (prev.length > 0) {
        const [nextVideoId, ...rest] = prev;

        // Allow the next video to load
        setVideoStates((prevStates) => {
          const newStates = new Map(prevStates);
          const state = newStates.get(nextVideoId);
          if (state) {
            newStates.set(nextVideoId, { ...state, canLoad: true });
          }
          return newStates;
        });

        return rest;
      }
      return prev;
    });
  }, []);

  // Get state for a specific video
  const getVideoState = useCallback(
    (videoId: string): VideoLoadState => {
      return (
        videoStates.get(videoId) || {
          isLoading: false,
          isLoaded: false,
          canLoad: false,
        }
      );
    },
    [videoStates]
  );

  // Check if a video can start loading
  const canLoadVideo = useCallback(
    (videoId: string): boolean => {
      const state = getVideoState(videoId);
      return state.canLoad && !state.isLoading && !state.isLoaded;
    },
    [getVideoState]
  );

  return {
    getVideoState,
    startLoading,
    markAsLoaded,
    canLoadVideo,
    loadedCount: loadedCountRef.current,
    totalCount: videoIds.length,
  };
}
