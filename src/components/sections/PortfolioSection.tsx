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
  isYouTubeUrl,
  getYouTubeEmbedUrl,
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
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter videos based on active category
  const filteredVideos = useMemo(() => {
    return activeCategory === "all"
      ? videos
      : videos.filter((video) => video.categoryId === activeCategory);
  }, [activeCategory, videos]);

  // Sort videos by allWorkOrder maintaining the order, but keep track of which are YouTube
  const sortedVideos = useMemo(() => {
    // Sort filtered videos by allWorkOrder if it exists, otherwise by order
    return [...filteredVideos].sort((a, b) => {
      const aOrder = (a as any).allWorkOrder !== undefined ? (a as any).allWorkOrder : a.order;
      const bOrder = (b as any).allWorkOrder !== undefined ? (b as any).allWorkOrder : b.order;
      return aOrder - bOrder;
    });
  }, [filteredVideos]);

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

  // Display all videos - no artificial limits
  const displayVideos = filteredVideos;

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
                {/* Display videos in order, YouTube videos larger and centered */}
                <div className="space-y-8">
                  {sortedVideos.map((video, index) => {
                    const isYouTube = isYouTubeUrl(video.videoUrl);
                    
                    if (isYouTube) {
                      // YouTube videos - large and centered
                      return (
                        <div key={video.id} className="flex justify-center">
                          <div className="w-full max-w-4xl md:max-w-6xl lg:max-w-7xl">
                            <SimpleVideoItem
                              video={video}
                              index={index}
                              language={language}
                              isPlaying={playingVideoId === video.id}
                              isLoaded={loadedVideoIds.has(video.id)}
                              onVideoClick={() =>
                                handleVideoClick(video.id, !!video.thumbnailUrl)
                              }
                              onVideoRef={(ref) => registerVideoRef(video.id, ref)}
                              isYouTube={true}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      // Regular videos - in grid
                      // Check if this is the first regular video or if previous was YouTube
                      const prevVideo = index > 0 ? sortedVideos[index - 1] : null;
                      const isFirstRegular = !prevVideo || isYouTubeUrl(prevVideo.videoUrl);
                      const nextVideo = index < sortedVideos.length - 1 ? sortedVideos[index + 1] : null;
                      const isLastRegular = !nextVideo || isYouTubeUrl(nextVideo.videoUrl);
                      
                      // Group consecutive regular videos together
                      if (isFirstRegular) {
                        // Find all consecutive regular videos
                        const regularGroup: PortfolioVideo[] = [];
                        for (let i = index; i < sortedVideos.length; i++) {
                          if (!isYouTubeUrl(sortedVideos[i].videoUrl)) {
                            regularGroup.push(sortedVideos[i]);
                          } else {
                            break;
                          }
                        }
                        
                        return (
                          <div
                            key={`group-${video.id}`}
                            ref={index === 0 ? containerRef : undefined}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                          >
                            {regularGroup.map((v) => (
                              <SimpleVideoItem
                                key={v.id}
                                video={v}
                                index={sortedVideos.findIndex(vid => vid.id === v.id)}
                                language={language}
                                isPlaying={playingVideoId === v.id}
                                isLoaded={loadedVideoIds.has(v.id)}
                                onVideoClick={() =>
                                  handleVideoClick(v.id, !!v.thumbnailUrl)
                                }
                                onVideoRef={(ref) => registerVideoRef(v.id, ref)}
                                isYouTube={false}
                              />
                            ))}
                          </div>
                        );
                      }
                      return null; // Already rendered in group
                    }
                  })}
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
    onVideoClick,
    onVideoRef,
    isYouTube = false,
  }: {
    video: PortfolioVideo;
    index: number;
    language: string;
    isPlaying: boolean;
    isLoaded: boolean;
    onVideoClick: () => void;
    onVideoRef: (ref: HTMLVideoElement | null) => void;
    isYouTube?: boolean;
  }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const hasThumbnail = video.thumbnailUrl && video.thumbnailUrl.trim() !== "";
    const shouldShowVideo = !hasThumbnail || isLoaded;
    const isMobile = useIsMobile();
    // Use the isYouTube prop if provided, otherwise check from video URL
    const isYouTubeVideo = isYouTube !== undefined ? isYouTube : isYouTubeUrl(video.videoUrl);
    const [youtubePlaying, setYoutubePlaying] = useState(false);
    // YouTube videos start unmuted (volume enabled by default)
    const youtubeEmbedUrl = isYouTubeVideo ? getYouTubeEmbedUrl(video.videoUrl, youtubePlaying, false) : null;

    // Simple intersection observer to detect when video is in view
    useEffect(() => {
      if (!itemRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
            }
          });
        },
        {
          rootMargin: "200px", // Start loading when video is 200px from viewport
          threshold: 0.01,
        }
      );

      observer.observe(itemRef.current);

      return () => {
        observer.disconnect();
      };
    }, []);

    // Auto-play when video loads (for videos without thumbnails)
    useEffect(() => {
      if (!videoRef.current || !hasLoaded || hasThumbnail) return;

      const videoElement = videoRef.current;
      videoElement.muted = true;

      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Autoplay prevented - tap to play:", err);
        });
      }
    }, [hasLoaded, hasThumbnail]);

    // Store ref for parent component
    useEffect(() => {
      if (videoRef.current) {
        onVideoRef(videoRef.current);
      }
    }, [onVideoRef]);

    return (
      <div
        ref={itemRef}
        className={`portfolio-item group relative ${
          isYouTubeVideo ? "w-full" : ""
        }`}
        data-video-id={video.id}
      >
        {/* Simple Video Container */}
        <div className={`relative bg-gradient-secondary/20 overflow-hidden w-full shadow-lg ${
          isYouTubeVideo 
            ? "aspect-video rounded-lg" // YouTube videos use 16:9 aspect ratio, larger and centered
            : "aspect-video h-[35vh] sm:h-[60vh]" // Regular videos use mobile aspect ratio
        }`}>
          {/* YouTube Video Embed */}
          {isYouTubeVideo && youtubeEmbedUrl ? (
            <div 
              className="relative w-full" 
              style={{ aspectRatio: "16/9" }}
            >
              <iframe
                key={youtubePlaying ? "playing-unmuted" : "paused-unmuted"}
                src={youtubeEmbedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={language === "he" ? video.titleHe : video.title}
              />
              <div 
                className={`absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300 rounded-lg z-10 cursor-pointer ${
                  youtubePlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                onClick={() => {
                  setYoutubePlaying(true);
                }}
              >
                <div className="bg-primary/40 backdrop-blur-sm rounded-full p-4 md:p-6 group-hover:scale-110 group-hover:bg-primary/60 transition-all shadow-lg">
                  <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white" />
                </div>
              </div>
            </div>
          ) : hasThumbnail && !isLoaded ? (
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
            <>
              {isInView && !videoError ? (
                <video
                  key={`video-${video.id}`}
                  ref={(el) => {
                    videoRef.current = el;
                    if (el) {
                      onVideoRef(el);
                    }
                  }}
                  poster={video.thumbnailUrl || undefined}
                  className="w-full h-full object-cover cursor-pointer"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  onClick={(e) => {
                    const videoEl = e.currentTarget;
                    if (videoEl.paused) {
                      videoEl.muted = true;
                      videoEl.play().catch((err) => {
                        console.log("Play on tap failed:", err);
                      });
                    }
                    onVideoClick();
                  }}
                  onLoadStart={() => {
                    console.log("Video load started:", video.id, video.videoUrl);
                  }}
                  onLoadedMetadata={() => {
                    console.log("Video metadata loaded:", video.id);
                  }}
                  onLoadedData={() => {
                    console.log("Video loaded:", video.id);
                    setHasLoaded(true);
                  }}
                  onCanPlay={() => {
                    console.log("Video can play:", video.id);
                  }}
                  onError={(e) => {
                    const videoEl = e.currentTarget;
                    const error = videoEl.error;
                    setVideoError(true);
                    console.error("Video error:", video.id);
                    console.error("Video URL:", video.videoUrl);
                    console.error("Video networkState:", videoEl.networkState);
                    console.error("Video readyState:", videoEl.readyState);
                    if (error) {
                      console.error("Error code:", error.code);
                      console.error("Error message:", error.message);
                      // Error codes: 1=MEDIA_ERR_ABORTED, 2=MEDIA_ERR_NETWORK, 3=MEDIA_ERR_DECODE, 4=MEDIA_ERR_SRC_NOT_SUPPORTED
                      switch (error.code) {
                        case 1:
                          console.error("Media loading aborted");
                          break;
                        case 2:
                          console.error("Network error - failed to load video");
                          console.error("Check CORS and network connectivity");
                          break;
                        case 3:
                          console.error("Decode error - video format/codec not supported");
                          break;
                        case 4:
                          console.error("Source not supported - check video format/URL");
                          console.error("Note: If Firebase Storage returns 402, check billing/quota");
                          break;
                      }
                    }
                  }}
                  style={{
                    backgroundColor: "#000",
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4; codecs=avc1.42E01E, mp4a.40.2" />
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // Placeholder until video comes into view or on error
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {videoError ? (
                    <div className="text-center p-4">
                      <Play className="h-12 w-12 text-white/50 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Video unavailable</p>
                    </div>
                  ) : video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={language === "he" ? video.titleHe : video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Play className="h-12 w-12 text-white/50" />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default PortfolioSection;
