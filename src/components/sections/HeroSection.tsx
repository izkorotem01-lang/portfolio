import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Play, ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToPortfolio = () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 46, 0.8), rgba(15, 52, 96, 0.6)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-primary-glow/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-primary-glow/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent animate-fade-up">
            {t('hero.name')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              onClick={scrollToPortfolio}
              className="btn-hero group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {t('hero.cta')}
            </Button>
            
            <Button 
              onClick={scrollToContact}
              variant="outline"
              className="btn-glass text-lg px-8 py-4"
            >
              {t('contact.title')}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/20 pointer-events-none" />
    </section>
  );
};

export default HeroSection;