import React, { useState, useEffect, useMemo } from "react";

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Define the sections with useMemo to prevent re-creation on every render
  const sections = useMemo(
    () => [
      { id: "hero", name: "Introduction", color: "from-orange-500 to-red-500" },
      { id: "services", name: "Reviews", color: "from-red-500 to-purple-500" },
      { id: "about", name: "About", color: "from-purple-500 to-blue-500" },
      {
        id: "portfolio",
        name: "Portfolio",
        color: "from-blue-500 to-cyan-500",
      },
      { id: "packages", name: "Packages", color: "from-cyan-500 to-green-500" },
      { id: "contact", name: "Contact", color: "from-green-500 to-orange-500" },
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

      // Calculate section progress linearly based on total scroll
      const newSectionProgress = [0, 0, 0, 0, 0, 0];
      let activeSection = 0;

      // Calculate each section's position relative to total document height
      const sectionSize = 100 / sections.length; // Each section gets equal portion of timeline
      const currentSectionIndex = Math.min(
        Math.floor(totalProgress / sectionSize),
        sections.length - 1
      );

      activeSection = currentSectionIndex;

      // Fill completed sections
      for (let i = 0; i < currentSectionIndex; i++) {
        newSectionProgress[i] = 100;
      }

      // Calculate current section progress
      if (currentSectionIndex < sections.length) {
        const sectionStart = currentSectionIndex * sectionSize;
        const progressInCurrentSection = totalProgress - sectionStart;
        const currentSectionProgress = Math.min(
          100,
          (progressInCurrentSection / sectionSize) * 100
        );
        newSectionProgress[currentSectionIndex] = currentSectionProgress;
      }

      setCurrentSection(activeSection);
      setSectionProgress(newSectionProgress);
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
            behavior: "auto", // Use auto for smoother dragging
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      {/* Video Editing Timeline Container */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50">
        {/* Time Markers Row */}
        <div className="h-6 flex items-center justify-between px-4 text-xs text-gray-400 font-mono border-b border-gray-700/30">
          <div className="flex-1 flex justify-between items-center">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-gray-500">
                  {String(i * 10).padStart(2, "0")}:00
                </span>
                <div className="w-px h-2 bg-gray-600/50 mt-1" />
              </div>
            ))}
          </div>
          <div className="ml-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-semibold">REC</span>
          </div>
        </div>

        {/* Main Timeline Track - Single Progress Bar */}
        <div
          data-timeline
          className={`h-10 bg-gray-800/80 border-t border-gray-700/30 relative cursor-pointer select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Single continuous progress bar */}
          <div
            className="h-full relative overflow-hidden"
            style={{
              width: `${scrollProgress}%`,
              background: `linear-gradient(to right, rgb(240, 123, 0), rgb(217, 47, 15), rgb(147, 0, 97), rgb(32, 0, 155))`,
            }}
          ></div>

          {/* Timeline grid markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="h-full w-px bg-gray-600/20"
                style={{ left: `${i * 5}%` }}
              />
            ))}
          </div>

          {/* Global Playhead */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-orange-400 shadow-lg z-20"
            style={{ left: `${scrollProgress}%` }}
          >
            {/* Playhead top marker */}
            <div className="absolute -top-2 -left-1 w-3 h-3 bg-orange-400 rounded-sm transform rotate-45" />
            {/* Playhead bottom marker */}
            <div className="absolute -bottom-2 -left-1 w-3 h-3 bg-orange-400 rounded-sm transform rotate-45" />
            {/* Glowing center line */}
            <div className="absolute inset-0 bg-orange-300/50 blur-sm animate-playhead-glow" />
          </div>

          {/* Section dividers and labels - Above everything */}
          <div className="absolute inset-0 flex z-30 pointer-events-none">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="h-full flex-1 relative border-r border-gray-600/40 last:border-r-0 flex items-center justify-center"
                style={{ width: `${100 / sections.length}%` }}
              >
                <span
                  className={`text-sm font-mono font-semibold transition-all duration-200 select-none ${
                    currentSection === index
                      ? "text-white drop-shadow-lg font-bold"
                      : "text-gray-300 drop-shadow-md"
                  }`}
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  {section.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Controls Footer */}
        <div className="h-6 bg-gray-900/90 border-t border-gray-700/30 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
            <span className="text-blue-400">PORTFOLIO TRACK</span>
            <div className="text-gray-500">|</div>
            <span className="text-orange-400">
              {Math.round(scrollProgress)}%
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span className="text-orange-400 font-semibold">
              {String(Math.round(scrollProgress * 1.2)).padStart(2, "0")}:00:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
