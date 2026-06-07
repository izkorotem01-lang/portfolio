import React, { useMemo } from "react";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { useSiteContent } from "@/contexts/SiteContentContext";
import {
  splitMainSectionReviews,
  toReviewItem,
  type ContentReview,
} from "@/lib/sanityReviews";

export type IntroReviewsRailProps = {
  side: "left" | "right";
  reviews: ContentReview[];
};

export const IntroReviewsRail = ({ side, reviews }: IntroReviewsRailProps) => {
  const { pick } = useSiteContent();
  const items = useMemo(
    () =>
      reviews.length > 0
        ? reviews.map((review) => toReviewItem(review, pick))
        : undefined,
    [reviews, pick]
  );

  return (
    <aside
      id={side === "left" ? "intro-reviews-left" : "intro-reviews-right"}
      className={`intro-reviews-rail intro-reviews-rail--${side}`}
      aria-label={side === "left" ? "Client reviews" : "More client reviews"}
    >
      <ReviewsCarousel
        variant="hero"
        autoOnly
        reviews={items}
        startIndex={side === "right" && items && items.length > 1 ? 1 : 0}
      />
    </aside>
  );
};

type IntroReviewsRailsProps = {
  reviews: ContentReview[];
};

export const IntroReviewsRails = ({ reviews }: IntroReviewsRailsProps) => {
  const { left, right } = useMemo(
    () => splitMainSectionReviews(reviews),
    [reviews]
  );

  return (
    <>
      <IntroReviewsRail side="left" reviews={left} />
      <IntroReviewsRail side="right" reviews={right} />
    </>
  );
};

export default IntroReviewsRails;
