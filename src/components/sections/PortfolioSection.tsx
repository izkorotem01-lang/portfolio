import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { flushSync } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor";
import { Play } from "lucide-react";
import {
  getCategories,
  getVideos,
  getPortfolioVideosForCategory,
  DEFAULT_PORTFOLIO_VIDEO_LIMIT,
  PortfolioCategory,
  PortfolioVideo,
  isYouTubeUrl,
  isUploadedReelVideo,
  isVerticalReelDimensions,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "@/lib/portfolioService";
import { useSiteContent } from "@/contexts/SiteContentContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
};

type FullscreenCapableVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

type WebkitFullscreenVideoEventMap = {
  webkitbeginfullscreen: Event;
  webkitendfullscreen: Event;
};

const requestFullscreenForElement = (
  element: HTMLElement | HTMLVideoElement | HTMLIFrameElement | null
) => {
  if (!element) return;

  const fullscreenElement = element as FullscreenCapableElement;
  const fullscreenVideo = element as FullscreenCapableVideo;

  if (typeof element.requestFullscreen === "function") {
    void element.requestFullscreen().catch(() => {
      // Ignore browser-specific fullscreen failures.
    });
    return;
  }

  if (typeof fullscreenElement.webkitRequestFullscreen === "function") {
    try {
      void fullscreenElement.webkitRequestFullscreen();
    } catch {
      // Ignore browser-specific fullscreen failures.
    }
    return;
  }

  if (typeof fullscreenVideo.webkitEnterFullscreen === "function") {
    try {
      fullscreenVideo.webkitEnterFullscreen();
    } catch {
      // Ignore browser-specific fullscreen failures.
    }
  }
};

const hasThumbnail = (video: PortfolioVideo) =>
  !!(video.thumbnailUrl && video.thumbnailUrl.trim() !== "");

const shouldUseThumbnailPreview = (video: PortfolioVideo) =>
  !video.autoplayInBackground;

const portfolioMediaFitClass = (isReel: boolean) =>
  isReel ? "object-contain" : "object-cover";

const portfolioContainerClass = (isReel: boolean) =>
  `relative aspect-video w-full overflow-hidden rounded-lg shadow-lg ${
    isReel ? "bg-black" : "bg-gradient-secondary/20"
  }`;

const PortfolioSection = () => {
  const { language } = useLanguage();
  const { homePage, requirePick } = useSiteContent();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.08,
    rootMargin: "0px 0px -5% 0px",
  });
  const isMobile = useIsMobile();
  const { shouldOptimize } = usePerformanceMonitor();

  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [loadedVideoIds, setLoadedVideoIds] = useState<Set<string>>(new Set());
  const [pendingPlayVideoId, setPendingPlayVideoId] = useState<string | null>(
    null
  );
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxVideo, setLightboxVideo] = useState<PortfolioVideo | null>(
    null
  );
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [lightboxIsReel, setLightboxIsReel] = useState(false);
  const hadLightboxFullscreenRef = useRef(false);
  const closeLightbox = useCallback(() => {
    hadLightboxFullscreenRef.current = false;
    setLightboxIsReel(false);
    setLightboxVideo(null);
  }, []);

  const openVideoLightbox = useCallback((video: PortfolioVideo) => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) {
        try {
          v.pause();
        } catch {
          /* ignore */
        }
      }
    });
    setPlayingVideoId(null);
    setLightboxIsReel(isUploadedReelVideo(video));
    flushSync(() => {
      setLightboxVideo(video);
    });

    const requestFullscreen = () => {
      const fullscreenTarget = isYouTubeUrl(video.videoUrl)
        ? lightboxIframeRef.current
        : lightboxVideoRef.current;

      if (!fullscreenTarget) {
        return false;
      }

      requestFullscreenForElement(fullscreenTarget);
      return true;
    };

    if (!requestFullscreen()) {
      requestAnimationFrame(() => {
        requestFullscreen();
      });
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenDocument = document as FullscreenCapableDocument;
      const fullscreenElement =
        document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement;
      const isLightboxFullscreen =
        fullscreenElement === lightboxVideoRef.current ||
        fullscreenElement === lightboxIframeRef.current;

      if (isLightboxFullscreen) {
        hadLightboxFullscreenRef.current = true;
        return;
      }

      if (!fullscreenElement && hadLightboxFullscreenRef.current) {
        closeLightbox();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange as EventListener
    );

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange as EventListener
      );
    };
  }, [closeLightbox]);

  useEffect(() => {
    const videoElement = lightboxVideoRef.current as
      | (HTMLVideoElement & {
          addEventListener<K extends keyof WebkitFullscreenVideoEventMap>(
            type: K,
            listener: (this: HTMLVideoElement, ev: WebkitFullscreenVideoEventMap[K]) => void
          ): void;
          removeEventListener<K extends keyof WebkitFullscreenVideoEventMap>(
            type: K,
            listener: (this: HTMLVideoElement, ev: WebkitFullscreenVideoEventMap[K]) => void
          ): void;
        })
      | null;

    if (!videoElement) return;

    const handleBeginFullscreen = () => {
      hadLightboxFullscreenRef.current = true;
    };

    const handleEndFullscreen = () => {
      closeLightbox();
    };

    videoElement.addEventListener(
      "webkitbeginfullscreen",
      handleBeginFullscreen
    );
    videoElement.addEventListener("webkitendfullscreen", handleEndFullscreen);

    return () => {
      videoElement.removeEventListener(
        "webkitbeginfullscreen",
        handleBeginFullscreen
      );
      videoElement.removeEventListener(
        "webkitendfullscreen",
        handleEndFullscreen
      );
    };
  }, [lightboxVideo, closeLightbox]);

  useEffect(() => {
    if (!lightboxVideo || isYouTubeUrl(lightboxVideo.videoUrl)) return;

    const checkFullscreenState = () => {
      const fullscreenDocument = document as FullscreenCapableDocument;
      const videoElement = lightboxVideoRef.current as FullscreenCapableVideo | null;
      const isDocumentFullscreen =
        document.fullscreenElement === videoElement ||
        fullscreenDocument.webkitFullscreenElement === videoElement;
      const isNativeVideoFullscreen = !!videoElement?.webkitDisplayingFullscreen;
      const isAnyFullscreen = isDocumentFullscreen || isNativeVideoFullscreen;

      if (isAnyFullscreen) {
        hadLightboxFullscreenRef.current = true;
      } else if (hadLightboxFullscreenRef.current) {
        closeLightbox();
      }
    };

    const intervalId = window.setInterval(checkFullscreenState, 250);
    checkFullscreenState();

    return () => {
      window.clearInterval(intervalId);
    };
  }, [lightboxVideo, closeLightbox]);

  // Filter videos based on active category
  const maxVideosDisplayed =
    homePage?.portfolioSection?.maxVideosDisplayed ?? DEFAULT_PORTFOLIO_VIDEO_LIMIT;

  const sortedVideos = useMemo(
    () => getPortfolioVideosForCategory(videos, activeCategory, maxVideosDisplayed),
    [activeCategory, videos, maxVideosDisplayed],
  );

  const filteredVideos = sortedVideos;

  const usesThumbnailPreviewById = useCallback(
    (id: string): boolean => {
      const v = videos.find((vid) => vid.id === id);
      return !!(v && shouldUseThumbnailPreview(v));
    },
    [videos]
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
            if (usesThumbnailPreviewById(videoId)) {
              const next = new Set(loadedVideoIds);
              next.delete(videoId);
              setLoadedVideoIds(next);
            }
            if (pendingPlayVideoId === videoId) {
              setPendingPlayVideoId(null);
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
          setPendingPlayVideoId(null);

          // Ensure only this video's player stays loaded if it has a thumbnail
          if (usesThumbnailPreviewById(videoId)) {
            setLoadedVideoIds(new Set([videoId]));
          }
        }
      }
    },
    [playingVideoId, loadedVideoIds, pendingPlayVideoId, usesThumbnailPreviewById]
  );

  // Function to handle video/thumbnail click
  const handleVideoClick = useCallback(
    (videoId: string, usesThumbnailPreview: boolean) => {
      // If video has thumbnail and hasn't been loaded yet, load it first
      if (usesThumbnailPreview && !loadedVideoIds.has(videoId)) {
        // Load only this video's player; revert others with thumbnails back to their thumbnails
        setLoadedVideoIds(new Set([videoId]));
        setPendingPlayVideoId(videoId);
        return;
      }

      setPendingPlayVideoId(null);
      playVideo(videoId);
    },
    [loadedVideoIds, playVideo]
  );

  const handleVideoReady = useCallback(
    (videoId: string) => {
      if (pendingPlayVideoId !== videoId) {
        return;
      }

      playVideo(videoId);
    },
    [pendingPlayVideoId, playVideo]
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

        videosData.forEach((video) => {
          const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl);
          if (!thumbnailUrl) return;
          const image = new Image();
          image.src = thumbnailUrl;
        });
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
    {
      id: "all",
      label: requirePick(homePage?.portfolioSection?.allWorkLabel, "homePage.portfolioSection.allWorkLabel"),
    },
    ...categories.map((cat) => ({
      id: cat.id,
      label: language === "hb" ? cat.nameHe : cat.name,
    })),
  ];

  // Display all videos - no artificial limits
  const displayVideos = filteredVideos;

  // Keep cached thumbnails/loaded videos across category switches; only stop active playback state.
  useEffect(() => {
    setPlayingVideoId(null);
    setPendingPlayVideoId(null);
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="section-band py-24 md:py-28 relative z-10"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50 shadow-2xl">
            <header className="intro-scroll-showcase-header mx-auto mb-12">
              <h2
                className={`showcase-productions-title intro-scroll-showcase-title${
                  isVisible ? " is-active" : ""
                }`}
              >
                {requirePick(homePage?.portfolioSection?.title, "homePage.portfolioSection.title")}
              </h2>
              <div
                className={`showcase-productions-ticks${
                  isVisible ? " intro-ticks-active" : ""
                }`}
                aria-hidden
              />
            </header>

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
              <div
                ref={containerRef}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {sortedVideos.map((video, index) => (
                  <SimpleVideoItem
                    key={video.id}
                    video={video}
                    index={index}
                    language={language}
                    isPlaying={playingVideoId === video.id}
                    isLoaded={loadedVideoIds.has(video.id)}
                    onVideoClick={() =>
                      handleVideoClick(
                        video.id,
                        shouldUseThumbnailPreview(video)
                      )
                    }
                    onVideoReady={() => handleVideoReady(video.id)}
                    onVideoRef={(ref) => registerVideoRef(video.id, ref)}
                    shouldStartPlaying={pendingPlayVideoId === video.id}
                    isYouTube={isYouTubeUrl(video.videoUrl)}
                    expandLabel={pick(homePage?.portfolioSection?.expandVideoLabel) || t("portfolio.expandVideo")}
                    onOpenBigScreen={() => openVideoLightbox(video)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!lightboxVideo}
        onOpenChange={(open) => {
          if (!open) closeLightbox();
        }}
      >
        <DialogContent className="max-h-[95vh] w-[min(96vw,1400px)] max-w-[min(96vw,1400px)] gap-3 overflow-y-auto border-border/50 bg-zinc-950 p-3 sm:p-5">
          {lightboxVideo ? (
            <>
              <DialogTitle className="sr-only">
                {language === "hb"
                  ? lightboxVideo.titleHe
                  : lightboxVideo.title}
              </DialogTitle>
              {isYouTubeUrl(lightboxVideo.videoUrl) ? (
                <div
                  className="relative w-full overflow-hidden rounded-md"
                  style={{ aspectRatio: "16/9" }}
                >
                  <iframe
                    key={lightboxVideo.id}
                    ref={lightboxIframeRef}
                    src={
                      getYouTubeEmbedUrl(
                        lightboxVideo.videoUrl,
                        true,
                        false
                      ) ?? undefined
                    }
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={
                      language === "hb"
                        ? lightboxVideo.titleHe
                        : lightboxVideo.title
                    }
                  />
                </div>
              ) : (
                <div
                  className="relative w-full overflow-hidden rounded-md bg-black"
                  style={{ aspectRatio: "16/9" }}
                >
                  <video
                    key={lightboxVideo.id}
                    ref={lightboxVideoRef}
                    className={`absolute inset-0 h-full w-full rounded-md bg-black ${portfolioMediaFitClass(lightboxIsReel)}`}
                    controls
                    playsInline
                    autoPlay
                    src={lightboxVideo.videoUrl}
                    onLoadedMetadata={(event) => {
                      const el = event.currentTarget;
                      setLightboxIsReel(
                        isVerticalReelDimensions(el.videoWidth, el.videoHeight)
                      );
                    }}
                  >
                    <source
                      src={lightboxVideo.videoUrl}
                      type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"
                    />
                    <source src={lightboxVideo.videoUrl} type="video/mp4" />
                  </video>
                </div>
              )}
              <p className="truncate text-center text-sm text-muted-foreground">
                {language === "hb"
                  ? lightboxVideo.titleHe
                  : lightboxVideo.title}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
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
    onVideoReady,
    onVideoRef,
    shouldStartPlaying,
    isYouTube = false,
    expandLabel,
    onOpenBigScreen,
  }: {
    video: PortfolioVideo;
    index: number;
    language: string;
    isPlaying: boolean;
    isLoaded: boolean;
    onVideoClick: () => void;
    onVideoReady: () => void;
    onVideoRef: (ref: HTMLVideoElement | null) => void;
    shouldStartPlaying: boolean;
    isYouTube?: boolean;
    expandLabel: string;
    onOpenBigScreen: () => void;
  }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const previewVideoRef = useRef<HTMLVideoElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const videoHasThumbnail = hasThumbnail(video);
    const usesThumbnailPreview = shouldUseThumbnailPreview(video);
    const isMobile = useIsMobile();
    // Use the isYouTube prop if provided, otherwise check from video URL
    const isYouTubeVideo = isYouTube !== undefined ? isYouTube : isYouTubeUrl(video.videoUrl);
    const [isReel, setIsReel] = useState(() => isUploadedReelVideo(video));
    const [youtubePlaying, setYoutubePlaying] = useState(false);
    // YouTube videos start unmuted (volume enabled by default)
    const youtubeThumbnailUrl = isYouTubeVideo
      ? video.thumbnailUrl || getYouTubeThumbnail(video.videoUrl)
      : undefined;
    const youtubeEmbedUrl = isYouTubeVideo && youtubePlaying
      ? getYouTubeEmbedUrl(video.videoUrl, true, false)
      : null;
    const mediaFitClass = portfolioMediaFitClass(isReel);

    useEffect(() => {
      setIsReel(isUploadedReelVideo(video));
    }, [video.id, video.videoUrl, video.videoWidth, video.videoHeight]);

    const syncReelFromVideo = useCallback((el: HTMLVideoElement) => {
      if (isYouTubeVideo || !el.videoWidth || !el.videoHeight) return;
      setIsReel(isVerticalReelDimensions(el.videoWidth, el.videoHeight));
    }, [isYouTubeVideo]);

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
      if (!videoRef.current || !hasLoaded || usesThumbnailPreview) return;

      const videoElement = videoRef.current;
      videoElement.muted = true;

      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("Autoplay prevented - tap to play:", err);
          });
      }
    }, [hasLoaded, usesThumbnailPreview]);

    // Store ref for parent component
    useEffect(() => {
      if (videoRef.current) {
        onVideoRef(videoRef.current);
      }
    }, [onVideoRef]);

    useEffect(() => {
      if (shouldStartPlaying && hasLoaded && !videoError) {
        onVideoReady();
      }
    }, [hasLoaded, onVideoReady, shouldStartPlaying, videoError]);

    const seekPreviewVideo = () => {
      const previewVideo = previewVideoRef.current;

      if (!previewVideo || videoHasThumbnail) {
        return;
      }

      const previewTime = Math.min(0.5, Math.max(previewVideo.duration * 0.15, 0));

      if (previewTime > 0 && Math.abs(previewVideo.currentTime - previewTime) > 0.05) {
        previewVideo.currentTime = previewTime;
      }
    };

    return (
      <div
        ref={itemRef}
        className="portfolio-item group relative w-full"
        data-video-id={video.id}
      >
        {/* Simple Video Container */}
        <div className={portfolioContainerClass(isReel)}>
          {/* YouTube Video Embed */}
          {isYouTubeVideo ? (
            <div className="relative h-full w-full">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  className="absolute left-0 top-0 h-full w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={language === "hb" ? video.titleHe : video.title}
                />
              ) : youtubeThumbnailUrl ? (
                <img
                  src={youtubeThumbnailUrl}
                  alt={language === "hb" ? video.titleHe : video.title}
                  className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="absolute inset-0 rounded-lg bg-black" />
              )}
              <div 
                className={`absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300 rounded-lg z-10 cursor-pointer ${
                  youtubePlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                onClick={() => {
                  setYoutubePlaying(true);
                }}
              >
                <div className="play-button-overlay rounded-full p-3 md:p-4 group-hover:scale-110 transition-all shadow-lg">
                  <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full">
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
                  className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${mediaFitClass} ${
                    usesThumbnailPreview && !isLoaded
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 cursor-pointer"
                  }`}
                  loop
                  muted
                  playsInline
                  preload={
                    usesThumbnailPreview && videoHasThumbnail ? "auto" : "metadata"
                  }
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
                  onLoadedMetadata={(event) => {
                    console.log("Video metadata loaded:", video.id);
                    syncReelFromVideo(event.currentTarget);
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
                          console.error("Note: Check video hosting quota and CORS settings");
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
                <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black">
                  {videoError ? (
                    <div className="text-center p-4">
                      <Play className="h-12 w-12 text-white/50 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">Video unavailable</p>
                    </div>
                  ) : videoHasThumbnail ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={language === "hb" ? video.titleHe : video.title}
                      className={`w-full h-full ${mediaFitClass}`}
                      loading="lazy"
                    />
                  ) : (
                    <Play className="h-12 w-12 text-white/50" />
                  )}
                </div>
              )}

              {usesThumbnailPreview && !isLoaded && (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={onVideoClick}
                >
                  {videoHasThumbnail ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={language === "hb" ? video.titleHe : video.title}
                      className={`w-full h-full ${mediaFitClass}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <video
                      ref={previewVideoRef}
                      src={video.videoUrl}
                      className={`w-full h-full ${mediaFitClass}`}
                      muted
                      playsInline
                      preload="metadata"
                      controls={false}
                      onLoadedMetadata={(event) => {
                        syncReelFromVideo(event.currentTarget);
                        seekPreviewVideo();
                      }}
                      onLoadedData={(e) => {
                        e.currentTarget.pause();
                        seekPreviewVideo();
                      }}
                      onSeeked={(e) => {
                        e.currentTarget.pause();
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="play-button-overlay rounded-full p-3 md:p-4 group-hover:scale-110 transition-all shadow-lg">
                      <Play className="h-6 w-6 fill-white text-white md:h-8 md:w-8" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PortfolioSection;
