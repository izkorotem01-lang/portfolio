import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ReviewsSection = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.3; // pixels per frame - slower for smoother movement
    let isPaused = false;

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        scrollContainer.scrollLeft = scrollPosition;

        // Reset position when we've scrolled past all content
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    // Start scrolling
    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const reviews = [
    {
      id: 1,
      name: "Sarah Cohen",
      role: "Marketing Manager",
      company: "TechStart Ltd.",
      rating: 5,
      content:
        "Rotem transformed our social media presence completely. His creative vision and technical expertise are unmatched. Our engagement rates increased by 300%!",
      avatar: "👩‍💼",
    },
    {
      id: 2,
      name: "David Miller",
      role: "Content Creator",
      company: "YouTube Channel",
      rating: 5,
      content:
        "Working with Rotem was a game-changer. He understood my vision perfectly and delivered beyond expectations. The quality and attention to detail are exceptional.",
      avatar: "👨‍🎨",
    },
    {
      id: 3,
      name: "Maya Levi",
      role: "Business Owner",
      company: "Local Restaurant",
      rating: 5,
      content:
        "Professional, creative, and reliable. Rotem helped us create stunning promotional videos that significantly boosted our customer base. Highly recommended!",
      avatar: "👩‍🍳",
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Podcast Host",
      company: "Tech Talks Podcast",
      rating: 5,
      content:
        "Rotem takes podcast editing to the next level. Clean audio, perfect transitions, and engaging visuals. Our listener retention improved dramatically.",
      avatar: "🎙️",
    },
    {
      id: 5,
      name: "Rachel Green",
      role: "Influencer",
      company: "Instagram @lifestyle_rachel",
      rating: 5,
      content:
        "Amazing work! Rotem has an incredible eye for detail and knows exactly what works on social media. My content has never looked better.",
      avatar: "📸",
    },
    {
      id: 6,
      name: "Michael Chen",
      role: "Startup Founder",
      company: "InnovateTech",
      rating: 5,
      content:
        "Rotem helped us create our company introduction video. The result was professional, engaging, and perfectly captured our brand essence.",
      avatar: "🚀",
    },
  ];

  return (
    <section id="reviews" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-primary-glow/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t("reviews.title")}
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              {t("reviews.subtitle")}
            </p>
          </div>

          {/* Auto-scrolling Reviews Carousel */}
          <div className="relative">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-hidden scrollbar-hide py-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Duplicate reviews for seamless loop */}
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 w-80 glass-card p-6 rounded-3xl relative hover:scale-110 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 ease-out cursor-pointer group"
                >
                  {/* Review Content */}
                  <p className="text-foreground/90 mb-6 leading-relaxed text-sm group-hover:text-foreground transition-colors duration-300">
                    "{review.content}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl group-hover:bg-primary/30 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
                        {review.name}
                      </h4>
                      <p className="text-xs text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300">
                        {review.role}
                      </p>
                      <p className="text-xs text-primary group-hover:text-primary-glow transition-colors duration-300">
                        {review.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {t("reviews.cta.title")}
              </h3>
              <p className="text-foreground/80 mb-6">
                {t("reviews.cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="btn-hero inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("reviews.cta.contact")}
                </a>
                <a
                  href="#portfolio"
                  className="btn-glass inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector("#portfolio")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {t("reviews.cta.portfolio")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
