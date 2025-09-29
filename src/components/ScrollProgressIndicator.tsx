import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ScrollProgressIndicator = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInContactSection, setIsInContactSection] = useState(false);
  const [contactProgress, setContactProgress] = useState(0);
  const [contactBorderProgress, setContactBorderProgress] = useState(0);
  const [hasAnimatedContact, setHasAnimatedContact] = useState(false);

  const steps = [
    {
      hebrew: "קריאייטיב ותכנון",
      english: "Creative & Planning",
      icon: "💡",
    },
    {
      hebrew: "הפקה וצילום",
      english: "Production & Filming",
      icon: "🎬",
    },
    {
      hebrew: "עריכה ופוסט פרודקשן",
      english: "Editing & Post-Production",
      icon: "✂️",
    },
    {
      hebrew: "הפצה ושיווק",
      english: "Distribution & Marketing",
      icon: "📢",
    },
    {
      hebrew: "מעקב ביצועים",
      english: "Performance Tracking",
      icon: "📊",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      // Check if we're in the contact section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        const isInContact = rect.top <= window.innerHeight / 2;
        setIsInContactSection(isInContact);

        if (isInContact) {
          // Calculate progress within contact section
          const contactHeight = rect.height;
          const visiblePortion = Math.min(
            window.innerHeight - rect.top,
            contactHeight
          );
          const progressInContact = Math.max(
            0,
            Math.min(100, (visiblePortion / contactHeight) * 100)
          );
          setContactProgress(progressInContact);
          // Keep steps at final state when in contact
          setActiveStep(steps.length - 1);
          setScrollProgress(1);

          // Start border animation if not already animated
          if (!hasAnimatedContact) {
            setHasAnimatedContact(true);
            // Animate border from 0 to 100 over 1 second
            const startTime = Date.now();
            const animateBorder = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / 1000, 1); // 1 second duration
              setContactBorderProgress(progress * 100);

              if (progress < 1) {
                requestAnimationFrame(animateBorder);
              }
            };
            requestAnimationFrame(animateBorder);
          }
        } else {
          // Normal progress calculation when not in contact
          const stepIndex = Math.floor(progress * steps.length);
          setActiveStep(Math.min(stepIndex, steps.length - 1));
          setScrollProgress(progress);
          setContactProgress(0);
          setContactBorderProgress(0);
        }
      } else {
        // Fallback to normal behavior
        const stepIndex = Math.floor(progress * steps.length);
        setActiveStep(Math.min(stepIndex, steps.length - 1));
        setScrollProgress(progress);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [steps.length]);

  return (
    <>
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="relative">
          {/* Animated Background Blur */}
          <div className="absolute inset-0 -m-6 rounded-2xl backdrop-blur-sm bg-black/2"></div>

          {/* Main Connecting Line - Background */}
          <div className="absolute left-4 top-0 w-px h-full">
            <div className="w-full h-full bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
          </div>

          {/* Progressive Connecting Line */}
          <div className="absolute left-4 top-0 w-px h-full">
            <div
              className="w-full bg-gradient-to-b from-purple-400/30 via-pink-500/30 to-cyan-400/30 transition-all duration-1000 ease-out"
              style={{ height: `${scrollProgress * 100}%` }}
            ></div>
          </div>

          {/* Steps with Enhanced Design */}
          <div className="space-y-10 relative z-10">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPassed = index < activeStep;
              const opacity = index <= activeStep ? "opacity-90" : "opacity-50";

              // Calculate progress for each step
              const totalSteps = steps.length;
              const progressPerStep = 100 / totalSteps;
              const currentProgress = scrollProgress * 100;

              let stepProgress = 0;
              if (isPassed) {
                stepProgress = 100; // Completed steps are 100% filled
              } else if (isActive) {
                // Current step progress based on scroll within this step's range
                const stepStart = index * progressPerStep;
                const stepEnd = (index + 1) * progressPerStep;
                const progressInStep = Math.max(
                  0,
                  Math.min(
                    100,
                    ((currentProgress - stepStart) / (stepEnd - stepStart)) *
                      100
                  )
                );
                stepProgress = progressInStep;
              } else {
                stepProgress = 0; // Future steps are 0% filled
              }

              return (
                <div
                  key={index}
                  className={`group transition-all duration-700 ease-out transform ${
                    isActive ? "scale-105" : "scale-100"
                  } ${opacity} hover:opacity-100 hover:scale-105`}
                  style={{
                    transform: `translateX(${
                      isActive ? "-2px" : "0px"
                    }) scale(${isActive ? "1.02" : "1"})`,
                    filter: `blur(${index > activeStep ? "0.3px" : "0px"})`,
                  }}
                >
                  {/* Step Content Card with Progress Border */}
                  <div className="relative">
                    {/* Progress Border - SVG Stroke Only */}
                    <div className="absolute -inset-0.5 rounded-xl pointer-events-none">
                      <svg
                        className="w-full h-full"
                        style={{ position: "absolute", top: 0, left: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id={`border-gradient-${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#22d3ee" />
                          </linearGradient>
                        </defs>

                        {/* Background border */}
                        <rect
                          x="1"
                          y="1"
                          width="calc(100% - 2px)"
                          height="calc(100% - 2px)"
                          rx="12"
                          ry="12"
                          stroke="rgba(255, 255, 255, 0.3)"
                          strokeWidth="2"
                          fill="transparent"
                          style={{
                            filter:
                              "drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))",
                          }}
                        />

                        {/* Progress border */}
                        {stepProgress > 0 && (
                          <rect
                            x="1"
                            y="1"
                            width="calc(100% - 2px)"
                            height="calc(100% - 2px)"
                            rx="12"
                            ry="12"
                            stroke={`url(#border-gradient-${index})`}
                            strokeWidth="2"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray="800"
                            strokeDashoffset={`${
                              800 * (1 - stepProgress / 100)
                            }`}
                            className="transition-all duration-500 ease-out"
                            style={{
                              filter:
                                "drop-shadow(0 0 8px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.6))",
                            }}
                          />
                        )}
                      </svg>
                    </div>

                    {/* Step Content Card */}
                    <div
                      className={`
                        backdrop-blur-md bg-transparent border-transparent rounded-xl p-4 transition-all duration-700 ease-out relative z-10
                        ${
                          isActive
                            ? "bg-transparent border-transparent"
                            : "group-hover:bg-transparent group-hover:border-transparent"
                        }
                      `}
                    >
                      {/* Floating animation effect - removed for full transparency */}

                      {/* Step title */}
                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <div
                          className={`text-sm font-bold transition-all duration-500 ${
                            index <= activeStep ? "text-white" : "text-white"
                          } group-hover:text-white`}
                        >
                          Step {index + 1}
                        </div>
                      </div>

                      {/* Step description */}
                      <div
                        className={`text-xs font-medium transition-all duration-500 leading-relaxed relative z-10 ${
                          index <= activeStep ? "text-white" : "text-white"
                        } group-hover:text-white`}
                      >
                        {language === "he" ? step.hebrew : step.english}
                      </div>
                    </div>

                    {/* Individual Connecting Line to Next Step */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-4 top-full w-px h-10 transform -translate-x-1/2">
                        {/* Background line */}
                        <div className="w-full h-full bg-white/5"></div>
                        {/* Progress line */}
                        <div
                          className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-400/40 to-pink-500/40 transition-all duration-500"
                          style={{
                            height: isPassed
                              ? "100%"
                              : isActive
                              ? `${stepProgress}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ambient background effects */}
          <div className="absolute inset-0 -m-12 pointer-events-none">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/3 via-pink-500/3 to-cyan-500/3 blur-2xl"
                style={{
                  top: `${30 + i * 35}%`,
                  left: `${-5 + Math.sin(Date.now() / 3000 + i) * 8}%`,
                  transform: `scale(${
                    0.6 + Math.sin(Date.now() / 4000 + i * 2) * 0.2
                  })`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Extension Line to Contact Section */}
      {isInContactSection && (
        <div className="fixed left-6 z-10 hidden lg:block pointer-events-none">
          <div
            className="w-px bg-gradient-to-b from-purple-400/50 via-pink-500/50 to-cyan-400/50 transition-all duration-1000"
            style={{
              top: "50vh",
              height: `${Math.min(contactProgress * 2, 100)}vh`,
            }}
          ></div>
        </div>
      )}

      {/* Contact Section Border Highlight */}
      {isInContactSection && (
        <div
          id="contact-border-highlight"
          className="fixed inset-0 pointer-events-none z-5"
          style={{
            opacity: Math.min(contactProgress / 50, 1),
          }}
        >
          <style>
            {`
               #contact > div > div > .glass-card {
                 position: relative !important;
                 background: rgba(0, 0, 0, 0.7) !important;
                 border: none !important;
                 border-radius: 24px !important;
                 box-shadow: 0 0 ${Math.min(
                   contactProgress / 2,
                   40
                 )}px rgba(168, 85, 247, 0.${Math.min(
              contactProgress / 3,
              30
            )}),
                            0 0 ${Math.min(
                              contactProgress,
                              60
                            )}px rgba(236, 72, 153, 0.${Math.min(
              contactProgress / 4,
              20
            )}) !important;
               }
               
               #contact > div > div > .glass-card::before {
                 content: '';
                 position: absolute;
                 inset: 0px;
                 pointer-events: none;
                 border-radius: 24px;
                 background: url("data:image/svg+xml,${encodeURIComponent(`
                   <svg width="100%" height="100%" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                     <defs>
                       <linearGradient id="contact-border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                         <stop offset="0%" style="stop-color:#a855f7"/>
                         <stop offset="50%" style="stop-color:#ec4899"/>
                         <stop offset="100%" style="stop-color:#22d3ee"/>
                       </linearGradient>
                     </defs>
                     <rect x="0.5" y="0.5" width="399" height="199" rx="7" ry="7" 
                           fill="transparent" 
                           stroke="rgba(255, 255, 255, 0.3)" 
                           stroke-width="1"
                           filter="drop-shadow(0 0 2px rgba(255, 255, 255, 0.1))"/>
                     <rect x="0.5" y="0.5" width="399" height="199" rx="7" ry="7" 
                           fill="transparent" 
                           stroke="url(#contact-border-gradient)" 
                           stroke-width="1"
                           stroke-dasharray="${(399 + 199) * 2}"
                           stroke-dashoffset="${
                             (399 + 199) * 2 * (1 - contactBorderProgress / 100)
                           }"
                           filter="drop-shadow(0 0 8px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.6))"
                           style="transition: stroke-dashoffset 0.1s ease-out;"/>
                   </svg>
                 `)}")} center/100% 100% no-repeat;
                 z-index: -1;
               }
             `}
          </style>
        </div>
      )}
    </>
  );
};

export default ScrollProgressIndicator;
