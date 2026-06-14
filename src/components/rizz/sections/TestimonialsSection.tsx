import { useMemo } from "react";
import { Check } from "lucide-react";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { TESTIMONIALS } from "@/data/rizz-mock";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";

type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  stars: number;
};

const StarRating = ({ count, label }: { count: number; label: string }) => (
  <div className="flex gap-0.5" aria-label={label}>
    {[...Array(count)].map((_, index) => (
      <span key={index} className="text-base text-[#F5B301]">
        ★
      </span>
    ))}
  </div>
);

const TestimonialCard = ({
  item,
  starsLabel,
}: {
  item: TestimonialItem;
  starsLabel: string;
}) => (
  <article className="testimonial-card flex h-full min-h-[320px] flex-col p-6 md:p-7">
    <span className="testimonial-quote-mark" aria-hidden="true">
      “
    </span>

    <p className="flex-1 pt-3 text-sm leading-relaxed text-[#F5F7FA] md:text-[0.95rem]">
      {item.quote}
    </p>

    <footer className="mt-8 border-t border-[#1D2B3E]/80 pt-5">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-bold text-[#F5F7FA]">{item.name}</p>
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#187BFF]"
          aria-hidden="true"
        >
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </span>
      </div>
      <StarRating count={item.stars} label={starsLabel} />
    </footer>
  </article>
);

export const TestimonialsSection = () => {
  const t = useRizzTranslations();
  const { reviews, pick } = useSiteContent();

  const items = useMemo<TestimonialItem[]>(() => {
    if (reviews.length > 0) {
      return reviews
        .map((review) => ({
          id: review.id,
          name: review.name,
          quote: pick(review.text),
          stars: review.rating || 5,
        }))
        .filter((review) => review.quote.trim().length > 0);
    }

    return TESTIMONIALS.map((testimonial, index) => ({
      id: `fallback-${index}`,
      name: testimonial.name,
      quote: pick(testimonial.quote),
      stars: testimonial.stars,
    }));
  }, [reviews, pick]);

  return (
    <section id="testimonials" className="overflow-x-hidden bg-[#030712] px-6 py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionWrapper className="text-center">
          <EyebrowLabel className="w-full text-center">{t.testimonials.eyebrow}</EyebrowLabel>
          <h2
            className="mb-16 font-semibold uppercase leading-[0.95] text-[#F5F7FA]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
          >
            {t.testimonials.titleLine1}
            <br />
            <span className="rizz-title-accent">{t.testimonials.titleAccent}</span>
          </h2>
        </SectionWrapper>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <SectionWrapper key={item.id} delay={index * 0.08}>
              <TestimonialCard
                item={item}
                starsLabel={t.testimonials.starsAria(item.stars)}
              />
            </SectionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
