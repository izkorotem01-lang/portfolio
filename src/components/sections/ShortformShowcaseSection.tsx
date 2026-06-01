import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  getCategories,
  getVideos,
  PortfolioVideo,
} from "@/lib/portfolioService";
import { pickRandomShortformVideos } from "@/lib/pickRandomShortformVideos";

const hasThumbnail = (video: PortfolioVideo) =>
  !!(video.thumbnailUrl && video.thumbnailUrl.trim() !== "");

const ShortformVideoCard = ({
  video,
  language,
  isActive,
  onActivate,
}: {
  video: PortfolioVideo;
  language: string;
  isActive: boolean;
  onActivate: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

    if (isActive && isInView) {
      el.muted = isMuted;
      el.play().catch(() => {});
      return;
    }

    el.pause();
    if (!isActive) {
      el.muted = true;
      setIsMuted(true);
    }
  }, [isActive, isInView, isLoaded, isMuted]);

  const handleClick = useCallback(() => {
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
      return;
    }
  }, [isActive, isLoaded, isMuted, onActivate]);

  return (
    <div
      ref={cardRef}
      className="shortform-showcase__card group relative"
    >
      <button
        type="button"
        onClick={handleClick}
        className="hero-showreel-frame relative block w-full aspect-[9/16] cursor-pointer overflow-hidden bg-[hsl(330_100%_58%)] text-left"
        aria-label={title}
      >
        <span className="hero-handle hero-handle-tl" aria-hidden />
        <span className="hero-handle hero-handle-tr" aria-hidden />
        <span className="hero-handle hero-handle-bl" aria-hidden />
        <span className="hero-handle hero-handle-br" aria-hidden />

        <div className="absolute inset-[3px] overflow-hidden bg-black">
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

          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-300 ${
              isActive && !isMuted
                ? "opacity-0 pointer-events-none"
                : "opacity-100 group-hover:bg-black/35"
            }`}
          >
            {isActive && isLoaded && !isMuted ? (
              <Volume2 className="h-8 w-8 text-white/90" />
            ) : isActive && isLoaded && isMuted ? (
              <VolumeX className="h-8 w-8 text-white/90" />
            ) : (
              <div className="rounded-full bg-primary/40 p-3 backdrop-blur-sm transition-transform group-hover:scale-110">
                <Play className="h-7 w-7 fill-white text-white" />
              </div>
            )}
          </div>
        </div>
      </button>

      {(video.title || video.titleHe) && (
        <p className="mt-2 line-clamp-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/75 sm:text-sm">
          {title}
        </p>
      )}
    </div>
  );
};

const ShortformShowcaseSection = () => {
  const { t, language } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 });
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

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
        console.error("Shortform showcase load failed:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLoading && videos.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="shortform-showcase"
      className={`relative z-10 py-6 md:py-8 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 md:mb-10">
            <h2 className="showcase-glow-title">{t("showcase.title")}</h2>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {videos.map((video) => (
                <ShortformVideoCard
                  key={video.id}
                  video={video}
                  language={language}
                  isActive={activeId === video.id}
                  onActivate={() => setActiveId(video.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShortformShowcaseSection;
