import React, { useState, useEffect, useMemo } from "react";

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  // Define the sections with useMemo to prevent re-creation on every render
  const sections = useMemo(
    () => [
      { id: "hero", name: "Introduction", color: "#ef4444" },
      { id: "reviews", name: "Reviews", color: "#8b5cf6" },
      { id: "about", name: "About", color: "#3b82f6" },
      { id: "portfolio", name: "Portfolio", color: "#10b981" },
      { id: "packages", name: "Packages", color: "#f59e0b" },
      { id: "contact", name: "Contact", color: "#06b6d4" },
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
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Video Editing Timeline Container */}
      <div className="bg-gray-900/98 backdrop-blur-sm border-t border-gray-600/50 shadow-2xl">
        {/* Top Bars - Site Sections */}
        <div className="h-6 bg-gray-800/90 relative px-2 py-1">
          {/* Hero Section */}
          <div
            className="absolute left-[1%] w-[18%] h-4 bg-gradient-to-r from-orange-600 to-red-600 rounded border border-orange-500 flex items-center justify-center shadow-sm shadow-orange-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
            onClick={() => scrollToSection("hero")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              Introduction
            </span>
          </div>

          {/* Reviews Section */}
          <div
            className="absolute left-[20%] w-[18%] h-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded border border-purple-500 flex items-center justify-center shadow-sm shadow-purple-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200"
            onClick={() => scrollToSection("reviews")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              Reviews
            </span>
          </div>

          {/* About Section (Combined with Services) */}
          <div
            className="absolute left-[39%] w-[18%] h-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded border border-blue-500 flex items-center justify-center shadow-sm shadow-blue-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
            onClick={() => scrollToSection("about")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              About
            </span>
          </div>

          {/* Portfolio Section */}
          <div
            className="absolute left-[58%] w-[18%] h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded border border-orange-400 flex items-center justify-center shadow-sm shadow-orange-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
            onClick={() => scrollToSection("portfolio")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              Portfolio
            </span>
          </div>

          {/* Packages Section */}
          <div
            className="absolute left-[77%] w-[11%] h-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded border border-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-200"
            onClick={() => scrollToSection("packages")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              Packages
            </span>
          </div>

          {/* Contact Section */}
          <div
            className="absolute left-[89%] w-[10%] h-4 bg-gradient-to-r from-teal-600 to-green-600 rounded border border-teal-500 flex items-center justify-center shadow-sm shadow-teal-500/30 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-teal-500/40 transition-all duration-200"
            onClick={() => scrollToSection("contact")}
          >
            <span className="text-xs text-white font-semibold tracking-wide">
              Contact
            </span>
          </div>
        </div>

        {/* Timeline Grid Lines */}
        <div
          className={`h-5 bg-gray-800/90 relative cursor-pointer select-none ${
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
            className="absolute -top-2 bottom-0 w-1 bg-cyan-500 z-10 pointer-events-none shadow-lg shadow-cyan-500/50"
            style={{ left: `${scrollProgress}%` }}
          >
            {/* House-shaped Pin Marker with pointy head pointing up */}
            <div
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-500 shadow-lg shadow-cyan-500/50"
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 40%, 50% 100%, 0% 40%)",
              }}
            />
          </div>
          {/* V1 Track - Rose Red */}
          <div className="h-4 bg-gray-700/30 border-b border-gray-600/20 flex items-center">
            <div className="w-6 h-3 bg-cyan-500/90 rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white font-bold">V1</span>
            </div>
            <div className="flex-1 h-3 bg-rose-500/90 rounded-sm ml-1"></div>
          </div>

          {/* A1 Track - Teal */}
          <div className="h-4 bg-gray-700/30 flex items-center">
            <div className="w-6 h-3 bg-cyan-500/90 rounded-sm flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white font-bold">A1</span>
            </div>
            <div className="flex-1 h-3 bg-teal-500/90 rounded-sm ml-1 relative overflow-hidden">
              {/* Extremely dense waveform - 2000 lines */}
              {Array.from({ length: 2000 }, (_, i) => {
                // Complex static pattern for realistic waveform
                const normalizedPos = i / 1999;
                const wave1 = Math.sin(normalizedPos * Math.PI * 20) * 0.3;
                const wave2 = Math.sin(normalizedPos * Math.PI * 35) * 0.2;
                const wave3 = Math.sin(normalizedPos * Math.PI * 8) * 0.1;
                const height = Math.max(0.02, wave1 + wave2 + wave3 + 0.5);
                const left = (i / 1999) * 100;
                return (
                  <div
                    key={i}
                    className="absolute bg-white w-px"
                    style={{
                      height: `${height * 100}%`,
                      left: `${left}%`,
                      top: `${(1 - height) * 50}%`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Timeline grid markers */}
          <div className="absolute inset-0 flex pointer-events-none">
            {Array.from({ length: 18 }, (_, i) => (
              <div
                key={i}
                className="h-full w-px bg-gray-500/30"
                style={{ left: `${i * 5.55}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
