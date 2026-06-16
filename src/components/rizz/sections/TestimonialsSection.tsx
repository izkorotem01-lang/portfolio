import { useMemo } from "react";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import {
  TestimonialsMarquee,
  type TestimonialMarqueeItem,
} from "@/components/rizz/ui/TestimonialsMarquee";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";

const MIN_MARQUEE_REVIEWS = 8;

const ensureMinimumReviews = (items: TestimonialMarqueeItem[]): TestimonialMarqueeItem[] => {
  if (items.length === 0) return items;
  if (items.length >= MIN_MARQUEE_REVIEWS) return items;

  const padded = [...items];
  let index = 0;
  while (padded.length < MIN_MARQUEE_REVIEWS) {
    const source = items[index % items.length];
    padded.push({
      ...source,
      id: `${source.id}-pad-${padded.length}`,
    });
    index += 1;
  }
  return padded;
};

export const TestimonialsSection = () => {
  const { dir } = useLanguage();
  const { reviews, rizzPage, pick, requirePick } = useSiteContent();
  if (!rizzPage?.testimonials) {
    throw new Error("Missing required Sanity content: rizzPage.testimonials");
  }
  const copy = rizzPage.testimonials;

  const items = useMemo<TestimonialMarqueeItem[]>(() => {
    const mapped =
      reviews
        .map((review) => ({
          id: review.id,
          name: review.name,
          company: review.company,
          quote: pick(review.text),
          stars: review.rating || 5,
        }))
        .filter((review) => review.quote.trim().length > 0);

    return ensureMinimumReviews(mapped);
  }, [reviews, requirePick]);

  const starsLabel = (count: number) =>
    `${count} ${requirePick(copy.starsAriaSuffix, "rizzPage.testimonials.starsAriaSuffix")}`;

  return (
    <section id="testimonials" className="overflow-x-hidden bg-[#030712] py-28">
      <div className="mx-auto mb-12 max-w-[1440px] px-6 text-center md:mb-14">
        <SectionWrapper>
          <EyebrowLabel className="w-full text-center">
            {requirePick(copy.eyebrow, "rizzPage.testimonials.eyebrow")}
          </EyebrowLabel>
          <h2
            className="font-semibold uppercase leading-[0.95] text-[#F5F7FA]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
          >
            {requirePick(copy.titleLine1, "rizzPage.testimonials.titleLine1")}
            <br />
            <span className="rizz-title-accent">
              {requirePick(copy.titleAccent, "rizzPage.testimonials.titleAccent")}
            </span>
          </h2>
        </SectionWrapper>
      </div>

      <SectionWrapper>
        <TestimonialsMarquee
          items={items}
          starsLabel={starsLabel}
          dir={dir}
        />
      </SectionWrapper>
    </section>
  );
};
