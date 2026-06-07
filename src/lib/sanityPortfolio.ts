import { Timestamp } from "firebase/firestore";
import { sanityClient, urlForImage } from "@/lib/sanity";
import type { PortfolioCategory, PortfolioVideo } from "@/lib/portfolioService";

type LocalizedString = {
  en?: string;
  he?: string;
};

type SanityCategory = {
  _id: string;
  name?: LocalizedString;
  order?: number;
  showInFilters?: boolean;
  _createdAt: string;
  _updatedAt: string;
};

type SanityVideo = {
  _id: string;
  title?: LocalizedString;
  subtitle?: LocalizedString;
  categoryId?: string;
  videoUrl?: string;
  videoWidth?: number;
  videoHeight?: number;
  thumbnail?: { asset?: { _ref?: string } };
  autoplayInBackground?: boolean;
  order?: number;
  allWorkOrder?: number;
  _createdAt: string;
  _updatedAt: string;
};

const CATEGORIES_QUERY = `*[_type == "portfolioCategory"] | order(order asc) {
  _id,
  name,
  order,
  showInFilters,
  _createdAt,
  _updatedAt
}`;

const VIDEOS_QUERY = `*[_type == "portfolioVideo"] | order(coalesce(allWorkOrder, order) asc) {
  _id,
  title,
  subtitle,
  "categoryId": category._ref,
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  "videoWidth": videoFile.asset->metadata.dimensions.width,
  "videoHeight": videoFile.asset->metadata.dimensions.height,
  thumbnail,
  autoplayInBackground,
  order,
  allWorkOrder,
  _createdAt,
  _updatedAt
}`;

const VIDEOS_BY_CATEGORY_QUERY = `*[_type == "portfolioVideo" && category._ref == $categoryId] | order(order asc) {
  _id,
  title,
  subtitle,
  "categoryId": category._ref,
  "videoUrl": coalesce(videoFile.asset->url, videoUrl),
  "videoWidth": videoFile.asset->metadata.dimensions.width,
  "videoHeight": videoFile.asset->metadata.dimensions.height,
  thumbnail,
  autoplayInBackground,
  order,
  allWorkOrder,
  _createdAt,
  _updatedAt
}`;

const toTimestamp = (iso: string) => Timestamp.fromDate(new Date(iso));

const mapCategory = (doc: SanityCategory): PortfolioCategory => ({
  id: doc._id,
  name: doc.name?.en ?? "",
  nameHe: doc.name?.he ?? "",
  order: doc.order ?? 0,
  createdAt: toTimestamp(doc._createdAt),
  updatedAt: toTimestamp(doc._updatedAt),
});

const mapVideo = (doc: SanityVideo): PortfolioVideo => ({
  id: doc._id,
  categoryId: doc.categoryId ?? "",
  title: doc.title?.en ?? "",
  titleHe: doc.title?.he ?? "",
  subtitle: doc.subtitle?.en ?? "",
  subtitleHe: doc.subtitle?.he ?? "",
  videoUrl: doc.videoUrl ?? "",
  videoWidth: doc.videoWidth || undefined,
  videoHeight: doc.videoHeight || undefined,
  thumbnailUrl: doc.thumbnail
    ? urlForImage(doc.thumbnail).width(800).auto("format").url()
    : undefined,
  autoplayInBackground: doc.autoplayInBackground ?? false,
  order: doc.order ?? 0,
  allWorkOrder: doc.allWorkOrder,
  createdAt: toTimestamp(doc._createdAt),
  updatedAt: toTimestamp(doc._updatedAt),
});

export const fetchCategoriesFromSanity = async (): Promise<PortfolioCategory[]> => {
  const docs = await sanityClient.fetch<SanityCategory[]>(CATEGORIES_QUERY);
  return docs.filter((doc) => doc.showInFilters !== false).map(mapCategory);
};

export const fetchVideosFromSanity = async (): Promise<PortfolioVideo[]> => {
  const docs = await sanityClient.fetch<SanityVideo[]>(VIDEOS_QUERY);
  return docs.filter((doc) => doc.videoUrl?.trim()).map(mapVideo);
};

export const fetchVideosByCategoryFromSanity = async (
  categoryId: string
): Promise<PortfolioVideo[]> => {
  const docs = await sanityClient.fetch<SanityVideo[]>(
    VIDEOS_BY_CATEGORY_QUERY,
    { categoryId }
  );
  return docs.filter((doc) => doc.videoUrl?.trim()).map(mapVideo);
};
