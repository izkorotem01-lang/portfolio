import { motion } from "framer-motion";
import rotemAndShaked from "@/assets/rotem_and_shaked.png";
import { RizzButton } from "@/components/rizz/ui/RizzButton";
import { LanguageSwitcher } from "@/components/rizz/ui/LanguageSwitcher";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const HeroSection = () => {
  const t = useRizzTranslations();
  const { dir } = useLanguage();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-[120px]"
      style={{ isolation: "isolate" }}
      dir={dir}
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#030712]">
        <img
          src={rotemAndShaked}
          alt=""
          aria-hidden="true"
          className={cn(
            "hero-section-image absolute top-0 h-full w-auto max-w-none",
            dir === "rtl" ? "left-0 hero-section-image--rtl" : "right-0",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 w-[min(48%,40rem)] bg-gradient-to-r from-[#030712] from-70% to-transparent",
            dir === "rtl" ? "right-0 bg-gradient-to-l" : "left-0",
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030712] from-10% to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030712] from-15% to-transparent" />
      </div>

      <div className="relative z-10 w-full px-16 py-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rizz-eyebrow"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="font-semibold uppercase text-[#F5F7FA] mb-6 leading-[0.92]"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 6rem)",
              letterSpacing: "-0.06em",
            }}
          >
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
            <br />
            <span className="rizz-title-accent">{t.hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#A7B0C0] text-lg leading-relaxed mb-8 max-w-xl"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <RizzButton
              href="#contact"
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact");
              }}
            >
              {t.nav.bookCall}
            </RizzButton>
            <RizzButton
              href="#work"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#work");
              }}
            >
              {t.nav.viewWork}
            </RizzButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-[#6F7A8C] text-xs uppercase tracking-[0.25em]"
          >
            {t.hero.tagline}
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="absolute bottom-8 left-8 z-20 md:bottom-10 md:left-16"
      >
        <LanguageSwitcher />
      </motion.div>
    </section>
  );
};
