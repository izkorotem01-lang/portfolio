import React, { useRef, useEffect, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface OptimizedVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  isPlaying: boolean;
  onVideoClick?: () => void;
  className?: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  isPlaying,
  onVideoClick,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle video play/pause based on isPlaying prop
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  }, [isPlaying]);

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
                <video
                  ref={videoRef}
                  onLoadStart={handleLoadStart}
                  onLoadedData={handleLoadedData}
                  onError={handleError}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted
                  preload="metadata" // Only load metadata, not the full video
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>

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
