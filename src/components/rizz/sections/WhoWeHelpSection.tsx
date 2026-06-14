import { AUDIENCE_CARDS } from "@/data/rizz-mock";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { RizzCard } from "@/components/rizz/ui/RizzCard";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";

export const WhoWeHelpSection = () => (
  <section id="who-we-help" className="py-28 px-6 bg-[#030712]">
    <div className="mx-auto max-w-[1440px]">
      <SectionWrapper>
        <EyebrowLabel>Audience / Who We Help</EyebrowLabel>
        <h2
          className="font-semibold uppercase text-[#F5F7FA] mb-16 max-w-4xl leading-[0.95]"
          style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
        >
          FOR PEOPLE WHO ARE ALREADY GOOD AT WHAT THEY DO,{" "}
          <span className="rizz-title-accent">BUT INVISIBLE ON VIDEO.</span>
        </h2>
      </SectionWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {AUDIENCE_CARDS.map((card, i) => (
          <SectionWrapper key={card.title} delay={i * 0.1}>
            <RizzCard className="p-7 h-full flex flex-col gap-4">
              <div className="text-4xl">{card.icon}</div>
              <h3 className="text-[#F5F7FA] font-bold text-xl uppercase tracking-wide">
                {card.title}
              </h3>
              <p className="text-[#A7B0C0] text-sm leading-relaxed">{card.description}</p>
            </RizzCard>
          </SectionWrapper>
        ))}
      </div>
    </div>
  </section>
);
