import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";

export const FinalCtaSection = () => {
  const t = useRizzTranslations();

  return (
    <section
      id="contact"
      className="relative py-32 px-6 bg-[#030712] overflow-hidden text-center"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionWrapper>
          <EyebrowLabel className="text-center w-full">{t.cta.eyebrow}</EyebrowLabel>
          <h2
            className="font-semibold uppercase text-[#F5F7FA] mb-6 leading-[0.92]"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              letterSpacing: "-0.06em",
            }}
          >
            {t.cta.titleLine1}
            <br />
            <span className="rizz-title-accent">{t.cta.titleAccent}</span>
          </h2>
          <p className="text-[#A7B0C0] text-lg leading-relaxed mb-4">
            {t.cta.description}
          </p>
          <p className="text-[#6F7A8C] text-sm uppercase tracking-[0.25em] mb-10">
            {t.cta.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rizz-btn-primary text-base py-5 px-10"
            >
              {t.cta.bookCall}
            </a>
            <a
              href="https://wa.me/972000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="rizz-btn-secondary text-base py-5 px-10"
            >
              {t.cta.whatsapp}
            </a>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
};
