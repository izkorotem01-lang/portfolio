import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 relative bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                {t('hero.name')}
              </h3>
              <p className="text-foreground/70 mb-4">
                {t('hero.subtitle')}
              </p>
              <div className="flex space-x-4">
                <a href="mailto:rotem.izko@gmail.com" className="text-foreground/70 hover:text-primary transition-smooth">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://wa.me/1234567890" className="text-foreground/70 hover:text-primary transition-smooth">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { label: t('nav.about'), href: '#about' },
                  { label: t('nav.services'), href: '#services' },
                  { label: t('nav.packages'), href: '#packages' },
                  { label: t('nav.portfolio'), href: '#portfolio' },
                  { label: t('nav.contact'), href: '#contact' },
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-foreground/70 hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">Services</h4>
              <div className="space-y-2 text-foreground/70">
                <p>{t('services.video')}</p>
                <p>{t('services.motion')}</p>
                <p>{t('services.social')}</p>
                <p>{t('services.photo')}</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm mb-4 md:mb-0">
              © 2024 {t('hero.name')}. All rights reserved.
            </p>
            <p className="text-foreground/60 text-sm flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-primary" /> for amazing creators
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;