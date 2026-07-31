import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { useVideoControl } from "@/contexts/VideoControlContext";
import { Button } from "@/components/ui/button";

interface VideoControlsProps {
  categoryId?: string;
  showGlobalControls?: boolean;
  className?: string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  categoryId,
  showGlobalControls = false,
  className = "",
}) => {
  const {
    globalCurrentIndex,
    globalVideos,
    categoryCurrentIndex,
    categoryVideos,
    playingVideoId,
    playGlobalVideo,
    playNextGlobalVideo,
    playPreviousGlobalVideo,
    playCategoryVideo,
    playNextCategoryVideo,
    playPreviousCategoryVideo,
    playVideo,
    pauseVideo,
    stopAllVideos,
  } = useVideoControl();

  // Determine which videos and current index to use
  const isGlobalMode = showGlobalControls || !categoryId;
  const videos = isGlobalMode
    ? globalVideos
    : categoryId
    ? categoryVideos[categoryId] || []
    : [];
  const currentIndex = isGlobalMode
    ? globalCurrentIndex
    : categoryId
    ? categoryCurrentIndex[categoryId] || 0
    : 0;
  const currentVideo = videos[currentIndex];

  // Control functions
  const handlePlayPause = () => {
    if (currentVideo) {
      if (playingVideoId === currentVideo.id) {
        pauseVideo(currentVideo.id);
      } else {
        playVideo(currentVideo.id);
      }
    }
  };

  const handleNext = () => {
    if (isGlobalMode) {
      playNextGlobalVideo();
    } else if (categoryId) {
      playNextCategoryVideo(categoryId);
    }
  };

  const handlePrevious = () => {
    if (isGlobalMode) {
      playPreviousGlobalVideo();
    } else if (categoryId) {
      playPreviousCategoryVideo(categoryId);
    }
  };

  const handleStop = () => {
    stopAllVideos();
  };

  const handleVideoSelect = (index: number) => {
    if (isGlobalMode) {
      playGlobalVideo(index);
    } else if (categoryId) {
      playCategoryVideo(categoryId, index);
    }
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className={`video-controls ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={videos.length <= 1}
          className="h-8 w-8 p-0"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handlePlayPause}
          disabled={!currentVideo}
          className="h-8 w-8 p-0"
        >
          {playingVideoId === currentVideo?.id ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={videos.length <= 1}
          className="h-8 w-8 p-0"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleStop}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Video Index Indicator */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="text-sm text-foreground/70">
          {isGlobalMode ? "All Work" : "Category"}: {currentIndex + 1} /{" "}
          {videos.length}
        </span>
      </div>

      {/* Video Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => handleVideoSelect(index)}
            className={`flex-shrink-0 w-16 h-10 rounded overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? "border-primary shadow-lg shadow-primary/25"
                : "border-border hover:border-primary/50"
            }`}
          >
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Current Video Info */}
      {currentVideo && (
        <div className="text-center mt-2">
          <p className="text-sm font-medium text-foreground truncate">
            {currentVideo.title}
          </p>
          {currentVideo.subtitle && (
            <p className="text-xs text-foreground/70 truncate">
              {currentVideo.subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoControls;
