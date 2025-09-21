import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, ExternalLink } from 'lucide-react';

const PortfolioSection = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'social', label: t('portfolio.social') },
    { id: 'business', label: t('portfolio.business') },
    { id: 'creator', label: t('portfolio.creator') },
    { id: 'construction', label: t('portfolio.construction') },
    { id: 'brand', label: t('portfolio.brand') },
    { id: 'podcast', label: t('portfolio.podcast') },
  ];

  const portfolioItems = [
    {
      id: 1,
      category: 'social',
      title: 'Social Media Campaign',
      description: 'Viral content for major brand',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 2,
      category: 'business',
      title: 'Business Advertisement',
      description: 'Corporate promotional video',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 3,
      category: 'creator',
      title: 'Creator Collaboration',
      description: 'YouTube channel content',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 4,
      category: 'construction',
      title: 'Construction Showcase',
      description: 'Project timeline documentation',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 5,
      category: 'brand',
      title: 'Brand Identity Video',
      description: 'Complete brand story',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 6,
      category: 'podcast',
      title: 'Podcast Production',
      description: 'Full episode editing',
      thumbnail: '/placeholder.svg'
    },
  ];

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t('portfolio.title')}
            </h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-smooth ${
                  activeCategory === category.id
                    ? 'bg-gradient-primary text-white glow'
                    : 'btn-glass hover:scale-105'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="portfolio-item group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-secondary/20 mb-4 overflow-hidden">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center glow">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-smooth">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary-glow transition-smooth">
                    <span>View Project</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-foreground/80 mb-6">
              Ready to see your project come to life?
            </p>
            <button 
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hero"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;