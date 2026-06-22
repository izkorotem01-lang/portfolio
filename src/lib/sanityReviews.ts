import type { LocaleText } from "@/lib/sanity/locale";

export type ContentReview = {
  id: string;
  name: string;
  company?: string;
  rating: number;
  text?: LocaleText;
  order: number;
};

type SanityReviewDoc = {
  _id: string;
  name?: string;
  company?: string;
  rating?: number;
  text?: LocaleText;
  order?: number;
};

const REVIEWS_QUERY = `*[_type == "review"] | order(order asc) {
  _id,
  name,
  company,
  rating,
  "text": {"en": text.en, "hb": coalesce(text.hb, text.he)},
  order
}`;

export const fetchReviewsFromSanity = async (
  client: { fetch: <T>(query: string) => Promise<T> }
): Promise<ContentReview[]> => {
  const docs = await client.fetch<SanityReviewDoc[]>(REVIEWS_QUERY);
  return docs
    .filter((doc) => doc.name?.trim())
    .map((doc) => ({
      id: doc._id,
      name: doc.name ?? "",
      company: doc.company,
      rating: doc.rating ?? 5,
      text: doc.text,
      order: doc.order ?? 0,
    }));
};
