import React, { useState, useEffect, useMemo } from "react";

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const [sectionSizes, setSectionSizes] = useState<
    { id: string; percentage: number; startPos: number }[]
  >([]);

  // Define the sections with useMemo to prevent re-creation on every render
  const sections = useMemo(
    () => [
      { id: "reviews", name: "Reviews", color: "hsl(192 60% 42%)" },
      { id: "about", name: "About", color: "hsl(192 70% 48%)" },
      { id: "portfolio", name: "Portfolio", color: "hsl(192 80% 52%)" },
      { id: "packages", name: "Packages", color: "hsl(16 85% 52%)" },
      { id: "contact", name: "Contact", color: "hsl(192 100% 50%)" },
    ],
    []
  );

  // Handle section navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle timeline dragging
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const targetProgress = Math.max(0, Math.min(100, clickPosition * 100));

    // Calculate target scroll position
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = (targetProgress / 100) * docHeight;

    // Scroll to position
    window.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  // Calculate section sizes based on actual DOM heights
  useEffect(() => {
    const calculateSectionSizes = () => {
      const sectionHeights: { id: string; height: number }[] = [];

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          sectionHeights.push({
            id: section.id,
            height: element.offsetHeight,
          });
        }
      });

      // Calculate percentages and start positions with padding
      const totalHeight = sectionHeights.reduce((sum, s) => sum + s.height, 0);
      const gapPercentage = 0.5; // 0.5% gap between sections
      const totalGaps = (sections.length - 1) * gapPercentage;
      const availableWidth = 100 - totalGaps;

      let currentPos = 0;
      const sizes = sectionHeights.map((section, index) => {
        const percentage = (section.height / totalHeight) * availableWidth;
        const startPos = currentPos;
        currentPos += percentage + gapPercentage;
        return {
          id: section.id,
          percentage,
          startPos,
        };
      });

      setSectionSizes(sizes);
    };

    // Calculate on mount and when window resizes
    calculateSectionSizes();
    window.addEventListener("resize", calculateSectionSizes);
    window.addEventListener("load", calculateSectionSizes);

    // Also recalculate after delays to ensure all content is loaded (images, videos, etc.)
    const timeout1 = setTimeout(calculateSectionSizes, 500);
    const timeout2 = setTimeout(calculateSectionSizes, 1500);

    return () => {
      window.removeEventListener("resize", calculateSectionSizes);
      window.removeEventListener("load", calculateSectionSizes);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [sections]);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const totalProgress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, totalProgress)));

      // Calculate current section
      const sectionSize = 100 / sections.length;
      const currentSectionIndex = Math.min(
        Math.floor(totalProgress / sectionSize),
        sections.length - 1
      );
      setCurrentSection(currentSectionIndex);
    };

    // Initial calculation
    updateScrollProgress();

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [sections]);

  // Handle window resize for dynamic grid lines
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Try to find the timeline element first, then fallback to the grid area
        let timelineElement = document.querySelector(
          "[data-timeline]"
        ) as HTMLElement;

        if (!timelineElement) {
          // If no timeline element found, use the grid area as reference
          timelineElement = document.querySelector(
            ".h-5.bg-gray-800\\/90"
          ) as HTMLElement;
        }

        if (timelineElement) {
          const rect = timelineElement.getBoundingClientRect();
          const clickPosition = (e.clientX - rect.left) / rect.width;
          const targetProgress = Math.max(
            0,
            Math.min(100, clickPosition * 100)
          );

          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const targetScrollTop = (targetProgress / 100) * docHeight;

          window.scrollTo({
            top: targetScrollTop,
            behavior: "auto",
          });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Calculate dynamic grid lines based on screen width
  const calculateGridLines = useMemo(() => {
    const screenWidth = windowWidth;

    // Adaptive interval based on screen width
    let interval;
    if (screenWidth < 768) {
      interval = 80; // Larger intervals for mobile
    } else if (screenWidth < 1200) {
      interval = 60; // Medium intervals for tablet
    } else {
      interval = 50; // Smaller intervals for desktop
    }

    const totalLines = Math.floor(screenWidth / interval);
    const majorLineInterval = Math.max(1, Math.floor(totalLines / 8)); // Every ~8th line is major

    console.log("Grid calculation:", {
      screenWidth,
      interval,
      totalLines,
      majorLineInterval,
    });

    return { totalLines, majorLineInterval, interval };
  }, [windowWidth]);

  const { totalLines, majorLineInterval } = calculateGridLines;

  // Generate dynamic time markers (excluding first and last)
  const timeMarkers = useMemo(() => {
    const markers = [];
    for (
      let i = majorLineInterval;
      i < totalLines - majorLineInterval;
      i += majorLineInterval
    ) {
      const seconds = Math.floor((i / totalLines) * 10) + 5; // Scale to 5-15 seconds
      markers.push({
        time: `00:00:${seconds.toString().padStart(2, "0")}:00`,
        position: i,
      });
    }
    return markers;
  }, [totalLines, majorLineInterval]);

  return (
    <div
      dir="ltr"
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
    >
      {/* Video Editing Timeline Container — slim, recedes until hover */}
      <div className="bg-gray-900/75 backdrop-blur-md border-t border-white/5 shadow-2xl opacity-65 hover:opacity-100 transition-opacity duration-300">
        {/* Top Bars - Site Sections */}
        <div className="h-5 bg-gray-800/50 relative px-2 py-1">
          {sectionSizes.length > 0 &&
            sections.map((section, index) => {
              const sizeData = sectionSizes.find((s) => s.id === section.id);
              if (!sizeData) return null;

              // Define gradient colors for each section
              // Muted, on-brand timeline: cyan for most sections, a single
              // orange anchor on Packages (the conversion block).
              const cyanBar =
                "from-brand-cyan/80 to-brand-cyan/45 border-brand-cyan/40 shadow-brand-cyan/20 hover:shadow-brand-cyan/30";
              const orangeBar =
                "from-brand-orange/80 to-brand-orange/45 border-brand-orange/40 shadow-brand-orange/20 hover:shadow-brand-orange/30";
              const gradientColors: Record<string, string> = {
                hero: cyanBar,
                reviews: cyanBar,
                about: cyanBar,
                portfolio: cyanBar,
                packages: orangeBar,
                contact: cyanBar,
              };

              return (
                <div
                  key={section.id}
                  className={`absolute h-3 sm:h-3.5 bg-gradient-to-r rounded border flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ${
                    gradientColors[section.id]
                  }`}
                  style={{
                    left: `${sizeData.startPos}%`,
                    width: `${sizeData.percentage}%`,
                  }}
                  onClick={() => scrollToSection(section.id)}
                >
                  <span className="text-[9px] sm:text-xs md:text-sm text-white font-semibold tracking-wide px-1 sm:px-1.5 whitespace-nowrap">
                    {section.name}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Timeline Grid Lines — hidden for a calmer, premium strip */}
        <div
          className={`hidden h-5 bg-gray-800/90 relative cursor-pointer select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Time Labels above longer lines */}
          <div className="absolute top-0 w-full px-4">
            {timeMarkers.map((marker, i) => {
              const pos = (marker.position / (totalLines - 1)) * 100;
              return (
                <span
                  key={i}
                  className="text-xs text-white font-mono absolute -top-1"
                  style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                >
                  {marker.time}
                </span>
              );
            })}
          </div>

          {/* Vertical tick marks */}
          <div className="absolute inset-0 w-full px-4">
            {Array.from({ length: totalLines }, (_, i) => {
              const pos = (i / (totalLines - 1)) * 100;
              const isLonger = i % majorLineInterval === 0;

              return (
                <div
                  key={i}
                  className={`bg-white/60 absolute ${
                    isLonger ? "w-0.5 h-3 mt-1.5" : "w-px h-2 mt-2"
                  }`}
                  style={{
                    left: `${pos}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Main Timeline Tracks */}
        <div
          data-timeline
          className={`bg-gray-800/90 relative cursor-pointer select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Pin Line - Cyan vertical line that follows scroll progress */}
          <div
            className="absolute -top-2 bottom-0 w-1 bg-brand-cyan z-10 pointer-events-none shadow-lg shadow-brand-cyan/50 shadow-[0_0_14px_hsl(16_100%_55%/0.55)]"
            style={{ left: `${scrollProgress}%` }}
          >
            {/* House-shaped Pin Marker with pointy head pointing up */}
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-brand-cyan shadow-lg shadow-brand-cyan/50 shadow-[0_0_12px_hsl(16_100%_55%/0.65)]"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 50% 100%, 0% 40%)",
              }}
            />
          </div>
          {/* Single slim progress track — cyan fill to the playhead */}
          <div className="h-2.5 bg-gray-700/30 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-cyan/40 via-brand-orange/25 to-brand-orange/15 pointer-events-none"
              style={{ width: `${scrollProgress}%` }}
            />
            {/* Subtle grid markers */}
            <div className="absolute inset-0 flex pointer-events-none">
              {Array.from({ length: 18 }, (_, i) => (
                <div
                  key={i}
                  className="h-full w-px bg-white/10"
                  style={{ left: `${i * 5.55}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
