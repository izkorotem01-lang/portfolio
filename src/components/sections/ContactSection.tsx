import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  MessageCircle,
  Instagram,
  Youtube,
  Linkedin,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t } = useLanguage();
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
      url: "https://instagram.com/rotemizko",
      color: "from-pink-500 to-purple-600",
    },
    {
      icon: Youtube,
      platform: "YouTube",
      url: "https://youtube.com/rotemizko",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Linkedin,
      platform: "LinkedIn",
      url: "https://linkedin.com/in/rotemizko",
      color: "from-blue-600 to-blue-700",
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

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Methods */}
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      onClick={method.action}
                      className="glass-card p-6 rounded-2xl hover:scale-105 transition-smooth cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
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
                <div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    Follow My Work
                  </h3>
                  <div className="flex space-x-4">
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

              {/* Contact Form */}
              <div className="glass-card p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-background/50 border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <Button type="submit" className="btn-hero w-full group">
                    <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
