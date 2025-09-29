import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Instagram, Youtube, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t, language } = useLanguage();
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

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: t("contact.email"),
      action: () => window.open("mailto:izkorotem01@gmail.com"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      title: t("contact.whatsapp"),
      value: "Quick Response",
      action: () => window.open("https://wa.me/972549702996"),
      color: "from-green-500 to-green-600",
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      platform: "Instagram",
      url: "https://www.instagram.com/rotemizko_/",
      color: "from-pink-500 to-purple-600",
    },
    {
      icon: Youtube,
      platform: "YouTube",
      url: "https://www.youtube.com/@RoTeMIZKo",
      color: "from-red-500 to-red-600",
    },
    {
      icon: () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.392-2.085-1.392-3.338h-3.067v14.829c0 1.673-1.357 3.029-3.029 3.029s-3.029-1.357-3.029-3.029 1.357-3.029 3.029-3.029c.314 0 .617.048.9.138V9.851c-.282-.04-.57-.061-.862-.061C5.46 9.79 2 13.25 2 17.581S5.46 25.371 9.791 25.371s7.791-3.46 7.791-7.791V9.094a9.965 9.965 0 005.233 1.442V7.469c-.884 0-1.723-.203-2.494-.537z" />
        </svg>
      ),
      platform: "TikTok",
      url: "https://www.tiktok.com/@rotem.izko?_t=ZS-904z3ZuyO0d&_r=1",
      color: "from-black to-gray-800",
    },
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Large Card Container */}
          <div className="glass-card p-12 rounded-3xl backdrop-blur-xl bg-black/70 border border-white/30">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                {t("contact.title")}
              </h2>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                {t("contact.subtitle")}
              </p>
            </div>

            {/* Contact Information - Centered */}
            <div className="flex justify-center">
              <div className="max-w-2xl w-full space-y-8">
                {/* Contact Methods */}
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      onClick={method.action}
                      className="glass-card p-6 rounded-2xl hover:scale-105 transition-smooth cursor-pointer group"
                    >
                      <div
                        className={`flex items-center ${
                          language === "he"
                            ? "space-x-reverse space-x-4"
                            : "space-x-4"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:glow`}
                        >
                          <method.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                            {method.title}
                          </h3>
                          <p className="text-foreground/70">{method.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    Follow My Work
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
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center hover:scale-110 glow-hover transition-smooth`}
                      >
                        <social.icon className="w-6 h-6 text-white" />
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
