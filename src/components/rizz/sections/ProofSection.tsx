import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { ProofCardItem } from "@/components/rizz/ui/ProofCard";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { TrustedByWheel } from "@/components/rizz/ui/TrustedByWheel";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProofCardsFallback } from "@/data/proof-cards-fallback-i18n";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import { useMemo } from "react";

export const ProofSection = () => {
  const t = useRizzTranslations();
  const { language } = useLanguage();
  const { proofCards, isLoading } = useSiteContent();
  const cards = useMemo(() => {
    const source =
      proofCards.length > 0 ? proofCards : getProofCardsFallback(language);
    return source.filter(
      (card) =>
        card.clientName ||
        card.clientRole ||
        card.titleSegments.length > 0 ||
        card.checkpoints.length > 0 ||
        card.headerMedia ||
        card.bottomMedia.length > 0 ||
        card.statistics.length > 0,
    );
  }, [proofCards, language]);

  return (
    <section id="proof" className="pt-32 pb-20 bg-[#030712] overflow-x-hidden">
      <SectionWrapper className="text-center px-8 mb-10">
        <EyebrowLabel className="justify-center text-center w-full tracking-[0.4em]">
          {t.proof.eyebrow}
        </EyebrowLabel>
        <h2
          className="font-semibold uppercase leading-[0.95] mb-4 md:whitespace-nowrap"
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block md:inline text-[#F5F7FA]">{t.proof.titlePrimary}</span>
          <span className="block md:inline rizz-title-accent md:ms-[0.2em]">
            {t.proof.titleAccent}
          </span>
        </h2>
        <p className="text-[#A7B0C0] text-base mx-auto max-w-xl">
          {t.proof.subtitle}
        </p>
      </SectionWrapper>

      <SectionWrapper className="mb-8">
        <TrustedByWheel />
      </SectionWrapper>

      <div className="grid grid-cols-1 gap-6 px-8 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[640px] animate-pulse rounded-3xl border border-[#1D2B3E] bg-[#0A1018]"
              />
            ))
          : cards.map((card, i) => (
              <SectionWrapper key={card.id} delay={i * 0.1}>
                <ProofCardItem card={card} />
              </SectionWrapper>
            ))}
      </div>
    </section>
  );
};
