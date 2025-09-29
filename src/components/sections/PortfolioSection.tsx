import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVideoControl } from "@/contexts/VideoControlContext";
import { Play, ExternalLink, Volume2, VolumeX } from "lucide-react";
import {
  getCategories,
  getVideos,
  PortfolioCategory,
  PortfolioVideo,
} from "@/lib/portfolioService";
import VideoControls from "@/components/VideoControls";
import OptimizedVideo from "@/components/OptimizedVideo";

const PortfolioSection = () => {
  const { t, language } = useLanguage();
  const {
    setGlobalVideos,
    setCategoryVideos,
    playingVideoId,
    registerVideoRef,
    unregisterVideoRef,
  } = useVideoControl();

  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const [categoriesData, videosData] = await Promise.all([
          getCategories(),
          getVideos(),
        ]);
        setCategories(categoriesData);
        setVideos(videosData);

        // Set global videos for all work control
        setGlobalVideos(videosData);

        // Set category videos for each category
        categoriesData.forEach((category) => {
          const categoryVideos = videosData.filter(
            (video) => video.categoryId === category.id
          );
          setCategoryVideos(category.id, categoryVideos);
        });
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, [setGlobalVideos, setCategoryVideos]);

  // Create display categories with "All Work" option
  const displayCategories = [
    { id: "all", label: "All Work" },
    ...categories.map((cat) => ({
      id: cat.id,
      label: language === "he" ? cat.nameHe : cat.name,
    })),
  ];

  // Filter videos based on active category
  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((video) => video.categoryId === activeCategory);

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

            {/* Video Controls */}
            <div className="mb-8">
              <VideoControls
                categoryId={
                  activeCategory === "all" ? undefined : activeCategory
                }
                showGlobalControls={activeCategory === "all"}
                className="bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-border/30"
              />
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video, index) => (
                  <OptimizedVideoItem
                    key={video.id}
                    video={video}
                    index={index}
                    language={language}
                    playingVideoId={playingVideoId}
                    registerVideoRef={registerVideoRef}
                    unregisterVideoRef={unregisterVideoRef}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Optimized Video Item Component
const OptimizedVideoItem = ({
  video,
  index,
  language,
  playingVideoId,
  registerVideoRef,
  unregisterVideoRef,
}: {
  video: PortfolioVideo;
  index: number;
  language: string;
  playingVideoId: string | null;
  registerVideoRef: (
    videoId: string,
    ref: React.RefObject<HTMLVideoElement>
  ) => void;
  unregisterVideoRef: (videoId: string) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const isCurrentlyPlaying = playingVideoId === video.id;

  // Register video ref when component mounts
  useEffect(() => {
    registerVideoRef(video.id, videoRef);
    return () => unregisterVideoRef(video.id);
  }, [video.id, registerVideoRef, unregisterVideoRef]);

  // Auto-mute this video when another video starts playing
  useEffect(() => {
    if (playingVideoId && playingVideoId !== video.id && videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [playingVideoId, video.id]);

  // Handle video play/pause based on playingVideoId
  useEffect(() => {
    if (videoRef.current) {
      if (isCurrentlyPlaying) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  }, [isCurrentlyPlaying]);

  const handleVideoClick = () => {
    // Video control is now handled by the VideoControlContext
    console.log(
      "Video clicked:",
      video.id,
      "Currently playing:",
      isCurrentlyPlaying
    );
  };

  return (
    <div
      className={`portfolio-item group animate-fade-up relative transition-all duration-500 ease-in-out ${
        isCurrentlyPlaying ? "scale-105" : "scale-100"
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Optimized Video Container */}
      <div
        className={`relative bg-gradient-secondary/20 overflow-hidden aspect-video w-full h-[80vh] transition-all duration-500 ease-in-out ${
          isCurrentlyPlaying
            ? "shadow-2xl shadow-primary/30 group-hover:scale-110"
            : "shadow-lg group-hover:scale-110"
        }`}
      >
        <OptimizedVideo
          videoUrl={video.videoUrl}
          thumbnailUrl={video.thumbnailUrl}
          title={language === "he" ? video.titleHe : video.title}
          isPlaying={isCurrentlyPlaying}
          onVideoClick={handleVideoClick}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default PortfolioSection;
