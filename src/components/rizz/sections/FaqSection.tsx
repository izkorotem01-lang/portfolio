import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FAQ_COPY_EN } from "@/data/rizz-copy-overhaul";

export const FaqSection = () => {
  const { urlLocale } = useLanguage();
  if (urlLocale !== "en") return null; // Hebrew copy pending approval of EN
  const copy = FAQ_COPY_EN;

  return (
    <section id="faq" className="bg-transparent px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <SectionWrapper className="text-center mb-10">
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
        <SectionWrapper>
          <Accordion type="single" collapsible className="w-full">
            {copy.items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-[#1D2B3E]">
                <AccordionTrigger className="text-left text-base font-semibold text-[#F5F7FA] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#A7B0C0] leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SectionWrapper>
      </div>
    </section>
  );
};
