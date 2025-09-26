import React from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <LanguageProvider>
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main>
        <HeroSection />
        <ReviewsSection />
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
