import React, { useRef, useEffect, useState, useCallback } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVideoOptimization } from "@/hooks/use-video-optimization";

interface OptimizedVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  isPlaying: boolean;
  onVideoClick?: () => void;
  onVideoRef?: (ref: HTMLVideoElement | null) => void;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
  videoId?: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  isPlaying,
  onVideoClick,
  onVideoRef,
  className = "",
  lazy = true,
  priority = false,
  videoId = videoUrl, // Use videoUrl as fallback ID
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!lazy || priority);
  const isMobile = useIsMobile();
  const { loadVideo, unloadVideo, isVideoLoaded, isVideoLoading } =
    useVideoOptimization();

  // Intersection Observer for lazy loading with video optimization
  useEffect(() => {
    if (!lazy || priority) {
      // For priority videos or when lazy is disabled, load immediately
      setIsInView(true);
      loadVideo(videoId);
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            loadVideo(videoId);
            setShouldLoadVideo(true);
            observer.unobserve(entry.target);
          } else {
            // Unload video when it's far from viewport - more aggressive on mobile
            unloadVideo(videoId);
            setShouldLoadVideo(false);
          }
        });
      },
      {
        rootMargin: isMobile ? "50px" : "300px", // Much smaller margin on mobile
        threshold: 0.1,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
      unloadVideo(videoId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy, priority, videoId, isMobile]);

  // Register video ref with parent component
  useEffect(() => {
    if (onVideoRef) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  // Auto-play videos when loaded (restore original behavior)
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo && isVideoLoaded(videoId)) {
      videoRef.current.muted = true; // Start muted
      videoRef.current.play().catch((error) => {
        // Handle AbortError gracefully - video was removed from DOM
        if (error.name !== "AbortError") {
          console.error("Video play error:", error);
        }
      });
      setIsMuted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadVideo, videoId]);

  // Handle video play/pause based on isPlaying prop
  useEffect(() => {
    if (videoRef.current && shouldLoadVideo && isVideoLoaded(videoId)) {
      if (isPlaying) {
        videoRef.current.muted = false;
        videoRef.current.play().catch((error) => {
          // Handle AbortError gracefully - video was removed from DOM
          if (error.name !== "AbortError") {
            console.error("Video play error:", error);
          }
        });
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, shouldLoadVideo, videoId]);

  // Handle click - delegate to parent component
  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick();
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(console.error);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error("Video failed to load:", videoUrl);
  };

  // Cleanup effect to handle video removal
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      // Pause and cleanup video when component unmounts
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.src = "";
        video.load(); // Reset video element
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {thumbnailUrl ? (
        <>
          {/* Thumbnail with play overlay */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
          />
          {/* Play Overlay for thumbnails */}
          <div
            className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center cursor-pointer"
            onClick={handleVideoClick}
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center glow">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Video without thumbnail */}
          <div className="w-full h-full relative">
            {hasError ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground/70">
                    Video unavailable
                  </p>
                </div>
              </div>
            ) : (
              <>
                {shouldLoadVideo && isVideoLoaded(videoId) ? (
                  <video
                    ref={videoRef}
                    onLoadStart={handleLoadStart}
                    onLoadedData={handleLoadedData}
                    onError={handleError}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted
                    preload={isMobile ? "none" : "metadata"} // No preload on mobile
                    poster={thumbnailUrl} // Use thumbnail as poster
                    style={{
                      // Mobile-specific optimizations
                      transform: isMobile ? "translateZ(0)" : "none", // Hardware acceleration
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      // Additional mobile optimizations
                      willChange: isMobile ? "transform" : "auto",
                      contain: isMobile ? "layout style paint" : "auto",
                    }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  // Placeholder while not loaded
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground/70">
                        {isVideoLoading(videoId)
                          ? "Loading..."
                          : "Loading video..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Click area */}
                <div
                  className="absolute inset-0 cursor-pointer bg-transparent"
                  onClick={handleVideoClick}
                  style={{ zIndex: 10 }}
                >
                  {/* Volume indicator */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizedVideo;
