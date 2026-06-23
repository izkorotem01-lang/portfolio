import rotemCtaImg from "@/assets/rotem-cta.png";
import shakedCtaImg from "@/assets/shaked-cta.png";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { RizzButton } from "@/components/rizz/ui/RizzButton";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { RIZZ_CONTACT } from "@/data/rizz-contact";
import { useSiteContent } from "@/contexts/SiteContentContext";

const ctaFounderImageBaseClass = "cta-founder-image pointer-events-none h-auto w-auto select-none";

const ctaFounderImageDesktopClass = `${ctaFounderImageBaseClass} absolute bottom-0 block max-h-[clamp(42rem,90vh,72rem)] max-w-[min(52vw,38rem)]`;

const ctaFounderImageMobileClass = `${ctaFounderImageBaseClass} block max-h-[min(40vh,17rem)] max-w-[48%]`;

export const FinalCtaSection = () => {
  const { rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.cta)
    throw new Error("Missing required Sanity content: rizzPage.cta");
  const cta = rizzPage.cta;
  const founders = rizzPage.founders;
  const leftPortraitSrc = founders?.ctaPortraitLeftUrl ?? rotemCtaImg;
  const rightPortraitSrc = founders?.ctaPortraitRightUrl ?? shakedCtaImg;

  return (
    <section
      id="contact"
      className="relative bg-[#030712] overflow-x-hidden lg:min-h-[clamp(42rem,90vh,72rem)]"
    >
      <div className="pointer-events-none hidden lg:block">
        <img
          src={leftPortraitSrc}
          alt=""
          aria-hidden="true"
          className={`${ctaFounderImageDesktopClass} cta-founder-image--left left-8 lg:left-12`}
        />
        <img
          src={rightPortraitSrc}
          alt=""
          aria-hidden="true"
          className={`${ctaFounderImageDesktopClass} cta-founder-image--right right-8 lg:right-12`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-10 text-center lg:py-32">
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
            <span className="rizz-title-accent whitespace-pre-line">
              {requirePick(cta.titleAccent, "rizzPage.cta.titleAccent")}
            </span>
          </h2>
          <p className="text-[#A7B0C0] text-lg leading-relaxed mb-4">
            {requirePick(cta.description, "rizzPage.cta.description")}
          </p>
          <p className="text-[#6F7A8C] text-sm uppercase tracking-[0.25em] mb-10">
            {requirePick(cta.tagline, "rizzPage.cta.tagline")}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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

      <div className="cta-founder-portraits-mobile relative z-10 flex items-end justify-center px-2 lg:hidden">
        <img
          src={leftPortraitSrc}
          alt=""
          aria-hidden="true"
          className={`${ctaFounderImageMobileClass} cta-founder-image--left`}
        />
        <img
          src={rightPortraitSrc}
          alt=""
          aria-hidden="true"
          className={`${ctaFounderImageMobileClass} cta-founder-image--right`}
        />
      </div>
    </section>
  );
};
