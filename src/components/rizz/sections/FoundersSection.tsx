import rotemImg from "@/assets/rotem.webp";
import shakedImg from "@/assets/shaked.webp";
import { FounderFlipCard } from "@/components/rizz/ui/FounderFlipCard";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import type { FounderItem } from "@/i18n/rizz-translations";

const founderImages = {
  rotem: rotemImg,
  shaked: shakedImg,
} as const;

const toFounderCardData = (
  founder: FounderItem,
  labels: { showBio: string; hideBio: string },
) => ({
  name: founder.name,
  role: founder.role,
  keywords: founder.keywords,
  bio: founder.bio,
  badge: founder.badge,
  variant: founder.variant,
  image: founder.imageKey ? founderImages[founder.imageKey] : undefined,
  showBioLabel: labels.showBio,
  hideBioLabel: labels.hideBio,
});

export const FoundersSection = () => {
  const t = useRizzTranslations();
  const bioLabels = { showBio: t.founders.showBio, hideBio: t.founders.hideBio };

  return (
    <section id="about" className="py-28 px-6 bg-[#030712]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          <SectionWrapper>
            <EyebrowLabel>{t.founders.eyebrow}</EyebrowLabel>
            <h2
              className="font-semibold uppercase text-[#F5F7FA] leading-[0.95] max-w-3xl"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)", letterSpacing: "-0.05em" }}
            >
              {t.founders.titleBefore}{" "}
              <span className="rizz-title-accent">{t.founders.titleFilmed}</span>,{" "}
              <span className="rizz-title-accent">{t.founders.titleEdited}</span>,{" "}
              {t.founders.titleLived}{" "}
              <span className="rizz-title-accent">{t.founders.titleAfter}</span>
            </h2>
          </SectionWrapper>

          <SectionWrapper delay={0.1} className="lg:pt-10">
            <p className="text-[#A7B0C0] text-base leading-relaxed max-w-xl">
              {t.founders.intro}
            </p>
            <div className="founders-values-line">
              <p className="text-[#6F7A8C] text-[11px] font-semibold uppercase tracking-[0.22em]">
                {t.founders.values}
              </p>
            </div>
          </SectionWrapper>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.founders.cards.map((founder, i) => (
            <SectionWrapper key={founder.name} delay={i * 0.12}>
              <FounderFlipCard founder={toFounderCardData(founder, bioLabels)} />
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
