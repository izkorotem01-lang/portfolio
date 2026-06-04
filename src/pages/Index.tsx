import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import IntroZone from "@/components/IntroZone";
import { IntroHighlightsProvider } from "@/contexts/IntroHighlightsContext";
import IntroHighlightsScrollLayout from "@/components/highlights/IntroHighlightsScrollLayout";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="relative z-10 min-h-screen bg-transparent">
        {/* <Header /> */}
        <main>
          <IntroZone>
            <IntroHighlightsProvider>
              <IntroHighlightsScrollLayout />
            </IntroHighlightsProvider>
          </IntroZone>
          <AboutSection />
          <ServicesSection />
          <PortfolioSection />
          <PackagesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
