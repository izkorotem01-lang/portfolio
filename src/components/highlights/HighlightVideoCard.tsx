import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { PortfolioVideo } from "@/lib/portfolioService";

const hasThumbnail = (video: PortfolioVideo) =>
  !!(video.thumbnailUrl && video.thumbnailUrl.trim() !== "");

export type HighlightVideoCardProps = {
  video: PortfolioVideo;
  language: string;
  isActive: boolean;
  onActivate: () => void;
  /** Hero / morph: always muted, autoplay when active, no sound toggle */
  mode?: "hero" | "grid";
  forceMuted?: boolean;
  /** Fill parent (e.g. 3D cube face) without extra aspect box */
  fillContainer?: boolean;
};

const HighlightVideoCard = ({
  video,
  language,
  isActive,
  onActivate,
  mode = "grid",
  forceMuted = false,
  fillContainer = false,
}: HighlightVideoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(mode === "hero");
  const [isMuted, setIsMuted] = useState(true);
  const isHeroMode = mode === "hero" || forceMuted;

  const title = language === "he" ? video.titleHe : video.title;

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "80px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isLoaded) return;

    if (isActive && (isInView || isHeroMode)) {
      el.muted = true;
      el.play().catch(() => {});
      return;
    }

    el.pause();
    if (!isActive && !isHeroMode) {
      el.muted = true;
      setIsMuted(true);
    }
  }, [isActive, isInView, isLoaded, isHeroMode]);

  const handleClick = useCallback(() => {
    if (isHeroMode) return;

    if (!isLoaded) {
      setIsLoaded(true);
      onActivate();
      return;
    }

    onActivate();

    const el = videoRef.current;
    if (!el) return;

    if (isActive && isMuted) {
      setIsMuted(false);
      el.muted = false;
      el.play().catch(() => {});
      return;
    }

    if (isActive && !isMuted) {
      setIsMuted(true);
      el.muted = true;
    }
  }, [isActive, isHeroMode, isLoaded, isMuted, onActivate]);

  return (
    <div ref={cardRef} className="shortform-showcase__card group relative h-full w-full">
      <button
        type="button"
        onClick={handleClick}
        className={`brand-video-frame hero-showreel-frame relative block h-full w-full cursor-pointer overflow-hidden bg-black text-left ${
          fillContainer ? "aspect-auto" : "aspect-[9/16]"
        }`}
        aria-label={title}
        tabIndex={isHeroMode ? -1 : 0}
      >
        <div className="brand-video-frame__media h-full w-full">
          {isLoaded ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="h-full w-full object-cover"
              playsInline
              loop
              muted
              preload="metadata"
              onLoadedData={() => {
                const el = videoRef.current;
                if (el && isActive) {
                  el.muted = true;
                  el.play().catch(() => {});
                }
              }}
            />
          ) : hasThumbnail(video) ? (
            <img
              src={video.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <video
              src={video.videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}

          {!isHeroMode && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300 ${
                isActive && !isMuted
                  ? "pointer-events-none opacity-0"
                  : "opacity-100 group-hover:bg-black/35"
              }`}
            >
              {isActive && isLoaded && !isMuted ? (
                <Volume2 className="h-8 w-8 text-white/90" />
              ) : isActive && isLoaded && isMuted ? (
                <VolumeX className="h-8 w-8 text-white/90" />
              ) : (
                <div className="play-button-overlay rounded-full p-3 transition-transform group-hover:scale-110">
                  <Play className="h-7 w-7 fill-white text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </button>

      {!isHeroMode && (video.title || video.titleHe) && (
        <p className="mt-2 line-clamp-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/75 sm:text-sm">
          {title}
        </p>
      )}
    </div>
  );
};

export default HighlightVideoCard;
