import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Play,
  Volume2,
  VolumeX,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import showreelVideo from "@/assets/Showreel.mp4";
import showreelVideoYT from "@/assets/Showreel_YT.mp4";

const HeroSection = () => {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);
  const [customDomainRetry, setCustomDomainRetry] = useState(0);

  const scrollToPortfolio = () => {
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle video loading on component mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Check if we're on the custom domain and adjust loading strategy
      const isCustomDomain = window.location.hostname === 'rotemizko.com';
      console.log('Custom domain detected:', isCustomDomain);
      
      if (isCustomDomain) {
        // For custom domain, try a different approach
        video.crossOrigin = 'anonymous';
        video.referrerPolicy = 'no-referrer';
        
        // Add a small delay for custom domain
        setTimeout(() => {
          video.load();
        }, 100);
      } else {
        // For Cloudflare Pages subdomain, load immediately
        video.load();
      }

      // Set up additional error handling
      const handleError = () => {
        console.error("Video failed to load, retrying...");
        setVideoError(true);
        setTimeout(() => {
          video.load();
          setVideoError(false);
        }, 3000);
      };

      video.addEventListener("error", handleError);

      return () => {
        video.removeEventListener("error", handleError);
      };
    }
  }, []);

  const handleVideoClick = () => {
    // Hide overlays after first tap (especially for mobile)
    setShowOverlays(false);

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
                className="text-xl md:text-2xl text-foreground/95 mb-6 leading-relaxed animate-fade-up drop-shadow-md"
                style={{ animationDelay: "0.4s" }}
              >
                {t("hero.subtitle")}
              </p>

              {/* Social Links */}
              <div
                className={`flex justify-center mb-8 animate-fade-up ${
                  language === "he" ? "space-x-reverse space-x-6" : "space-x-6"
                }`}
                style={{ animationDelay: "0.5s" }}
              >
                <a
                  href="https://www.instagram.com/rotemizko_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://www.youtube.com/@RoTeMIZKo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
                  aria-label="YouTube"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@rotem.izko?_t=ZS-904z3ZuyO0d&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:scale-110 transform"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.392-2.085-1.392-3.338h-3.067v14.829c0 1.673-1.357 3.029-3.029 3.029s-3.029-1.357-3.029-3.029 1.357-3.029 3.029-3.029c.314 0 .617.048.9.138V9.851c-.282-.04-.57-.061-.862-.061C5.46 9.79 2 13.25 2 17.581S5.46 25.371 9.791 25.371s7.791-3.46 7.791-7.791V9.094a9.965 9.965 0 005.233 1.442V7.469c-.884 0-1.723-.203-2.494-.537z" />
                  </svg>
                </a>
              </div>

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
                    <video
                      ref={videoRef}
                      src={useFallbackVideo ? showreelVideo : showreelVideoYT}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300 h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] aspect-video hidden md:block"
                      onError={(e) => {
                        console.error("Video loading error:", e);
                        console.error("Error details:", e.nativeEvent);
                        console.error("Current domain:", window.location.hostname);
                        setVideoError(true);
                        setVideoLoading(false);

                        // Check if it's a blocked resource error
                        if (e.nativeEvent?.type === "error") {
                          console.log(
                            "Attempting fallback to regular video..."
                          );
                          setUseFallbackVideo(true);
                        }

                        // For custom domain, try different loading approach
                        if (window.location.hostname === 'rotemizko.com') {
                          console.log("Custom domain error - trying alternative loading...");
                          setCustomDomainRetry(prev => prev + 1);
                          
                          if (customDomainRetry < 3) {
                            setTimeout(() => {
                              const video = e.target as HTMLVideoElement;
                              // Try different loading strategies
                              if (customDomainRetry === 0) {
                                // First retry: change attributes
                                video.crossOrigin = 'use-credentials';
                                video.referrerPolicy = 'strict-origin-when-cross-origin';
                              } else if (customDomainRetry === 1) {
                                // Second retry: remove and recreate element
                                const parent = video.parentNode;
                                const newVideo = video.cloneNode(true) as HTMLVideoElement;
                                newVideo.crossOrigin = 'anonymous';
                                newVideo.referrerPolicy = 'no-referrer';
                                parent?.replaceChild(newVideo, video);
                              } else {
                                // Third retry: try fallback video
                                setUseFallbackVideo(true);
                              }
                              video.load();
                            }, 1000 + (customDomainRetry * 500));
                          } else {
                            // After 3 retries, show error with manual retry option
                            console.log("Custom domain: Max retries reached");
                          }
                        } else {
                          // Standard retry for subdomain
                          setTimeout(() => {
                            const video = e.target as HTMLVideoElement;
                            video.load();
                          }, 2000);
                        }
                      }}
                      onLoadStart={() => {
                        console.log("Video loading started");
                        console.log("Video source URL:", showreelVideoYT);
                        console.log(
                          "Current domain:",
                          window.location.hostname
                        );
                        setVideoLoading(true);
                        setVideoError(false);
                      }}
                      onCanPlay={() => {
                        console.log("Video can play");
                        setVideoLoading(false);
                        setVideoError(false);
                      }}
                      onLoadedData={() => {
                        console.log("Video data loaded");
                        setVideoLoading(false);
                      }}
                    />
                    {/* Small screens: Normal version (9:16) */}
                    <video
                      ref={mobileVideoRef}
                      src={showreelVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full rounded-2xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-300 h-[80vh] max-h-[calc(100vh-150px)] aspect-[9/16] block md:hidden max-w-[480px] mx-auto"
                    />

                    {/* Volume indicator overlay */}
                    <div
                      className={`absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-opacity ${
                        showOverlays
                          ? "group-hover:opacity-100 opacity-0 md:opacity-0"
                          : "opacity-0"
                      }`}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Loading indicator */}
                    {videoLoading && (
                      <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      </div>
                    )}

                    {/* Error state */}
                    {videoError && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-2">⚠️</div>
                          <p className="text-sm mb-4">Video loading failed</p>
                          <button
                            onClick={() => {
                              setVideoError(false);
                              setVideoLoading(true);
                              setUseFallbackVideo(!useFallbackVideo);
                              const video = videoRef.current;
                              if (video) {
                                video.load();
                              }
                            }}
                            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm hover:bg-white/30 transition-colors"
                          >
                            {useFallbackVideo
                              ? "Try YT Version"
                              : "Try Regular Version"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Click to play/restart overlay */}
                    <div
                      className={`absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center transition-opacity ${
                        showOverlays && !videoLoading && !videoError
                          ? "group-hover:opacity-100 opacity-0 md:opacity-0"
                          : "opacity-0"
                      }`}
                    >
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
