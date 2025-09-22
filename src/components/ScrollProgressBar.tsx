import React, { useState, useEffect, useMemo } from "react";

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Define the sections with useMemo to prevent re-creation on every render
  const sections = useMemo(
    () => [
      { id: "hero", name: "Introduction", color: "#ef4444" },
      { id: "services", name: "Reviews", color: "#8b5cf6" },
      { id: "about", name: "About", color: "#3b82f6" },
      { id: "portfolio", name: "Portfolio", color: "#10b981" },
      { id: "packages", name: "Packages", color: "#f59e0b" },
      { id: "contact", name: "Contact", color: "#06b6d4" },
    ],
    []
  );

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

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const timelineElement = document.querySelector(
          "[data-timeline]"
        ) as HTMLElement;
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

  // Generate time markers (5-14 seconds)
  const timeMarkers = Array.from({ length: 10 }, (_, i) => {
    const seconds = i + 5;
    return `00:00:${seconds.toString().padStart(2, "0")}:00`;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Video Editing Timeline Container */}
      <div className="bg-gray-900/98 backdrop-blur-sm border-t border-gray-600/50 shadow-2xl">
        {/* Time Markers Row */}
        <div className="h-3 flex items-center justify-between px-4 text-xs text-gray-200 font-mono border-b border-gray-600/40 bg-gray-800/80">
          <div className="flex-1 flex justify-between items-center">
            {timeMarkers.map((time, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-gray-300 font-semibold">
                  {time}
                </span>
                <div className="w-px h-1 bg-gray-500/60 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Timeline Tracks */}
        <div
          data-timeline
          className={`bg-gray-800/90 border-t border-gray-600/40 relative cursor-pointer select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Track 3 - Purple Track */}
          <div className="h-5 bg-gray-700/30 border-b border-gray-600/20 relative flex items-center px-2">
            <div className="absolute left-[20%] w-[70%] h-4 bg-purple-500/90 rounded-sm flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-600/80 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">fx</span>
                </div>
                <span className="text-xs text-white font-semibold">
                  Adjustment Layer
                </span>
              </div>
            </div>
          </div>

          {/* Track 5 - Light Blue Audio Track */}
          <div className="h-5 bg-gray-700/30 border-b border-gray-600/20 relative flex items-center px-2">
            {/* Audio Section 1 */}
            <div className="absolute left-[5%] w-16 h-4 bg-cyan-500/90 rounded-sm flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">fx</span>
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-1 h-4 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-0.5 h-2 bg-cyan-300/80 rounded-sm"></div>
                </div>
              </div>
              <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-bold">fx</span>
              </div>
            </div>

            {/* Audio Section 2 */}
            <div className="absolute left-[25%] w-12 h-4 bg-cyan-500/90 rounded-sm flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">fx</span>
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-1.5 h-3 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-0.5 h-4 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-1 h-2 bg-cyan-300/80 rounded-sm"></div>
                </div>
              </div>
              <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-bold">fx</span>
              </div>
            </div>

            {/* Audio Section 3 */}
            <div className="absolute left-[40%] w-20 h-4 bg-cyan-500/90 rounded-sm flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">fx</span>
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-0.5 h-3 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-1 h-4 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-1.5 h-3 bg-cyan-300/80 rounded-sm"></div>
                </div>
              </div>
              <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-bold">fx</span>
              </div>
            </div>

            {/* Audio Section 4 */}
            <div className="absolute left-[65%] w-14 h-4 bg-cyan-500/90 rounded-sm flex items-center justify-between px-1">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">fx</span>
                </div>
                <div className="flex space-x-0.5">
                  <div className="w-1 h-4 bg-cyan-300/80 rounded-sm"></div>
                  <div className="w-0.5 h-2 bg-cyan-300/80 rounded-sm"></div>
                </div>
              </div>
              <div className="w-2 h-2 bg-cyan-600/80 rounded-sm flex items-center justify-center">
                <span className="text-xs text-white font-bold">fx</span>
              </div>
            </div>
          </div>

          {/* Track 7 - Green Track */}
          <div className="h-4 bg-gray-700/30 relative flex items-center px-2">
            <div className="absolute left-[15%] w-[70%] h-3 bg-green-500/90 rounded-sm"></div>
          </div>

          {/* Global Playhead */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-blue-400 shadow-lg z-20"
            style={{ left: `${scrollProgress}%` }}
          >
            {/* Playhead top marker */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-400 rounded-sm transform rotate-45" />
            {/* Playhead bottom marker */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-sm transform rotate-45" />
            {/* Glowing center line */}
            <div className="absolute inset-0 bg-blue-300/50 blur-sm" />
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

        {/* Timeline Controls Footer */}
        <div className="h-3 bg-gray-900/95 border-t border-gray-600/40 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4 text-xs text-gray-300 font-mono">
            <span className="text-blue-400 font-semibold">PORTFOLIO TRACK</span>
            <div className="text-gray-500">|</div>
            <span className="text-cyan-400 font-semibold">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span className="text-cyan-400 font-semibold">
              {timeMarkers[Math.floor(scrollProgress / 11.11)] || "00:00:05:00"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
