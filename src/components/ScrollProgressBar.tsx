import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Initial calculation
    updateScrollProgress();

    // Add scroll event listener
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Background track with video editor styling */}
      <div className="h-1 bg-black/30 backdrop-blur-sm border-t border-white/10">
        {/* Progress bar with video editing tool styling */}
        <div
          className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transition-all duration-150 ease-out relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/60 via-orange-500/60 to-yellow-500/60 blur-sm" />
          
          {/* Main progress line */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          
          {/* Animated shimmer effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              transform: 'translateX(-100%)'
            }}
          />
          
          {/* Timeline ticks for video editor feel */}
          <div className="absolute inset-0 flex items-center">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="h-full w-px bg-white/20 animate-timeline-tick"
                style={{
                  left: `${i * 5}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          {/* Playhead indicator (like in video editors) */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-orange-500 animate-pulse-glow">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
          </div>
        </div>
      </div>
      
      {/* Additional UI elements for video editing aesthetic */}
      <div className="absolute bottom-1 left-4 flex items-center space-x-2 text-xs text-white/70 font-mono">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 font-semibold">REC</span>
        </div>
        <div className="text-white/40">|</div>
        <div className="font-mono text-orange-400">
          {Math.round(scrollProgress)}%
        </div>
        <div className="text-white/40">|</div>
        <div className="text-white/50">
          SCROLL
        </div>
      </div>
      
      {/* Time indicator (simulating video timeline) */}
      <div className="absolute bottom-1 right-4 text-xs text-white/70 font-mono">
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-orange-400">
            00:{String(Math.round(scrollProgress * 0.6)).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
