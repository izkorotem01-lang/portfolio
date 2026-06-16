import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, Globe } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";

const Footer = () => {
  const { language, setLanguage } = useLanguage();
  const { siteSettings, homePage, requirePick } = useSiteContent();
  const year = new Date().getFullYear();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hb" : "en");
  };

  return (
    <footer className="py-12 relative bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground tracking-wide">
                RIZZ Productions
              </h3>
              <p className="text-foreground/70 mb-4">
                {requirePick(siteSettings?.footerText, "siteSettings.footerText")}
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@rotemizko.com"
                  className="text-foreground/70 hover:text-primary transition-smooth"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/972549702996"
                  className="text-foreground/70 hover:text-primary transition-smooth"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">
                {requirePick(siteSettings?.footerText, "siteSettings.footerText")}
              </h4>
              <div className="space-y-2">
                {[
                  { label: requirePick(homePage?.about?.title, "homePage.about.title"), href: "#about" },
                  { label: requirePick(homePage?.portfolioSection?.title, "homePage.portfolioSection.title"), href: "#portfolio" },
                  { label: requirePick(homePage?.contactSection?.title, "homePage.contactSection.title"), href: "#contact" },
                ].map((link) => (
                  <button
                    key={link.href}
                    onClick={() =>
                      document
                        .querySelector(link.href)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="block text-foreground/70 hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Media & Language */}
            <div>
              <h4 className="font-bold mb-4 text-foreground">
                {requirePick(siteSettings?.footerText, "siteSettings.footerText")}
              </h4>
              <div className="space-y-2 mb-6">
                <a
                  href="https://www.instagram.com/rotemizko_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-foreground/70 hover:text-primary transition-smooth"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@RoTeMIZKo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-foreground/70 hover:text-primary transition-smooth"
                >
                  YouTube
                </a>
                <a
                  href="https://www.tiktok.com/@rotem.izko?_t=ZS-904z3ZuyO0d&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-foreground/70 hover:text-primary transition-smooth"
                >
                  TikTok
                </a>
              </div>

              {/* Language Switcher */}
              <div>
                <h4 className="font-bold mb-3 text-foreground">
                  {requirePick(siteSettings?.footerText, "siteSettings.footerText")}
                </h4>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-2 text-foreground/70 hover:text-primary transition-smooth"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "en" ? "עברית" : "English"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/30 pt-8 flex justify-center text-center">
            <p className="text-foreground/60 text-sm">
              © {year} RIZZ Productions. {requirePick(siteSettings?.footerText, "siteSettings.footerText")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
