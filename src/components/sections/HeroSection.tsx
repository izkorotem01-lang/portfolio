import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX } from "lucide-react";
import { videoUrls } from "@/lib/firebase";
import { firebaseVideoService } from "@/lib/firebaseService";

const HeroSection = () => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoUrls, setVideoUrls] = useState({
    showreel: "",
    showreelYT: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const scrollToPortfolio = () => {
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Load video URLs from Firebase Storage
  useEffect(() => {
    const loadVideoUrls = async () => {
      try {
        setIsLoading(true);

        // Use actual Firebase paths with correct filenames
        const showreelUrl = await firebaseVideoService.getVideoUrl(
          "videos/Showreel.mp4"
        );
        const showreelYTUrl = await firebaseVideoService.getVideoUrl(
          "videos/Showreel_YT.mp4"
        );

        setVideoUrls({
          showreel: showreelUrl,
          showreelYT: showreelYTUrl,
        });
      } catch (error) {
        console.error("Error loading video URLs:", error);
        // Fallback to local videos if Firebase fails
        setVideoUrls({
          showreel: "/src/assets/Showreel.mp4",
          showreelYT: "/src/assets/Showreel_YT.mp4",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoUrls();
  }, []);

  const handleVideoClick = () => {
    // Get the active video element (YT version for large screens, normal version for small screens)
    const activeVideo =
      window.innerWidth >= 768 ? videoRef.current : mobileVideoRef.current;

    if (activeVideo) {
      // Restart video from beginning
      activeVideo.currentTime = 0;
      activeVideo.play();

      // Toggle volume
      if (isMuted) {
        activeVideo.muted = false;
        activeVideo.volume = 0.7;
        setIsMuted(false);
      } else {
        activeVideo.muted = true;
        setIsMuted(true);
      }

      // Scroll to video - center between top of screen and progress bar
      setTimeout(() => {
        const videoElement = activeVideo;
        if (!videoElement) return;

        const videoRect = videoElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progressBarHeight = 80; // Approximate height of progress bar
        const availableHeight = windowHeight - progressBarHeight;

        // Calculate where the video should be positioned (center of available space)
        const targetTop = (availableHeight - videoRect.height) / 2;

        // Get current scroll position and video's current position
        const currentScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const videoCurrentTop = videoRect.top + currentScrollTop;

        // Calculate the scroll position needed to center the video
        const targetScrollTop = videoCurrentTop - targetTop;

        window.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      }, 100); // Small delay to ensure video is ready
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center min-h-screen pt-16 md:pt-20 lg:pt-24 pb-20">
            {/* Content Section - Top */}
            <div className="text-center mb-8 md:mb-12">
              {/* Main Title */}
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-up"
                style={{
                  animationDelay: "0.2s",
                  filter: "drop-shadow(0 4px 5px rgba(0, 0, 0, 0.6))",
                }}
              >
                {t("hero.name")}
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl text-foreground/95 mb-8 leading-relaxed animate-fade-up drop-shadow-md"
                style={{ animationDelay: "0.4s" }}
              >
                {t("hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
                style={{ animationDelay: "0.6s" }}
              >
                <Button onClick={scrollToPortfolio} className="btn-hero group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {t("hero.cta")}
                </Button>

                <Button
                  onClick={scrollToContact}
                  variant="outline"
                  className="btn-glass text-lg px-8 py-4 backdrop-blur-md"
                >
                  {t("contact.title")}
                </Button>
              </div>
            </div>

            {/* Video Section - Bottom */}
            <div className="flex justify-center w-full max-w-7xl animate-fade-up">
              <div className="relative">
                {/* Video container */}
                <div className="rounded-3xl mx-auto bg-black/20 border border-white/10 backdrop-blur-xl w-full">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleVideoClick}
                  >
                    {/* Large screens: YT version (16:9) */}
                    {!isLoading && videoUrls.showreelYT && (
                      <video
                        ref={videoRef}
                        src={videoUrls.showreelYT}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300 h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] aspect-video hidden md:block"
                      />
                    )}
                    {/* Small screens: Normal version (9:16) */}
                    {!isLoading && videoUrls.showreel && (
                      <video
                        ref={mobileVideoRef}
                        src={videoUrls.showreel}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300 h-[80vh] max-h-[calc(100vh-150px)] aspect-[9/16] block md:hidden max-w-[480px] mx-auto"
                      />
                    )}
                    {/* Loading placeholder */}
                    {isLoading && (
                      <div className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] aspect-video hidden md:block bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-foreground/60">Loading video...</p>
                        </div>
                      </div>
                    )}

                    {/* Volume indicator overlay */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-opacity group-hover:opacity-100 opacity-0">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Click to play/restart overlay */}
                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center transition-opacity group-hover:opacity-100 opacity-0">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements around video */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/30 rounded-full animate-float backdrop-blur-sm" />
                <div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary-glow/40 rounded-full animate-float backdrop-blur-sm"
                  style={{ animationDelay: "2s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
