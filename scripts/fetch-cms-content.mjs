import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, "..", "public", "cms");

const projectId = process.env.VITE_SANITY_PROJECT_ID || "v9h3c4gc";
const dataset = process.env.VITE_SANITY_DATASET || "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  useCdn: true,
});

const TRUSTED_CLIENTS_QUERY = `*[_type == "trustedByClient"] | order(order asc) {
  _id,
  name,
  iconKey,
  url,
  order,
  "logoUrl": logo.asset->url
}`;

const PROOF_CARD_MEDIA_FIELDS = `{
  _key,
  alt,
  isMain,
  quote,
  "imageUrl": image.asset->url,
  "videoUrl": coalesce(videoFile.asset->url, youtubeUrl),
  "posterUrl": poster.asset->url
}`;

const PROOF_CARDS_QUERY = `*[_type == "proofCard" && active != false] | order(order asc) {
  _id,
  clientName,
  clientRole,
  order,
  titleSegments[]{
    _key,
    text,
    accent
  },
  checkpoints,
  "headerMedia": headerMedia ${PROOF_CARD_MEDIA_FIELDS},
  bottomMedia[] ${PROOF_CARD_MEDIA_FIELDS},
  statistics[]{
    _key,
    label,
    value
  }
}`;

const REVIEWS_QUERY = `*[_type == "review"] | order(order asc) {
  _id,
  name,
  company,
  rating,
  "text": {"en": text.en, "hb": coalesce(text.hb, text.he)},
  order
}`;

const RIZZ_PAGE_QUERY = `*[_type == "rizzPage"][0]{
  nav{
    logoAlt, openMenu, bookCall, viewWork, switchToEn, switchToHb,
    links[]{label, href},
    footerLinks[]{label, href}
  },
  hero{eyebrow, titleLine1, titleLine2, titleAccent, titleAfterAccent, description, tagline, "heroImageLtrUrl": heroImageLtr.asset->url, "heroImageRtlUrl": heroImageRtl.asset->url},
  proof{eyebrow, titlePrimary, titleAccent, subtitle},
  howWeGetYouThere{
    howWeWork,
    process[]{step, title, icon, description}
  },
  portfolio{eyebrow, titlePrimary, titleAccent, allVideos, categoriesAria, emptyState, untitled},
  testimonials{eyebrow, titleLine1, titleAccent, starsAriaSuffix},
  founders{
    eyebrow, titleBefore, titleFilmed, titleEdited, titleLived, titleAfter,
    intro, values, showBio, hideBio,
    "ctaPortraitLeftUrl": ctaPortraitLeft.asset->url,
    "ctaPortraitRightUrl": ctaPortraitRight.asset->url,
    cards[]{name, role, keywords, bio, badge, variant, imageKey, "imageUrl": image.asset->url}
  },
  cta{eyebrow, titleLine1, titleAccent, description, tagline, bookCall, emailUs},
  footer{
    description, navigation, getStarted, getStartedDescription,
    copyrightPrefix, copyrightSuffix, tagline,
    socialLinks[]{_key, platform, url, label}
  },
  seo{title, description}
}`;

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
  "thumbnailUrl": thumbnail.asset->url,
  autoplayInBackground,
  order,
  allWorkOrder,
  _createdAt,
  _updatedAt
}`;

const hasLocalizedText = (field) =>
  Boolean(field?.en?.trim() || field?.hb?.trim());

const mapReviews = (docs) =>
  docs
    .filter((doc) => doc.name?.trim())
    .map((doc) => ({
      id: doc._id,
      name: doc.name ?? "",
      company: doc.company,
      rating: doc.rating ?? 5,
      text: doc.text,
      order: doc.order ?? 0,
    }));

const mapCategories = (docs) =>
  docs
    .filter((doc) => doc.showInFilters !== false)
    .map((doc) => ({
      id: doc._id,
      name: doc.name?.en ?? "",
      nameHe: doc.name?.hb ?? doc.name?.he ?? "",
      order: doc.order ?? 0,
      createdAt: doc._createdAt,
      updatedAt: doc._updatedAt,
    }));

const mapVideos = (docs) =>
  docs
    .filter((doc) => doc.videoUrl?.trim())
    .map((doc) => ({
      id: doc._id,
      categoryId: doc.categoryId ?? "",
      title: doc.title?.en ?? "",
      titleHe: doc.title?.hb ?? doc.title?.he ?? "",
      subtitle: doc.subtitle?.en ?? "",
      subtitleHe: doc.subtitle?.hb ?? doc.subtitle?.he ?? "",
      videoUrl: doc.videoUrl ?? "",
      videoWidth: doc.videoWidth || undefined,
      videoHeight: doc.videoHeight || undefined,
      thumbnailUrl: doc.thumbnailUrl || undefined,
      autoplayInBackground: doc.autoplayInBackground ?? false,
      order: doc.order ?? 0,
      allWorkOrder: doc.allWorkOrder,
      createdAt: doc._createdAt,
      updatedAt: doc._updatedAt,
    }));

const mapProofCardMedia = (item, fallbackId = "media") => {
  const quote = item?.quote;
  const hasQuote = hasLocalizedText(quote);
  if (!item || (!item.imageUrl && !item.videoUrl && !hasQuote)) return undefined;
  return {
    id: item._key || fallbackId,
    imageUrl: item.imageUrl || undefined,
    videoUrl: item.videoUrl?.trim() || undefined,
    posterUrl: item.posterUrl || undefined,
    alt: item.alt,
    isMain: Boolean(item.isMain),
    quote: hasQuote ? quote : undefined,
  };
};

const mapProofCards = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    clientName: doc.clientName?.trim() || undefined,
    clientRole: doc.clientRole,
    headerMedia: mapProofCardMedia(doc.headerMedia, "header"),
    titleSegments: (doc.titleSegments ?? [])
      .filter((segment) => hasLocalizedText(segment.text))
      .map((segment) => ({
        id: segment._key,
        text: segment.text,
        accent: Boolean(segment.accent),
      })),
    checkpoints: (doc.checkpoints ?? []).filter((point) => hasLocalizedText(point)),
    bottomMedia: (doc.bottomMedia ?? [])
      .map((item) => mapProofCardMedia(item))
      .filter(Boolean),
    statistics: (doc.statistics ?? [])
      .filter((stat) => hasLocalizedText(stat.label) && stat.value?.trim())
      .map((stat) => ({
        id: stat._key,
        label: stat.label,
        value: stat.value.trim(),
      })),
    order: doc.order ?? 0,
  }));

const fetchSiteContent = async () => {
  const [rizzPage, trustedRaw, proofRaw, reviewDocs] = await Promise.all([
    client.fetch(RIZZ_PAGE_QUERY),
    client.fetch(TRUSTED_CLIENTS_QUERY),
    client.fetch(PROOF_CARDS_QUERY),
    client.fetch(REVIEWS_QUERY),
  ]);

  return {
    rizzPage: rizzPage ?? null,
    trustedClients: trustedRaw.map((client) => ({
      id: client._id,
      name: client.name,
      logoUrl: client.logoUrl,
      iconKey: client.iconKey,
      url: client.url,
      order: client.order ?? 0,
    })),
    proofCards: mapProofCards(proofRaw),
    reviews: mapReviews(reviewDocs),
  };
};

const fetchPortfolio = async () => {
  const [categories, videos] = await Promise.all([
    client.fetch(CATEGORIES_QUERY),
    client.fetch(VIDEOS_QUERY),
  ]);

  return {
    categories: mapCategories(categories),
    videos: mapVideos(videos),
  };
};

await mkdir(outputDir, { recursive: true });

const [siteContent, portfolio] = await Promise.all([
  fetchSiteContent(),
  fetchPortfolio(),
]);

await writeFile(
  join(outputDir, "site-content.json"),
  `${JSON.stringify(siteContent, null, 2)}\n`,
  "utf8"
);
await writeFile(
  join(outputDir, "portfolio.json"),
  `${JSON.stringify(portfolio, null, 2)}\n`,
  "utf8"
);

console.log(
  `Fetched CMS content from ${projectId}/${dataset} -> public/cms/*.json`
);
