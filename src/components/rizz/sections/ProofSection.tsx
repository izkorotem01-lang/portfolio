import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { ProofCardItem } from "@/components/rizz/ui/ProofCard";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { TrustedByWheel } from "@/components/rizz/ui/TrustedByWheel";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useMemo } from "react";

export const ProofSection = () => {
  const { proofCards, isLoading, rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.proof) throw new Error("Missing required Sanity content: rizzPage.proof");
  const copy = rizzPage.proof;
  const cards = useMemo(() => {
    if (proofCards.length === 0) {
      throw new Error("Missing required proofCards in Sanity (no fallbacks).");
    }
    return proofCards.filter(
      (card) =>
        card.clientName ||
        card.clientRole ||
        card.titleSegments.length > 0 ||
        card.checkpoints.length > 0 ||
        card.headerMedia ||
        card.bottomMedia.length > 0 ||
        card.statistics.length > 0,
    );
  }, [proofCards]);

  return (
    <section id="proof" className="pt-32 pb-20 bg-[#030712] overflow-x-hidden">
      <SectionWrapper className="text-center px-8 mb-10">
        <EyebrowLabel className="justify-center text-center w-full tracking-[0.4em]">
          {requirePick(copy.eyebrow, "rizzPage.proof.eyebrow")}
        </EyebrowLabel>
        <h2
          className="font-semibold uppercase leading-[0.95] mb-4 md:whitespace-nowrap"
          style={{
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block md:inline text-[#F5F7FA]">
            {requirePick(copy.titlePrimary, "rizzPage.proof.titlePrimary")}
          </span>
          <span className="block md:inline rizz-title-accent md:ms-[0.2em]">
            {requirePick(copy.titleAccent, "rizzPage.proof.titleAccent")}
          </span>
        </h2>
        <p className="text-[#A7B0C0] text-base mx-auto max-w-xl">
          {requirePick(copy.subtitle, "rizzPage.proof.subtitle")}
        </p>
      </SectionWrapper>

      <SectionWrapper className="mb-8">
        <TrustedByWheel />
      </SectionWrapper>

      <div className="px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
      </div>
    </section>
  );
};
