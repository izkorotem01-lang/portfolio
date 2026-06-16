import type { LocaleText } from "@/lib/sanity/locale";
import type { ReviewItem } from "@/lib/reviewTypes";
import {
  getYouTubeThumbnail,
  isYouTubeUrl,
} from "@/lib/portfolioService";

export type ContentReview = {
  id: string;
  name: string;
  company?: string;
  rating: number;
  text?: LocaleText;
  videoUrl?: string;
  thumbnailUrl?: string;
  screenshotUrl?: string;
  showOnMainSection: boolean;
  order: number;
};

type SanityReviewDoc = {
  _id: string;
  name?: string;
  company?: string;
  rating?: number;
  text?: LocaleText;
  videoUrl?: string;
  thumbnailUrl?: string;
  screenshotUrl?: string;
  showOnMainSection?: boolean;
  order?: number;
};

const REVIEWS_QUERY = `*[_type == "review"] | order(order asc) {
  _id,
  name,
  company,
  rating,
  "text": {"en": text.en, "hb": coalesce(text.hb, text.he)},
  showOnMainSection,
  order,
  "videoUrl": coalesce(videoFile.asset->url, youtubeUrl),
  "thumbnailUrl": thumbnail.asset->url,
  "screenshotUrl": screenshot.asset->url
}`;

export const fetchReviewsFromSanity = async (
  client: { fetch: <T>(query: string) => Promise<T> }
): Promise<ContentReview[]> => {
  const docs = await client.fetch<SanityReviewDoc[]>(REVIEWS_QUERY);
  return docs
    .filter((doc) => doc.name?.trim())
    .map((doc) => {
      const videoUrl = doc.videoUrl?.trim() || undefined;
      return {
        id: doc._id,
        name: doc.name ?? "",
        company: doc.company,
        rating: doc.rating ?? 5,
        text: doc.text,
        videoUrl,
        thumbnailUrl:
          doc.thumbnailUrl ||
          (videoUrl && isYouTubeUrl(videoUrl)
            ? getYouTubeThumbnail(videoUrl)
            : undefined),
        screenshotUrl: doc.screenshotUrl || undefined,
        showOnMainSection: doc.showOnMainSection ?? false,
        order: doc.order ?? 0,
      };
    });
};

export const toReviewItem = (
  review: ContentReview,
  pick: (field?: LocaleText) => string
): ReviewItem => {
  const video = review.videoUrl;
  const isYoutube = Boolean(video && isYouTubeUrl(video));
  const thumbnail =
    review.thumbnailUrl ||
    review.screenshotUrl ||
    (video && isYoutube ? getYouTubeThumbnail(video) : undefined);

  return {
    id: review.id,
    name: review.name,
    company: review.company ?? "",
    rating: review.rating,
    text: pick(review.text),
    video,
    thumbnail,
    screenshot: review.screenshotUrl,
    isYouTube: isYoutube,
  };
};

export const splitMainSectionReviews = (reviews: ContentReview[]) => {
  if (reviews.length === 0) {
    return { left: [] as ContentReview[], right: [] as ContentReview[] };
  }

  const flagged = reviews.filter((review) => review.showOnMainSection);
  const main = flagged.length > 0 ? flagged : reviews;

  const left = main.filter((_, index) => index % 2 === 0);
  const right = main.filter((_, index) => index % 2 === 1);

  if (right.length === 0 || left.length === 0) {
    return { left: main, right: main };
  }

  return { left, right };
};
