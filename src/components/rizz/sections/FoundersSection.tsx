import rotemImg from "@/assets/rotem.webp";
import shakedImg from "@/assets/shaked.webp";
import { FounderFlipCard } from "@/components/rizz/ui/FounderFlipCard";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useSiteContent } from "@/contexts/SiteContentContext";

const founderImages = {
  rotem: rotemImg,
  shaked: shakedImg,
} as const;

export const FoundersSection = () => {
  const { rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.founders) throw new Error("Missing required Sanity content: rizzPage.founders");
  const copy = rizzPage.founders;
  const bioLabels = {
    showBio: requirePick(copy.showBio, "rizzPage.founders.showBio"),
    hideBio: requirePick(copy.hideBio, "rizzPage.founders.hideBio"),
  };
  const cards = copy.cards ?? [];
  if (cards.length === 0) throw new Error("Missing required rizzPage.founders.cards");

  return (
    <section id="about" className="py-28 px-6 bg-[#030712]">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          <SectionWrapper>
            <EyebrowLabel>{requirePick(copy.eyebrow, "rizzPage.founders.eyebrow")}</EyebrowLabel>
            <h2
              className="font-semibold uppercase text-[#F5F7FA] leading-[0.95] max-w-3xl"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)", letterSpacing: "-0.05em" }}
            >
              {requirePick(copy.titleBefore, "rizzPage.founders.titleBefore")}{" "}
              <span className="rizz-title-accent">
                {requirePick(copy.titleFilmed, "rizzPage.founders.titleFilmed")}
              </span>
              ,{" "}
              <span className="rizz-title-accent">
                {requirePick(copy.titleEdited, "rizzPage.founders.titleEdited")}
              </span>
              , {requirePick(copy.titleLived, "rizzPage.founders.titleLived")}{" "}
              <span className="rizz-title-accent">
                {requirePick(copy.titleAfter, "rizzPage.founders.titleAfter")}
              </span>
            </h2>
          </SectionWrapper>

          <SectionWrapper delay={0.1} className="lg:pt-10">
            <p className="text-[#A7B0C0] text-base leading-relaxed max-w-xl">
              {requirePick(copy.intro, "rizzPage.founders.intro")}
            </p>
            <div className="founders-values-line">
              <p className="text-[#6F7A8C] text-[11px] font-semibold uppercase tracking-[0.22em]">
                {requirePick(copy.values, "rizzPage.founders.values")}
              </p>
            </div>
          </SectionWrapper>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((founder, i) => (
            <SectionWrapper
              key={`${requirePick(founder.name, `rizzPage.founders.cards[${i}].name`)}-${i}`}
              delay={i * 0.12}
            >
              <FounderFlipCard
                founder={{
                  name: requirePick(founder.name, `rizzPage.founders.cards[${i}].name`),
                  role: requirePick(founder.role, `rizzPage.founders.cards[${i}].role`),
                  keywords: founder.keywords
                    ? requirePick(founder.keywords, `rizzPage.founders.cards[${i}].keywords`)
                    : undefined,
                  bio: requirePick(founder.bio, `rizzPage.founders.cards[${i}].bio`),
                  badge: founder.badge
                    ? requirePick(founder.badge, `rizzPage.founders.cards[${i}].badge`)
                    : undefined,
                  variant: (founder.variant as "portrait" | "team" | undefined) ?? "portrait",
                  image: founder.imageKey
                    ? founderImages[founder.imageKey as keyof typeof founderImages]
                    : undefined,
                  showBioLabel: bioLabels.showBio,
                  hideBioLabel: bioLabels.hideBio,
                }}
              />
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
