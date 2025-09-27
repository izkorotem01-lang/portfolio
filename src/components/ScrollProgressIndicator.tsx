import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ScrollProgressIndicator = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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

      // Calculate which step should be active based on scroll position
      const stepIndex = Math.floor(progress * steps.length);
      setActiveStep(Math.min(stepIndex, steps.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 w-0.5 h-full">
          <div className="w-full h-full bg-white/20"></div>
          <div
            className="absolute top-0 left-0 w-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center transition-all duration-500 ${
                index <= activeStep ? "opacity-100" : "opacity-30"
              }`}
            >
              {/* Step Circle */}
              <div
                className={`relative z-10 w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                  index < activeStep
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500"
                    : index === activeStep
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-lg shadow-purple-500/50"
                    : "bg-transparent border-white/30"
                }`}
              >
                {index < activeStep && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="ml-6 min-w-0 flex-1">
                <div
                  className={`text-sm font-semibold transition-all duration-500 ${
                    index <= activeStep ? "text-white/90" : "text-white/40"
                  }`}
                >
                  Step {index + 1}
                </div>
                <div
                  className={`text-xs transition-all duration-500 mt-1 ${
                    index <= activeStep ? "text-white/70" : "text-white/30"
                  }`}
                >
                  {language === "he" ? step.hebrew : step.english}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollProgressIndicator;
