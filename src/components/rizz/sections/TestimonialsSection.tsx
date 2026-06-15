import { useMemo } from "react";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import {
  TestimonialsMarquee,
  type TestimonialMarqueeItem,
} from "@/components/rizz/ui/TestimonialsMarquee";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { TESTIMONIALS } from "@/data/rizz-mock";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";

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
  const t = useRizzTranslations();
  const { dir } = useLanguage();
  const { reviews, pick } = useSiteContent();

  const items = useMemo<TestimonialMarqueeItem[]>(() => {
    const mapped =
      reviews.length > 0
        ? reviews
            .map((review) => ({
              id: review.id,
              name: review.name,
              company: review.company,
              quote: pick(review.text),
              stars: review.rating || 5,
            }))
            .filter((review) => review.quote.trim().length > 0)
        : TESTIMONIALS.map((testimonial, index) => ({
            id: `fallback-${index}`,
            name: testimonial.name,
            company: testimonial.company,
            quote: pick(testimonial.quote),
            stars: testimonial.stars,
          }));

    return ensureMinimumReviews(mapped);
  }, [reviews, pick]);

  return (
    <section id="testimonials" className="overflow-x-hidden bg-[#030712] py-28">
      <div className="mx-auto mb-12 max-w-[1440px] px-6 text-center md:mb-14">
        <SectionWrapper>
          <EyebrowLabel className="w-full text-center">{t.testimonials.eyebrow}</EyebrowLabel>
          <h2
            className="font-semibold uppercase leading-[0.95] text-[#F5F7FA]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
          >
            {t.testimonials.titleLine1}
            <br />
            <span className="rizz-title-accent">{t.testimonials.titleAccent}</span>
          </h2>
        </SectionWrapper>
      </div>

      <SectionWrapper>
        <TestimonialsMarquee
          items={items}
          starsLabel={t.testimonials.starsAria}
          dir={dir}
        />
      </SectionWrapper>
    </section>
  );
};
