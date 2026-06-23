import { motion } from "framer-motion";
import rotemAndShaked from "@/assets/rotem_and_shaked.png";
import rotemAndShakedHb from "@/assets/rotem_and_shaked_hb.png";
import { RizzButton } from "@/components/rizz/ui/RizzButton";
import { LanguageSwitcher } from "@/components/rizz/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { RIZZ_CONTACT } from "@/data/rizz-contact";
import { useSiteContent } from "@/contexts/SiteContentContext";

export const HeroSection = () => {
  const { dir } = useLanguage();
  const { rizzPage, requirePick, pick } = useSiteContent();
  if (!rizzPage) throw new Error("Missing required Sanity document: rizzPage");
  const hero = rizzPage.hero;
  const nav = rizzPage.nav;
  if (!hero) throw new Error("Missing required rizzPage.hero");
  if (!nav) throw new Error("Missing required rizzPage.nav");

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const heroImageSrc =
    dir === "rtl"
      ? (hero.heroImageRtlUrl ?? rotemAndShakedHb)
      : (hero.heroImageLtrUrl ?? rotemAndShaked);

  const heroImageClassName = cn(
    "absolute top-0 h-full w-auto max-w-none",
    dir === "rtl" ? "left-0 hero-section-image--rtl" : "right-0",
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col md:flex md:items-center overflow-hidden pt-[120px]"
      style={{ isolation: "isolate" }}
      dir={dir}
    >
      {/* Mobile: image stacked above content */}
      <div className="relative z-0 w-full shrink-0 overflow-hidden bg-[#030712] md:hidden hero-section-image-mobile">
        <img
          key={heroImageSrc}
          src={heroImageSrc}
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#030712] from-10% to-transparent" />
      </div>

      {/* Desktop: image behind content (unchanged) */}
      <div className="absolute inset-0 z-0 hidden overflow-hidden bg-[#030712] md:block">
        <img
          key={heroImageSrc}
          src={heroImageSrc}
          alt=""
          aria-hidden="true"
          className={cn("hero-section-image", heroImageClassName)}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 w-[min(48%,40rem)] from-[#030712] from-70% to-transparent",
            dir === "rtl" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r",
          )}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030712] from-10% to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030712] from-15% to-transparent" />
      </div>

      <div className="relative z-10 w-full px-16 py-10 md:py-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rizz-eyebrow"
          >
            {requirePick(hero.eyebrow, "rizzPage.hero.eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="font-semibold uppercase text-[#F5F7FA] mb-6 leading-[0.92]"
            style={{
              fontSize: dir === "rtl" ? "clamp(2.85rem, 6.5vw, 6rem)" : "clamp(2.35rem, 5.5vw, 5rem)",
              letterSpacing: dir === "rtl" ? "-0.01em" : "-0.06em",
            }}
          >
            {requirePick(hero.titleLine1, "rizzPage.hero.titleLine1")}
            {pick(hero.titleAccent) && (
              <> <span className="rizz-title-accent">{pick(hero.titleAccent)}</span></>
            )}
            {pick(hero.titleAfterAccent) && (
              <> {pick(hero.titleAfterAccent)}</>
            )}
            {pick(hero.titleLine2) && (
              <>
                <br />
                {pick(hero.titleLine2)}
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn("text-[#A7B0C0] leading-relaxed mb-8 max-w-xl", dir === "rtl" ? "text-xl" : "text-lg")}
          >
            {requirePick(hero.description, "rizzPage.hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <RizzButton href={RIZZ_CONTACT.phoneTel} variant="primary">
              {requirePick(nav.bookCall, "rizzPage.nav.bookCall")}
            </RizzButton>
            <RizzButton
              href="#work"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#work");
              }}
            >
              {requirePick(nav.viewWork, "rizzPage.nav.viewWork")}
            </RizzButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-[#6F7A8C] uppercase"
            style={dir === "rtl" ? { fontSize: "1rem", letterSpacing: "0.2em" } : { fontSize: "0.75rem", letterSpacing: "0.25em" }}
          >
            {requirePick(hero.tagline, "rizzPage.hero.tagline")}
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="absolute bottom-8 start-8 z-20 md:bottom-10 md:start-16"
      >
        <LanguageSwitcher />
      </motion.div>
    </section>
  );
};
