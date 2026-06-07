import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Mail, MessageCircle, PenTool, Rocket, Instagram, Youtube, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t, language } = useLanguage();
  const { homePage, siteSettings, pick } = useSiteContent();
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.08,
    rootMargin: "0px 0px -5% 0px",
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon!",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const email = siteSettings?.contactEmail || t("contact.email");
  const whatsappUrl = siteSettings?.whatsappUrl || "https://wa.me/972549702996";
  const processSteps =
    homePage?.contactSection?.processSteps?.length
      ? homePage.contactSection.processSteps
      : [
          {
            _key: "discovery",
            title: { en: "Discovery", he: "היכרות" },
            description: {
              en: "We understand your business, audience, goals, and current content situation.",
              he: "מבינים את העסק, הקהל, המטרות והמצב הנוכחי של התוכן.",
            },
          },
          {
            _key: "plan",
            title: { en: "Personalized Plan", he: "תוכנית אישית" },
            description: {
              en: "We build a custom content plan that fits your needs, budget, and growth direction.",
              he: "בונים תוכנית תוכן אישית שמתאימה לצרכים, לתקציב ולכיוון הצמיחה שלכם.",
            },
          },
          {
            _key: "production",
            title: { en: "Create & Improve", he: "יוצרים ומשפרים" },
            description: {
              en: "We produce the content, publish consistently, and improve it based on results.",
              he: "מפיקים את התוכן, מפרסמים בצורה עקבית ומשפרים לפי התוצאות.",
            },
          },
        ];

  const processIcons = [Lightbulb, PenTool, Rocket];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: email,
      action: () => window.open(`mailto:${email}`),
      color: "bg-brand-cyan/12 border border-brand-cyan/30 text-brand-cyan",
    },
    {
      icon: MessageCircle,
      title: pick(siteSettings?.whatsappLabel) || "WhatsApp",
      value: language === "he" ? "מענה מהיר" : "Quick Response",
      action: () => window.open(whatsappUrl),
      color: "bg-brand-orange/12 border border-brand-orange/30 text-brand-orange",
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      platform: "Instagram",
      url: "https://www.instagram.com/rotemizko_/",
      color: "bg-brand-cyan/12 border border-brand-cyan/30 text-brand-cyan",
    },
    {
      icon: Youtube,
      platform: "YouTube",
      url: "https://www.youtube.com/@RoTeMIZKo",
      color: "bg-brand-cyan/12 border border-brand-cyan/30 text-brand-cyan",
    },
    {
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.392-2.085-1.392-3.338h-3.067v14.829c0 1.673-1.357 3.029-3.029 3.029s-3.029-1.357-3.029-3.029 1.357-3.029 3.029-3.029c.314 0 .617.048.9.138V9.851c-.282-.04-.57-.061-.862-.061C5.46 9.79 2 13.25 2 17.581S5.46 25.371 9.791 25.371s7.791-3.46 7.791-7.791V9.094a9.965 9.965 0 005.233 1.442V7.469c-.884 0-1.723-.203-2.494-.537z" />
        </svg>
      ),
      platform: "TikTok",
      url: "https://www.tiktok.com/@rotem.izko?_t=ZS-904z3ZuyO0d&_r=1",
      color: "bg-brand-cyan/12 border border-brand-cyan/30 text-brand-cyan",
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-28 relative overflow-hidden z-10">
      <div ref={sectionRef} className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="glass-card rounded-3xl border border-white/30 bg-black/75 p-7 backdrop-blur-xl md:p-12 lg:p-16">
            {/* Section Title */}
            <header className="intro-scroll-showcase-header mx-auto mb-10 md:mb-14">
              <h2
                className={`showcase-productions-title intro-scroll-showcase-title${
                  isVisible ? " is-active" : ""
                }`}
              >
                {pick(homePage?.contactSection?.title) || t("contact.title")}
              </h2>
              <div
                className={`showcase-productions-ticks${
                  isVisible ? " intro-ticks-active" : ""
                }`}
                aria-hidden
              />
              <p className="mt-6 text-xl text-foreground/80 max-w-2xl mx-auto text-center">
                {pick(homePage?.contactSection?.subtitle) || t("contact.subtitle")}
              </p>
            </header>

            <div className="relative mb-14 grid gap-5 md:grid-cols-3 md:gap-6">
              {processSteps.map((step, index) => (
                <div key={step._key ?? index} className="relative">
                  <div
                    className={`group relative min-h-[15rem] overflow-hidden rounded-3xl border border-brand-cyan/25 bg-gradient-to-br from-background/80 via-background/45 to-brand-cyan/10 p-6 text-center shadow-2xl transition duration-500 hover:-translate-y-2 hover:border-brand-orange/45 hover:shadow-[0_18px_55px_hsl(var(--brand-cyan)/0.18)] ${
                      isVisible ? `animate-scale-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"
                    }`}
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-cyan/10 blur-2xl transition group-hover:bg-brand-orange/15" />
                    <div className="absolute -bottom-12 left-1/2 h-24 w-32 -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />
                    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-cyan/40 bg-black/45 text-brand-cyan shadow-[0_0_28px_hsl(var(--brand-cyan)/0.22)] transition group-hover:scale-110 group-hover:text-brand-orange">
                      {React.createElement(processIcons[index] ?? Rocket, { className: "h-7 w-7" })}
                    </div>
                    <div className="relative mx-auto mb-4 w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/55">
                      {language === "he" ? `שלב ${index + 1}` : `Step ${index + 1}`}
                    </div>
                    <h3 className="relative mb-3 text-xl font-bold text-foreground md:text-2xl">
                      {pick(step.title)}
                    </h3>
                    <p className="relative text-sm leading-relaxed text-foreground/72 md:text-base">
                      {pick(step.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information - Centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl space-y-9">
                {/* Contact Methods */}
                <div className="grid gap-5 md:grid-cols-2">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      onClick={method.action}
                      className="glass-card group cursor-pointer rounded-3xl border border-white/15 bg-background/45 p-7 transition-smooth hover:scale-[1.03] hover:border-brand-cyan/45 md:p-8"
                    >
                      <div
                        className={`flex items-center ${
                          language === "he"
                            ? "space-x-reverse space-x-5"
                            : "space-x-5"
                        }`}
                      >
                        <div
                          className={`h-16 w-16 rounded-2xl ${method.color} flex shrink-0 items-center justify-center`}
                        >
                          <method.icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground transition-smooth group-hover:text-primary">
                            {method.title}
                          </h3>
                          <p className="text-base text-foreground/70">{method.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {language === "he" ? "עקבו אחרי העבודות שלנו" : "Follow Our Work"}
                  </h3>
                  <div
                    className={`flex justify-center ${
                      language === "he"
                        ? "space-x-reverse space-x-4"
                        : "space-x-4"
                    }`}
                  >
                    {socialLinks.map((social, index) => (
                      <button
                        key={index}
                        onClick={() => window.open(social.url)}
                        className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center hover:scale-110 transition-smooth`}
                      >
                        <social.icon className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
