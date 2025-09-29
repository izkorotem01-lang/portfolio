import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Function to handle video click - restart video and toggle mute
  const handleVideoClick = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (video) {
      // Always restart the video from the beginning
      video.currentTime = 0;

      if (playingVideoId === videoId) {
        // If clicking the same video, toggle mute
        video.muted = !video.muted;
        if (video.muted) {
          setPlayingVideoId(null);
        } else {
          video.play().catch(console.error);
        }
      } else {
        // If clicking a different video, mute all others and unmute this one
        Object.values(videoRefs.current).forEach((v) => {
          if (v) v.muted = true;
        });

        video.muted = false;
        video.play().catch(console.error);
        setPlayingVideoId(videoId);
      }
    }
  };

  // Function to register video ref
  const registerVideoRef = (videoId: string, ref: HTMLVideoElement | null) => {
    videoRefs.current[videoId] = ref;
  };

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredVideos.map((video, index) => (
                    <SimpleVideoItem
                      key={video.id}
                      video={video}
                      index={index}
                      language={language}
                      isPlaying={playingVideoId === video.id}
                      onVideoClick={() => handleVideoClick(video.id)}
                      onVideoRef={(ref) => registerVideoRef(video.id, ref)}
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
const SimpleVideoItem = ({
  video,
  index,
  language,
  isPlaying,
  onVideoClick,
  onVideoRef,
}: {
  video: PortfolioVideo;
  index: number;
  language: string;
  isPlaying: boolean;
  onVideoClick: () => void;
  onVideoRef: (ref: HTMLVideoElement | null) => void;
}) => {
  return (
    <div className="portfolio-item group relative">
      {/* Simple Video Container */}
      <div className="relative bg-gradient-secondary/20 overflow-hidden aspect-video w-full h-[35vh] sm:h-[60vh] shadow-lg">
        <video
          ref={onVideoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover cursor-pointer"
          loop
          muted
          autoPlay
          playsInline
          onClick={onVideoClick}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default PortfolioSection;
