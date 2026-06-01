import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX, Instagram, Youtube } from "lucide-react";
import showreelVideo from "@/assets/Showreel.mp4";
import iconNoBg from "@/assets/icon-nobg.png";
import HeroBlendHeadline from "@/components/HeroBlendHeadline";

const SHOWREEL_WIDTH =
  "w-[min(88vw,20rem)] sm:w-72 md:w-80 lg:w-[22rem] xl:w-96";

const HeroSection = () => {
  const { t, language, dir } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollToPortfolio = () => {
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isCustomDomain = window.location.hostname === "rotemizko.com";
    if (isCustomDomain) {
      video.crossOrigin = "anonymous";
      setTimeout(() => video.load(), 100);
    } else {
      video.load();
    }

    const handleError = () => {
      setVideoError(true);
      setTimeout(() => {
        video.load();
        setVideoError(false);
      }, 3000);
    };

    video.addEventListener("error", handleError);
    return () => video.removeEventListener("error", handleError);
  }, []);

  const handleVideoClick = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setIsPlaying(false);
      setShowOverlays(true);
    } else {
      try {
        await video.play();
        setIsPlaying(true);
        setShowOverlays(false);
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }

    if (isMuted) {
      video.muted = false;
      video.volume = 0.7;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }

    setTimeout(() => {
      const videoRect = video.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progressBarHeight = 80;
      const availableHeight = windowHeight - progressBarHeight;
      const targetTop = (availableHeight - videoRect.height) / 2;
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const videoCurrentTop = videoRect.top + currentScrollTop;
      const targetScrollTop = videoCurrentTop - targetTop;

      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }, 100);
  };

  const socialLinks = (
    <div
      className={`flex gap-5 ${
        language === "he" ? "flex-row-reverse justify-end" : ""
      }`}
    >
      <a
        href="https://www.instagram.com/rotemizko_/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/80 hover:text-primary transition-colors"
        aria-label="Instagram"
      >
        <Instagram className="w-5 h-5" />
      </a>
      <a
        href="https://www.youtube.com/@RoTeMIZKo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/80 hover:text-primary transition-colors"
        aria-label="YouTube"
      >
        <Youtube className="w-5 h-5" />
      </a>
      <a
        href="https://www.tiktok.com/@rotem.izko?_t=ZS-904z3ZuyO0d&_r=1"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/80 hover:text-primary transition-colors"
        aria-label="TikTok"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.392-2.085-1.392-3.338h-3.067v14.829c0 1.673-1.357 3.029-3.029 3.029s-3.029-1.357-3.029-3.029 1.357-3.029 3.029-3.029c.314 0 .617.048.9.138V9.851c-.282-.04-.57-.061-.862-.061C5.46 9.79 2 13.25 2 17.581S5.46 25.371 9.791 25.371s7.791-3.46 7.791-7.791V9.094a9.965 9.965 0 005.233 1.442V7.469c-.884 0-1.723-.203-2.494-.537z" />
        </svg>
      </a>
    </div>
  );

  return (
    <section
      id="hero"
      className="relative z-10 min-h-screen overflow-x-clip overflow-y-visible pt-2 pb-16 md:pt-5 md:pb-20 lg:overflow-x-visible"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6 xl:gap-5">
          {/* Typography + CTAs */}
          <div className="hero-text-column relative z-20 flex flex-col items-center text-center lg:items-start lg:text-start">
            <p className="hero-subtitle mb-6 w-full max-w-[95vw] text-center font-semibold uppercase leading-snug tracking-wide text-foreground/90 sm:max-w-full md:mb-8 lg:mt-0 lg:text-start">
              {t("hero.subtitle")}
            </p>

            <HeroBlendHeadline />

            <div
              className={`mb-6 flex justify-center md:mb-8 ${
                dir === "rtl" ? "md:justify-end" : "md:justify-start"
              }`}
            >
              {socialLinks}
            </div>

            <div
              className={`hidden flex-wrap gap-3 md:flex md:justify-start ${
                dir === "rtl" ? "md:justify-end" : ""
              }`}
            >
              <Button onClick={scrollToPortfolio} className="btn-hero group">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform ltr:mr-2 rtl:ml-2" />
                {t("hero.cta")}
              </Button>
              <Button
                onClick={scrollToContact}
                variant="outline"
                className="btn-glass px-6 py-3 text-base"
              >
                {t("contact.title")}
              </Button>
            </div>
          </div>

          {/* Portrait showreel — same 9:16 format on all breakpoints */}
          <div className="flex justify-center lg:items-start lg:justify-end">
            <div className={`relative ${SHOWREEL_WIDTH}`}>
              <div
                className={`brand-video-frame hero-showreel-frame relative aspect-[9/16] cursor-pointer bg-black ${SHOWREEL_WIDTH}`}
                onClick={handleVideoClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleVideoClick();
                  }
                }}
                aria-label={
                  language === "he" ? "לחץ כדי לצפות בשואוריל" : "Play showreel"
                }
              >
                <span className="hero-handle hero-handle-tl" />
                <span className="hero-handle hero-handle-tr" />
                <span className="hero-handle hero-handle-bl" />
                <span className="hero-handle hero-handle-br" />
                <span className="hero-handle hero-handle-t" />
                <span className="hero-handle hero-handle-b" />

                <div className="absolute inset-[3px] overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    src={showreelVideo}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onError={() => {
                      setVideoError(true);
                      setVideoLoading(false);
                    }}
                    onLoadStart={() => {
                      setVideoLoading(true);
                      setVideoError(false);
                    }}
                    onCanPlay={() => {
                      setVideoLoading(false);
                      setVideoError(false);
                    }}
                    onLoadedData={() => setVideoLoading(false)}
                  />

                  {!isPlaying && (
                    <>
                      <div
                        className="pointer-events-none absolute inset-0 flex items-center justify-center"
                        aria-hidden
                      >
                        <div
                          className="h-48 w-48 rounded-full opacity-90 blur-xl"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(10,20,60,0.85) 0%, transparent 70%)",
                          }}
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <img
                          src={iconNoBg}
                          alt=""
                          className="mb-4 h-28 w-auto object-contain opacity-95"
                          style={{
                            filter:
                              "drop-shadow(0 10px 18px rgba(10,20,60,0.65))",
                          }}
                        />
                        <p className="text-sm font-semibold text-white drop-shadow-lg">
                          {language === "he"
                            ? "לחץ כדי לצפות"
                            : "Click to Play"}
                        </p>
                      </div>
                    </>
                  )}

                  <div
                    className={`absolute right-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur-sm transition-opacity ${
                      showOverlays ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {videoLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </div>
                  )}

                  {videoError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center text-white">
                      <p className="mb-3 text-sm">Video loading failed</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoError(false);
                          setVideoLoading(true);
                          videoRef.current?.load();
                        }}
                        className="rounded-full bg-white/20 px-4 py-2 text-sm hover:bg-white/30"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
