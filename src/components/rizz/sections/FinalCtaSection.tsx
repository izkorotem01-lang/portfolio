import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { RizzButton } from "@/components/rizz/ui/RizzButton";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { RIZZ_CONTACT } from "@/data/rizz-contact";
import { useSiteContent } from "@/contexts/SiteContentContext";

export const FinalCtaSection = () => {
  const { rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.cta) throw new Error("Missing required Sanity content: rizzPage.cta");
  const cta = rizzPage.cta;

  return (
    <section
      id="contact"
      className="relative py-32 px-6 bg-[#030712] overflow-hidden text-center"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionWrapper>
          <EyebrowLabel className="text-center w-full">
            {requirePick(cta.eyebrow, "rizzPage.cta.eyebrow")}
          </EyebrowLabel>
          <h2
            className="font-semibold uppercase text-[#F5F7FA] mb-6 leading-[0.92]"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              letterSpacing: "-0.06em",
            }}
          >
            {requirePick(cta.titleLine1, "rizzPage.cta.titleLine1")}
            <br />
            <span className="rizz-title-accent">
              {requirePick(cta.titleAccent, "rizzPage.cta.titleAccent")}
            </span>
          </h2>
          <p className="text-[#A7B0C0] text-lg leading-relaxed mb-4">
            {requirePick(cta.description, "rizzPage.cta.description")}
          </p>
          <p className="text-[#6F7A8C] text-sm uppercase tracking-[0.25em] mb-10">
            {requirePick(cta.tagline, "rizzPage.cta.tagline")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RizzButton
              href={RIZZ_CONTACT.phoneTel}
              variant="primary"
              className="text-base px-10 py-5"
            >
              {requirePick(cta.bookCall, "rizzPage.cta.bookCall")}
            </RizzButton>
            <RizzButton
              href={RIZZ_CONTACT.emailMailto}
              variant="outline"
              className="text-base px-10 py-5"
            >
              {requirePick(cta.emailUs, "rizzPage.cta.emailUs")}
            </RizzButton>
          </div>
        </SectionWrapper>
      </div>
    </section>
  );
};
