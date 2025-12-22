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
  const [finalContactBorderProgress, setFinalContactBorderProgress] =
    useState(0);

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
              } else {
                // Animation completed, set final state permanently
                setContactBorderProgress(100);
                setFinalContactBorderProgress(100);
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
          // Don't reset border progress - keep it filled once animated
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
      <div
        className={`fixed top-1/2 transform -translate-y-1/2 z-10 hidden 2xl:block ${
          language === "he" ? "right-6" : "left-6"
        }`}
      >
        <div className="relative scale-75 2xl:scale-90">
          {/* Animated Background Blur */}
          <div className="absolute inset-0 -m-4 rounded-2xl backdrop-blur-sm bg-black/2"></div>

          {/* Main Connecting Line - Background */}
          <div
            className={`absolute top-0 w-px h-full ${
              language === "he" ? "right-4" : "left-4"
            }`}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
          </div>

          {/* Progressive Connecting Line */}
          <div
            className={`absolute top-0 w-px h-full ${
              language === "he" ? "right-4" : "left-4"
            }`}
          >
            <div
              className="w-full bg-gradient-to-b from-purple-400/30 via-pink-500/30 to-cyan-400/30 transition-all duration-1000 ease-out"
              style={{ height: `${scrollProgress * 100}%` }}
            ></div>
          </div>

          {/* Steps with Enhanced Design */}
          <div className="space-y-4 2xl:space-y-6 relative z-10">
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
                        backdrop-blur-md bg-transparent border-transparent rounded-xl p-1.5 2xl:p-3 transition-all duration-700 ease-out relative z-10
                        ${
                          isActive
                            ? "bg-transparent border-transparent"
                            : "group-hover:bg-transparent group-hover:border-transparent"
                        }
                      `}
                    >
                      {/* Floating animation effect - removed for full transparency */}

                      {/* Step title */}
                      <div className="flex items-center gap-1.5 2xl:gap-2 mb-0.5 2xl:mb-1 relative z-10">
                        <div
                          className={`text-[10px] 2xl:text-xs font-bold transition-all duration-500 ${
                            index <= activeStep ? "text-white" : "text-white"
                          } group-hover:text-white`}
                        >
                          Step {index + 1}
                        </div>
                      </div>

                      {/* Step description */}
                      <div
                        className={`text-[9px] 2xl:text-[10px] font-medium transition-all duration-500 leading-tight 2xl:leading-relaxed relative z-10 ${
                          index <= activeStep ? "text-white" : "text-white"
                        } group-hover:text-white`}
                      >
                        {language === "he" ? step.hebrew : step.english}
                      </div>
                    </div>

                    {/* Individual Connecting Line to Next Step */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-full w-px h-4 2xl:h-6 transform -translate-x-1/2 ${
                          language === "he" ? "right-4" : "left-4"
                        }`}
                      >
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
        <div
          className={`fixed z-10 hidden 2xl:block pointer-events-none ${
            language === "he" ? "right-6" : "left-6"
          }`}
        >
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
      {hasAnimatedContact && (
        <div
          id="contact-border-highlight"
          className="fixed inset-0 pointer-events-none z-5"
          style={{
            opacity: 1,
          }}
        >
          <style>
            {`
               @property --contact-angle {
                 syntax: "<angle>";
                 initial-value: 0deg;
                 inherits: false;
               }
               
               #contact > div > div > .glass-card {
                 position: relative !important;
                 background: rgba(0, 0, 0, 0.7) !important;
                 border: none !important;
                 border-radius: 24px !important;
                 box-shadow: 0 0 40px rgba(168, 85, 247, 0.4),
                            0 0 60px rgba(236, 72, 153, 0.3) !important;
               }
               
               #contact > div > div > .glass-card::after,
               #contact > div > div > .glass-card::before {
                 content: '';
                 position: absolute;
                 inset: -3px;
                 background: conic-gradient(
                   from var(--contact-angle), 
                   #a855f7, 
                   #ec4899, 
                   #22d3ee, 
                   #a855f7
                 );
                 border-radius: 27px;
                 z-index: -1;
                 mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                 -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                 mask-composite: xor;
                 -webkit-mask-composite: xor;
                 padding: 3px;
                 animation: ${
                   hasAnimatedContact
                     ? "contactSpin 3s linear infinite"
                     : "none"
                 };
               }
               
               #contact > div > div > .glass-card::before {
                 filter: blur(1.5rem);
                 opacity: 0.5;
               }
               
               @keyframes contactSpin {
                 from { --contact-angle: 0deg; }
                 to { --contact-angle: 360deg; }
               }
               
               #contact .glass-card:not(#contact > div > div > .glass-card) {
                 box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(236, 72, 153, 0.2) !important;
               }
               
               #contact .glass-card:not(#contact > div > div > .glass-card):hover {
                 box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(236, 72, 153, 0.3) !important;
               }
             `}
          </style>
        </div>
      )}
    </>
  );
};

export default ScrollProgressIndicator;
