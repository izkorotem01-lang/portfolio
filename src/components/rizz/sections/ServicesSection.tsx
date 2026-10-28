import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { SERVICES_COPY_EN } from "@/data/rizz-copy-overhaul";

export const ServicesSection = () => {
  const { urlLocale } = useLanguage();
  if (urlLocale !== "en") return null; // Hebrew copy pending approval of EN
  const copy = SERVICES_COPY_EN;

  return (
    <section id="services" className="bg-transparent px-6 pt-28 pb-12 overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <SectionWrapper className="text-center mb-12">
          <EyebrowLabel className="justify-center text-center w-full tracking-[0.4em]">
            {copy.eyebrow}
          </EyebrowLabel>
          <h2
            className="font-semibold uppercase leading-[0.95]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.04em" }}
          >
            <span className="text-[#F5F7FA]">{copy.titlePrimary} </span>
            <span className="rizz-title-accent">{copy.titleAccent}</span>
          </h2>
        </SectionWrapper>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copy.cards.map((card, i) => (
            <SectionWrapper key={card.title} delay={i * 0.08}>
              <article className="rizz-card h-full p-6">
                <h3 className="mb-3 text-xl font-bold text-[#F5F7FA]">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#A7B0C0]">{card.description}</p>
              </article>
            </SectionWrapper>
          ))}
        </div>
        <SectionWrapper className="mt-10 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#6F7A8C]">
            {copy.footnote}
          </p>
        </SectionWrapper>
      </div>
    </section>
  );
};
