import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor";
import { Play } from "lucide-react";
import {
  getCategories,
  getVideos,
  PortfolioCategory,
  PortfolioVideo,
} from "@/lib/portfolioService";

const PortfolioSection = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const { shouldOptimize } = usePerformanceMonitor();

  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [loadedVideoIds, setLoadedVideoIds] = useState<Set<string>>(new Set());
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const hasThumbnailById = useCallback(
    (id: string): boolean => {
      const v = videos.find((vid) => vid.id === id);
      return !!(v && v.thumbnailUrl && v.thumbnailUrl.trim() !== "");
    },
    [videos]
  );

  // Function to handle video/thumbnail click
  const handleVideoClick = useCallback(
    (videoId: string, hasThumbnail: boolean) => {
      // If video has thumbnail and hasn't been loaded yet, load it first
      if (hasThumbnail && !loadedVideoIds.has(videoId)) {
        // Load only this video's player; revert others with thumbnails back to their thumbnails
        setLoadedVideoIds(new Set([videoId]));
        // Give video a moment to load before playing
        setTimeout(() => {
          playVideo(videoId);
        }, 100);
        return;
      }

      playVideo(videoId);
    },
    [loadedVideoIds]
  );

  const playVideo = useCallback(
    (videoId: string) => {
      const video = videoRefs.current[videoId];
      if (video) {
        // Always restart the video from the beginning
        video.currentTime = 0;

        if (playingVideoId === videoId) {
          // If clicking the same video, toggle mute
          video.muted = !video.muted;
          if (video.muted) {
            setPlayingVideoId(null);
            // If this video has a thumbnail, revert to thumbnail view
            if (hasThumbnailById(videoId)) {
              const next = new Set(loadedVideoIds);
              next.delete(videoId);
              setLoadedVideoIds(next);
            }
          } else {
            video.play().catch(console.error);
          }
        } else {
          // If clicking a different video, mute all others and unmute this one
          Object.entries(videoRefs.current).forEach(([id, v]) => {
            if (v) {
              v.muted = true;
              if (id !== videoId) {
                // Pause other videos to save resources
                try {
                  v.pause();
                } catch {}
              }
            }
          });

          video.muted = false;
          video.play().catch(console.error);
          setPlayingVideoId(videoId);

          // Ensure only this video's player stays loaded if it has a thumbnail
          if (hasThumbnailById(videoId)) {
            setLoadedVideoIds(new Set([videoId]));
          }
        }
      }
    },
    [playingVideoId, loadedVideoIds, hasThumbnailById]
  );

  // Function to register video ref
  const registerVideoRef = useCallback(
    (videoId: string, ref: HTMLVideoElement | null) => {
      videoRefs.current[videoId] = ref;
    },
    []
  );

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || !shouldOptimize) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute("data-video-id");
          if (videoId) {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set([...prev, videoId]));
            } else {
              setVisibleItems((prev) => {
                const next = new Set(prev);
                next.delete(videoId);
                return next;
              });
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [shouldOptimize]);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const [categoriesData, videosData] = await Promise.all([
          getCategories(),
          getVideos(false), // Always get all videos, no mobile optimization
        ]);
        setCategories(categoriesData);
        setVideos(videosData);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, []);

  // Create display categories with "All Work" option
  const displayCategories = [
    { id: "all", label: "All Work" },
    ...categories.map((cat) => ({
      id: cat.id,
      label: language === "he" ? cat.nameHe : cat.name,
    })),
  ];

  // Filter videos based on active category with memoization
  const filteredVideos = useMemo(() => {
    return activeCategory === "all"
      ? videos
      : videos.filter((video) => video.categoryId === activeCategory);
  }, [activeCategory, videos]);

  // Mobile optimization: limit visible videos for better performance
  const displayVideos = useMemo(() => {
    if (!shouldOptimize || !isMobile) return filteredVideos;

    // On mobile with performance issues, limit to 12 videos initially
    // More will load as user scrolls due to intersection observer
    return filteredVideos.slice(0, 12);
  }, [filteredVideos, shouldOptimize, isMobile]);

  // When category changes, reset loaded state to show thumbnails again
  useEffect(() => {
    setLoadedVideoIds(new Set());
    setPlayingVideoId(null);
  }, [activeCategory]);

  return (
    <section id="portfolio" className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {t("portfolio.title")}
              </h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-background/50 text-foreground/70 hover:bg-background/80 hover:text-foreground"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-foreground/70 text-lg">
                  No videos found for this category.
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={containerRef}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  {displayVideos.map((video, index) => (
                    <SimpleVideoItem
                      key={video.id}
                      video={video}
                      index={index}
                      language={language}
                      isPlaying={playingVideoId === video.id}
                      isLoaded={loadedVideoIds.has(video.id)}
                      isVisible={!shouldOptimize || visibleItems.has(video.id)}
                      onVideoClick={() =>
                        handleVideoClick(video.id, !!video.thumbnailUrl)
                      }
                      onVideoRef={(ref) => registerVideoRef(video.id, ref)}
                      observer={observerRef.current}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple Video Item Component
const SimpleVideoItem = React.memo(
  ({
    video,
    index,
    language,
    isPlaying,
    isLoaded,
    isVisible,
    onVideoClick,
    onVideoRef,
    observer,
  }: {
    video: PortfolioVideo;
    index: number;
    language: string;
    isPlaying: boolean;
    isLoaded: boolean;
    isVisible: boolean;
    onVideoClick: () => void;
    onVideoRef: (ref: HTMLVideoElement | null) => void;
    observer: IntersectionObserver | null;
  }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const hasThumbnail = video.thumbnailUrl && video.thumbnailUrl.trim() !== "";
    const shouldShowVideo = !hasThumbnail || isLoaded;

    // Set up intersection observer
    useEffect(() => {
      if (observer && itemRef.current) {
        itemRef.current.setAttribute("data-video-id", video.id);
        observer.observe(itemRef.current);

        return () => {
          if (itemRef.current) {
            observer.unobserve(itemRef.current);
          }
        };
      }
    }, [observer, video.id]);

    // Don't render if not visible and we're optimizing
    if (!isVisible) {
      return (
        <div
          ref={itemRef}
          className="portfolio-item group relative"
          data-video-id={video.id}
        >
          <div className="relative bg-gradient-secondary/20 overflow-hidden aspect-video w-full h-[35vh] sm:h-[60vh] shadow-lg">
            <div className="w-full h-full bg-black"></div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={itemRef}
        className="portfolio-item group relative"
        data-video-id={video.id}
      >
        {/* Simple Video Container */}
        <div className="relative bg-gradient-secondary/20 overflow-hidden aspect-video w-full h-[35vh] sm:h-[60vh] shadow-lg">
          {hasThumbnail && !isLoaded ? (
            // Show thumbnail with play button overlay
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={onVideoClick}
            >
              <img
                src={video.thumbnailUrl}
                alt={language === "he" ? video.titleHe : video.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="bg-primary/40 backdrop-blur-sm rounded-full p-4 md:p-6 group-hover:scale-110 group-hover:bg-primary/60 transition-all shadow-lg">
                  <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white" />
                </div>
              </div>
            </div>
          ) : (
            // Show video (either no thumbnail or already loaded)
            <video
              ref={onVideoRef}
              src={video.videoUrl}
              className="w-full h-full object-cover cursor-pointer"
              loop
              muted
              autoPlay={!hasThumbnail} // Only autoplay if no thumbnail
              playsInline
              onClick={onVideoClick}
              preload={hasThumbnail ? "none" : "auto"} // Don't preload if has thumbnail
              style={{
                contain: "layout style paint",
                willChange: "transform",
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    );
  }
);

export default PortfolioSection;
