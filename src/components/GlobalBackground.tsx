import React, { useEffect, useRef, useState } from "react";

const SNAKE_PATH =
  "M 920 0 C 780 180, 620 320, 720 520 C 820 720, 480 680, 380 880 " +
  "C 280 1080, 520 1180, 640 1380 C 760 1580, 420 1680, 320 1880 " +
  "C 220 2080, 480 2280, 560 2480 C 640 2680, 360 2880, 280 3100";

const GlobalBackground = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const [isMobileLite, setIsMobileLite] = useState(false);

  useEffect(() => {
    const liteQuery = window.matchMedia("(max-width: 1023px)");
    const setLite = () => setIsMobileLite(liteQuery.matches);
    setLite();
    liteQuery.addEventListener("change", setLite);
    return () => liteQuery.removeEventListener("change", setLite);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const track = trackRef.current;
    if (!track) return;

    const applyTrackHeight = () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight * 2.5
      );
      track.style.height = `${docHeight + window.innerHeight}px`;
    };

    const applyScroll = () => {
      const y = reduceMotionRef.current ? 0 : scrollYRef.current;
      track.style.transform = `translate3d(0, ${-y}px, 0)`;
    };

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const setMotion = () => {
      reduceMotionRef.current = motionQuery.matches;
      if (reduceMotionRef.current) {
        scrollYRef.current = 0;
      } else {
        scrollYRef.current = window.scrollY;
      }
      applyScroll();
    };

    let rafId = 0;
    const tick = () => {
      applyScroll();
      rafId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      applyTrackHeight();
      scrollYRef.current = window.scrollY;
      applyScroll();
    };

    setMotion();
    scrollYRef.current = window.scrollY;
    applyTrackHeight();
    applyScroll();

    motionQuery.addEventListener("change", setMotion);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    const observer = new ResizeObserver(() => {
      applyTrackHeight();
    });
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(rafId);
      motionQuery.removeEventListener("change", setMotion);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="site-background fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <div ref={trackRef} className="site-background__track">
        <div className="site-background__mesh" />
        <div className="site-background__blobs" />
        <div className="site-background__snake-wrap">
          <svg
            className={`site-background__snake ${
              isMobileLite ? "site-background__snake--lite" : ""
            }`}
            viewBox="0 0 1000 3200"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient
                id="site-snake-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="hsl(320 100% 58% / 0)" />
                <stop offset="10%" stopColor="hsl(320 100% 58% / 0.55)" />
                <stop offset="50%" stopColor="hsl(300 100% 55% / 0.6)" />
                <stop offset="90%" stopColor="hsl(285 90% 52% / 0.5)" />
                <stop offset="100%" stopColor="hsl(285 90% 52% / 0)" />
              </linearGradient>
              {!isMobileLite && (
                <>
                  <filter
                    id="site-snake-glow"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                  >
                    <feGaussianBlur
                      in="SourceGraphic"
                      stdDeviation="22"
                    />
                  </filter>
                  <filter
                    id="site-snake-soft"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                  >
                    <feGaussianBlur
                      in="SourceGraphic"
                      stdDeviation="10"
                    />
                  </filter>
                </>
              )}
            </defs>
            {isMobileLite ? (
              <path
                d={SNAKE_PATH}
                fill="none"
                stroke="url(#site-snake-gradient)"
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
            ) : (
              <>
                <path
                  d={SNAKE_PATH}
                  fill="none"
                  stroke="url(#site-snake-gradient)"
                  strokeWidth="72"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.28"
                  filter="url(#site-snake-glow)"
                />
                <path
                  d={SNAKE_PATH}
                  fill="none"
                  stroke="url(#site-snake-gradient)"
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  filter="url(#site-snake-soft)"
                />
                <path
                  d={SNAKE_PATH}
                  fill="none"
                  stroke="url(#site-snake-gradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
              </>
            )}
          </svg>
        </div>
      </div>
      <div className="site-background__grain" />
    </div>
  );
};

export default GlobalBackground;
