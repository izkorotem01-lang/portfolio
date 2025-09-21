import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Award, Video, Zap } from 'lucide-react';

const AboutSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Video, number: '500+', label: 'Videos Edited' },
    { icon: User, number: '100+', label: 'Happy Clients' },
    { icon: Award, number: '3+', label: 'Years Experience' },
    { icon: Zap, number: '24/7', label: 'Support' },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t('about.title')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="glass-card p-8 rounded-3xl">
              <p className="text-lg leading-relaxed text-foreground/90 mb-8">
                {t('about.content')}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="glass-card p-4 rounded-2xl mb-3 hover:scale-105 transition-smooth">
                      <stat.icon className="w-8 h-8 mx-auto text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-sm text-foreground/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image/Video Placeholder */}
            <div className="relative">
              <div className="glass-card aspect-video rounded-3xl overflow-hidden">
                <div className="w-full h-full bg-gradient-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <p className="text-foreground/80">Video Showcase</p>
                    <p className="text-sm text-foreground/60 mt-2">Rotem's Best Work</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full animate-float" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-glow/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;