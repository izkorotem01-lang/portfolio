import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, ExternalLink, Volume2, VolumeX } from "lucide-react";
import {
  getCategories,
  getVideos,
  PortfolioCategory,
  PortfolioVideo,
} from "@/lib/portfolioService";

const PortfolioSection = () => {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const [categoriesData, videosData] = await Promise.all([
          getCategories(),
          getVideos(),
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
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video, index) => (
                  <VideoItem
                    key={video.id}
                    video={video}
                    index={index}
                    language={language}
                    playingVideoId={playingVideoId}
                    setPlayingVideoId={setPlayingVideoId}
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

// Video Item Component
const VideoItem = ({
  video,
  index,
  language,
  playingVideoId,
  setPlayingVideoId,
}: {
  video: PortfolioVideo;
  index: number;
  language: string;
  playingVideoId: string | null;
  setPlayingVideoId: (id: string | null) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const isCurrentlyPlaying = playingVideoId === video.id;

  // Auto-mute this video when another video starts playing
  useEffect(() => {
    if (playingVideoId && playingVideoId !== video.id && videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [playingVideoId, video.id]);

  // Debug: Log when playing video changes
  useEffect(() => {
    console.log(
      `Video ${video.id} - isCurrentlyPlaying:`,
      isCurrentlyPlaying,
      "playingVideoId:",
      playingVideoId
    );
  }, [isCurrentlyPlaying, playingVideoId, video.id]);

  const handleVideoClick = () => {
    console.log("Video clicked!", {
      isMuted,
      videoRef: videoRef.current,
      isCurrentlyPlaying,
    });

    if (videoRef.current && isMuted) {
      // Unmute this video and mute all others
      console.log("Unmuting video and muting others...");
      setPlayingVideoId(video.id);
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
      console.log("Video unmuted and restarted");
    } else if (videoRef.current) {
      // Mute this video
      console.log("Muting video...");
      setPlayingVideoId(null);
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsMuted(true);
      console.log("Video muted and restarted");
    }
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
      {/* Video/Thumbnail */}
      <div
        className={`relative bg-gradient-secondary/20 overflow-hidden aspect-video w-full h-[80vh] transition-all duration-500 ease-in-out ${
          isCurrentlyPlaying
            ? "shadow-2xl shadow-primary/30 group-hover:scale-110"
            : "shadow-lg group-hover:scale-110"
        }`}
      >
        {video.thumbnailUrl ? (
          <>
            {/* Thumbnail with play overlay */}
            <img
              src={video.thumbnailUrl}
              alt={language === "he" ? video.titleHe : video.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            />
            {/* Play Overlay for thumbnails */}
            <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center glow">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Video without thumbnail - autoplay muted */}
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                onLoadedData={() => {
                  console.log("Video loaded:", video.id, videoRef.current);
                  if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play();
                  }
                }}
                onError={(e) => {
                  console.error("Video error:", e, video.videoUrl);
                }}
                className="w-full h-full object-cover"
                loop
                playsInline
                autoPlay
                muted
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>

              {/* Click area */}
              <div
                className="absolute inset-0 cursor-pointer bg-transparent"
                onClick={handleVideoClick}
                style={{ zIndex: 10 }}
              >
                {/* Volume indicator */}
                <div
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
                  style={{ transform: "scale(1)" }}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioSection;
