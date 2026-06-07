import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteContentProvider } from "@/contexts/SiteContentContext";
import Header from "@/components/Header";
import IntroZone from "@/components/IntroZone";
import { IntroHighlightsProvider } from "@/contexts/IntroHighlightsContext";
import IntroHighlightsScrollLayout from "@/components/highlights/IntroHighlightsScrollLayout";
import AboutSection from "@/components/sections/AboutSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <LanguageProvider>
      <SiteContentProvider>
      <div className="relative z-10 min-h-screen bg-transparent">
        {/* <Header /> */}
        <main>
          <IntroZone>
            <IntroHighlightsProvider>
              <IntroHighlightsScrollLayout />
            </IntroHighlightsProvider>
          </IntroZone>
          <AboutSection />
          <PortfolioSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      </SiteContentProvider>
    </LanguageProvider>
  );
};

export default Index;
