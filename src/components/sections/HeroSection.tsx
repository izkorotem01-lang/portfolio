import React, { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX } from "lucide-react";
import showreelVideo from "@/assets/Showreel.mp4";

const HeroSection = () => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const scrollToPortfolio = () => {
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      // Restart video from beginning
      videoRef.current.currentTime = 0;
      videoRef.current.play();

      // Toggle volume
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.7; // Set volume to 70%
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  return (
    <section id="hero" className="min-h-screen relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div
            className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-0
           pb-20"
          >
            {/* Content Section - Left */}
            <div className="text-center lg:text-left">
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
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-up"
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

            {/* Video Section - Right */}
            <div className="flex justify-center lg:justify-end animate-fade-up">
              <div className="relative">
                {/* Full-height container for vertical video */}
                <div className="rounded-3xl mx-auto bg-black/20 border border-white/10 backdrop-blur-xl max-w-[420px] lg:max-w-[520px] w-full">
                  <div
                    className="relative group cursor-pointer"
                    onClick={handleVideoClick}
                  >
                    <video
                      ref={videoRef}
                      src={showreelVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-[80vh] max-h-[calc(100vh-200px)] rounded-2xl shadow-2xl aspect-[9/16] object-cover transition-transform group-hover:scale-105"
                    />

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
