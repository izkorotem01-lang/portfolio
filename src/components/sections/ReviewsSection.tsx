import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 1,
      name: 'Sarah Cohen',
      role: 'Marketing Manager',
      company: 'TechStart Ltd.',
      rating: 5,
      content: 'Rotem transformed our social media presence completely. His creative vision and technical expertise are unmatched. Our engagement rates increased by 300%!',
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'David Miller',
      role: 'Content Creator',
      company: 'YouTube Channel',
      rating: 5,
      content: 'Working with Rotem was a game-changer. He understood my vision perfectly and delivered beyond expectations. The quality and attention to detail are exceptional.',
      avatar: '👨‍🎨'
    },
    {
      id: 3,
      name: 'Maya Levi',
      role: 'Business Owner',
      company: 'Local Restaurant',
      rating: 5,
      content: 'Professional, creative, and reliable. Rotem helped us create stunning promotional videos that significantly boosted our customer base. Highly recommended!',
      avatar: '👩‍🍳'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      role: 'Podcast Host',
      company: 'Tech Talks Podcast',
      rating: 5,
      content: 'Rotem takes podcast editing to the next level. Clean audio, perfect transitions, and engaging visuals. Our listener retention improved dramatically.',
      avatar: '🎙️'
    },
    {
      id: 5,
      name: 'Rachel Green',
      role: 'Influencer',
      company: 'Instagram @lifestyle_rachel',
      rating: 5,
      content: 'Amazing work! Rotem has an incredible eye for detail and knows exactly what works on social media. My content has never looked better.',
      avatar: '📸'
    },
    {
      id: 6,
      name: 'Michael Chen',
      role: 'Startup Founder',
      company: 'InnovateTech',
      rating: 5,
      content: 'Rotem helped us create our company introduction video. The result was professional, engaging, and perfectly captured our brand essence.',
      avatar: '🚀'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-secondary opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-primary-glow/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t('reviews.title')}
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              {t('reviews.subtitle')}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="glass-card p-6 rounded-3xl relative hover:scale-105 transition-smooth animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="w-8 h-8 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* Review Content */}
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{review.content}"
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{review.name}</h4>
                    <p className="text-sm text-foreground/70">{review.role}</p>
                    <p className="text-xs text-primary">{review.company}</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary/10 rounded-full animate-float" />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {t('reviews.cta.title')}
              </h3>
              <p className="text-foreground/80 mb-6">
                {t('reviews.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="btn-hero inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('reviews.cta.contact')}
                </a>
                <a
                  href="#portfolio"
                  className="btn-glass inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('reviews.cta.portfolio')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-primary/5 rounded-full animate-float" />
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-primary-glow/10 rounded-full animate-float" style={{ animationDelay: '3s' }} />
    </section>
  );
};

export default ReviewsSection;