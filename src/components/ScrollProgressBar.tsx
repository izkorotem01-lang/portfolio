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
      {/* Main timeline container - much thicker like video editing software */}
      <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50">
        {/* Time markers at the top */}
        <div className="h-6 flex items-center justify-between px-4 text-xs text-gray-400 font-mono">
          <div className="flex space-x-8">
            <span>00:00:00:00</span>
            <span>00:00:05:00</span>
            <span>00:00:10:00</span>
            <span>00:00:15:00</span>
            <span>00:00:20:00</span>
          </div>
          <div className="text-orange-400 font-semibold">
            {Math.round(scrollProgress * 0.6)}:00
          </div>
        </div>
        
        {/* Main timeline track - thick like audio/video tracks */}
        <div className="h-12 bg-gray-800/80 border-t border-gray-700/30 relative">
          {/* Progress bar - thick and prominent */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 transition-all duration-150 ease-out relative overflow-hidden"
            style={{ width: `${scrollProgress}%` }}
          >
            {/* Waveform-like pattern inside the progress bar */}
            <div className="absolute inset-0 flex items-center px-2">
              {Array.from({ length: 40 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white/40 rounded-sm animate-waveform-pulse"
                  style={{
                    width: '2px',
                    height: `${Math.random() * 20 + 10}px`,
                    marginRight: '2px',
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: 'shimmer 3s ease-in-out infinite',
                transform: 'translateX(-100%)'
              }}
            />
            
            {/* Timeline grid lines */}
            <div className="absolute inset-0 flex">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="h-full w-px bg-white/10"
                  style={{ left: `${i * 5}%` }}
                />
              ))}
            </div>
          </div>
          
          {/* Playhead - thick vertical line like in video editors */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-blue-400 shadow-lg animate-playhead-glow"
            style={{ left: `${scrollProgress}%` }}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-sm transform rotate-45" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-sm transform rotate-45" />
            {/* Glowing center line */}
            <div className="absolute inset-0 bg-cyan-300/50 blur-sm" />
          </div>
        </div>
        
        {/* Track labels and controls */}
        <div className="h-8 bg-gray-900/90 border-t border-gray-700/30 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold">REC</span>
            </div>
            <div className="text-gray-500">|</div>
            <div className="text-blue-400">
              SCROLL TRACK
            </div>
            <div className="text-gray-500">|</div>
            <div className="text-orange-400">
              {Math.round(scrollProgress)}%
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-400">
              {Math.round(scrollProgress * 0.6)}:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressBar;
