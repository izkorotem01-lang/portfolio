import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import _Marquee from "react-fast-marquee";
import { cn } from "@/lib/utils";

const Marquee =
  (_Marquee as unknown as { default?: typeof _Marquee }).default ?? _Marquee;

export type TestimonialMarqueeItem = {
  id: string;
  name: string;
  company?: string;
  quote: string;
  stars: number;
};

const StarRating = ({ count, label }: { count: number; label: string }) => (
  <div className="flex gap-0.5" aria-label={label}>
    {[...Array(count)].map((_, index) => (
      <span key={index} className="text-sm text-[#F5B301]">
        ★
      </span>
    ))}
  </div>
);

export const TestimonialMarqueeCard = ({
  item,
  starsLabel,
  dir = "ltr",
}: {
  item: TestimonialMarqueeItem;
  starsLabel: string;
  dir?: "ltr" | "rtl";
}) => (
  <article
    dir={dir}
    className={cn(
      "testimonial-card testimonial-marquee-card mx-2 flex shrink-0 flex-col p-5",
      dir === "rtl" ? "text-right" : "text-left",
    )}
  >
    <span className="testimonial-marquee-quote-mark shrink-0" aria-hidden="true">
      “
    </span>

    <p className="testimonial-marquee-quote shrink-0 text-sm leading-snug text-[#F5F7FA]">
      {item.quote}
    </p>

    <footer className="testimonial-marquee-footer mt-auto shrink-0 border-t border-[#1D2B3E]/80 pt-4">
      <div
        className={cn(
          "mb-1 flex min-h-5 items-center gap-2",
          dir === "rtl" ? "justify-end" : "justify-start",
        )}
      >
        <p className="truncate text-sm font-bold text-[#F5F7FA]">{item.name}</p>
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#187BFF]"
          aria-hidden="true"
        >
          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
        </span>
      </div>
      <p className="testimonial-marquee-company mb-2 truncate text-[10px] uppercase tracking-[0.16em] text-[#6F7A8C]">
        {item.company ?? "\u00A0"}
      </p>
      <StarRating count={item.stars} label={starsLabel} />
    </footer>
  </article>
);

type TestimonialsMarqueeProps = {
  items: TestimonialMarqueeItem[];
  starsLabel: (count: number) => string;
  dir?: "ltr" | "rtl";
};

export const TestimonialsMarquee = ({
  items,
  starsLabel,
  dir = "ltr",
}: TestimonialsMarqueeProps) => {
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const mobileInteractionTimeoutRef = useRef<number | null>(null);
  const isMobileInteractingRef = useRef(false);

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    let animationFrame = 0;
    let lastTimestamp = 0;
    const pixelsPerSecond = 24;

    const step = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isMobileInteractingRef.current) {
        const loopWidth = scroller.scrollWidth / 2;
        scroller.scrollLeft += (pixelsPerSecond * elapsed) / 1000;
        if (scroller.scrollLeft >= loopWidth) scroller.scrollLeft -= loopWidth;
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (mobileInteractionTimeoutRef.current !== null) {
        window.clearTimeout(mobileInteractionTimeoutRef.current);
      }
    };
  }, [items.length]);

  const pauseMobileAutoScroll = () => {
    isMobileInteractingRef.current = true;
    if (mobileInteractionTimeoutRef.current !== null) {
      window.clearTimeout(mobileInteractionTimeoutRef.current);
      mobileInteractionTimeoutRef.current = null;
    }
  };

  const resumeMobileAutoScroll = () => {
    if (mobileInteractionTimeoutRef.current !== null) {
      window.clearTimeout(mobileInteractionTimeoutRef.current);
    }
    mobileInteractionTimeoutRef.current = window.setTimeout(() => {
      isMobileInteractingRef.current = false;
      mobileInteractionTimeoutRef.current = null;
    }, 1200);
  };

  if (items.length === 0) return null;

  const renderItem = (item: TestimonialMarqueeItem, key: string) => (
    <TestimonialMarqueeCard
      key={key}
      item={item}
      starsLabel={starsLabel(item.stars)}
      dir={dir}
    />
  );

  return (
    <div className="overflow-hidden">
      <div
        ref={mobileScrollerRef}
        dir="ltr"
        className="md:hidden overflow-x-auto scrollbar-hide"
        tabIndex={-1}
        onTouchStart={pauseMobileAutoScroll}
        onTouchEnd={resumeMobileAutoScroll}
        onTouchCancel={resumeMobileAutoScroll}
        onMouseDown={pauseMobileAutoScroll}
        onMouseUp={resumeMobileAutoScroll}
        onMouseLeave={resumeMobileAutoScroll}
      >
        <div className="flex w-max min-w-full items-stretch touch-pan-x py-1">
          {[...items, ...items].map((item, index) =>
            renderItem(item, `${item.id}-mobile-${index}`),
          )}
        </div>
      </div>

      <div dir="ltr" className="hidden md:block py-1">
        <Marquee speed={28} autoFill pauseOnHover={false} className="items-stretch">
          {items.map((item) => renderItem(item, item.id))}
        </Marquee>
      </div>
    </div>
  );
};
