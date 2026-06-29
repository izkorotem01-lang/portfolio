import { loadBakedSiteContent } from "@/lib/cmsContent";
import { sanityClient } from "@/lib/sanity";
import type { LocaleString, LocaleText } from "@/lib/sanity/locale";
import {
  fetchReviewsFromSanity,
  type ContentReview,
} from "@/lib/sanityReviews";

export type { ContentReview };

export type TrustedClient = {
  id: string;
  name: string;
  logoUrl?: string;
  iconKey?: string;
  url?: string;
  order: number;
};

export type ProofCardMedia = {
  id: string;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  alt?: LocaleString;
  isMain?: boolean;
  quote?: LocaleText;
};

export type ProofCardTitleSegment = {
  id: string;
  text?: LocaleString;
  accent: boolean;
};

export type ProofCardStatistic = {
  id: string;
  label?: LocaleString;
  value: string;
};

export type ProofCard = {
  id: string;
  clientName?: string;
  clientRole?: LocaleString;
  headerMedia?: ProofCardMedia;
  titleSegments: ProofCardTitleSegment[];
  checkpoints: LocaleString[];
  bottomMedia: ProofCardMedia[];
  statistics: ProofCardStatistic[];
  order: number;
};

export type RizzNavLink = { label?: LocaleString; href?: string };

export type RizzSocialLink = {
  _key: string;
  platform?: string;
  url?: string;
  label?: LocaleString;
};

export type RizzPageContent = {
  nav?: {
    logoAlt?: LocaleString;
    openMenu?: LocaleString;
    bookCall?: LocaleString;
    viewWork?: LocaleString;
    switchToEn?: LocaleString;
    switchToHb?: LocaleString;
    links?: RizzNavLink[];
    footerLinks?: RizzNavLink[];
  };
  hero?: {
    eyebrow?: LocaleString;
    titleLine1?: LocaleString;
    titleLine2?: LocaleString;
    titleAccent?: LocaleString;
    description?: LocaleText;
    tagline?: LocaleString;
    titleAfterAccent?: LocaleString;
    heroImageLtrUrl?: string;
    heroImageRtlUrl?: string;
  };
  proof?: {
    eyebrow?: LocaleString;
    titlePrimary?: LocaleString;
    titleAccent?: LocaleString;
    subtitle?: LocaleText;
  };
  howWeGetYouThere?: {
    howWeWork?: LocaleString;
    process?: Array<{
      step?: string;
      title?: LocaleString;
      icon?: string;
      description?: LocaleText;
    }>;
  };
  portfolio?: {
    eyebrow?: LocaleString;
    titlePrimary?: LocaleString;
    titleAccent?: LocaleString;
    allVideos?: LocaleString;
    categoriesAria?: LocaleString;
    emptyState?: LocaleText;
    untitled?: LocaleString;
  };
  testimonials?: {
    eyebrow?: LocaleString;
    titleLine1?: LocaleString;
    titleAccent?: LocaleString;
    starsAriaSuffix?: LocaleString;
  };
  founders?: {
    eyebrow?: LocaleString;
    titleBefore?: LocaleText;
    titleFilmed?: LocaleString;
    titleEdited?: LocaleString;
    titleLived?: LocaleString;
    titleAfter?: LocaleText;
    intro?: LocaleText;
    values?: LocaleString;
    showBio?: LocaleString;
    hideBio?: LocaleString;
    ctaPortraitLeftUrl?: string;
    ctaPortraitRightUrl?: string;
    cards?: Array<{
      name?: LocaleString;
      role?: LocaleString;
      keywords?: LocaleString;
      bio?: LocaleText;
      badge?: LocaleString;
      variant?: string;
      imageUrl?: string;
      imageRef?: string;
      backImageUrl?: string;
      backImageRef?: string;
    }>;
  };
  cta?: {
    eyebrow?: LocaleString;
    titleLine1?: LocaleString;
    titleAccent?: LocaleText;
    description?: LocaleText;
    tagline?: LocaleString;
    bookCall?: LocaleString;
    emailUs?: LocaleString;
  };
  footer?: {
    description?: LocaleText;
    navigation?: LocaleString;
    getStarted?: LocaleString;
    getStartedDescription?: LocaleText;
    copyrightPrefix?: LocaleString;
    copyrightSuffix?: LocaleString;
    tagline?: LocaleString;
    socialLinks?: RizzSocialLink[];
  };
  seo?: {
    title?: LocaleString;
    description?: LocaleText;
  };
} | null;

export type SiteContent = {
  rizzPage: RizzPageContent;
  trustedClients: TrustedClient[];
  proofCards: ProofCard[];
  reviews: ContentReview[];
};

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
    cards[]{
      name, role, keywords, bio, badge, variant,
      "imageUrl": image.asset->url,
      "imageRef": image.asset->_id,
      "backImageUrl": backImage.asset->url,
      "backImageRef": backImage.asset->_id
    }
  },
  cta{eyebrow, titleLine1, titleAccent, description, tagline, bookCall, emailUs},
  footer{
    description, navigation, getStarted, getStartedDescription,
    copyrightPrefix, copyrightSuffix, tagline,
    socialLinks[]{_key, platform, url, label}
  },
  seo{title, description}
}`;

type SanityTrustedClient = {
  _id: string;
  name: string;
  iconKey?: string;
  url?: string;
  order?: number;
  logoUrl?: string;
};

type SanityProofCardMedia = {
  _key: string;
  alt?: LocaleString;
  isMain?: boolean;
  quote?: LocaleText;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
};

type SanityProofCardStatistic = {
  _key: string;
  label?: LocaleString;
  value?: string;
};

type SanityProofCard = {
  _id: string;
  clientName?: string;
  clientRole?: LocaleString;
  order?: number;
  titleSegments?: Array<{ _key: string; text?: LocaleString; accent?: boolean }>;
  checkpoints?: LocaleString[];
  headerMedia?: SanityProofCardMedia | null;
  bottomMedia?: SanityProofCardMedia[];
  statistics?: SanityProofCardStatistic[];
};

const mapProofCardMedia = (item?: SanityProofCardMedia | null): ProofCardMedia | undefined => {
  const quote = item?.quote;
  const hasQuote = Boolean(quote?.en?.trim() || quote?.hb?.trim());
  if (!item || (!item.imageUrl && !item.videoUrl && !hasQuote)) return undefined;
  return {
    id: item._key || "media",
    imageUrl: item.imageUrl || undefined,
    videoUrl: item.videoUrl?.trim() || undefined,
    posterUrl: item.posterUrl || undefined,
    alt: item.alt,
    isMain: Boolean(item.isMain),
    quote: quote || undefined,
  };
};

const mapProofCards = (docs: SanityProofCard[]): ProofCard[] =>
  docs.map((doc) => ({
    id: doc._id,
    clientName: doc.clientName?.trim() || undefined,
    clientRole: doc.clientRole,
    headerMedia: mapProofCardMedia(doc.headerMedia),
    titleSegments: (doc.titleSegments ?? [])
      .filter((segment) => segment.text?.en?.trim() || segment.text?.hb?.trim())
      .map((segment) => ({
        id: segment._key,
        text: segment.text,
        accent: Boolean(segment.accent),
      })),
    checkpoints: (doc.checkpoints ?? []).filter(
      (point) => Boolean(point?.en?.trim() || point?.hb?.trim()),
    ),
    bottomMedia: (doc.bottomMedia ?? [])
      .map((item) => mapProofCardMedia(item))
      .filter((item): item is ProofCardMedia => Boolean(item)),
    statistics: (doc.statistics ?? [])
      .filter((stat) => (stat.label?.en?.trim() || stat.label?.hb?.trim()) && stat.value?.trim())
      .map((stat) => ({
        id: stat._key,
        label: stat.label,
        value: stat.value!.trim(),
      })),
    order: doc.order ?? 0,
  }));

export const fetchSiteContentFromSanity = async (): Promise<SiteContent> => {
  const [rizzPage, trustedRaw, proofRaw, reviews] = await Promise.all([
    sanityClient.fetch<RizzPageContent>(RIZZ_PAGE_QUERY),
    sanityClient.fetch<SanityTrustedClient[]>(TRUSTED_CLIENTS_QUERY),
    sanityClient.fetch<SanityProofCard[]>(PROOF_CARDS_QUERY),
    fetchReviewsFromSanity(sanityClient),
  ]);

  return {
    rizzPage,
    trustedClients: trustedRaw.map((client) => ({
      id: client._id,
      name: client.name,
      logoUrl: client.logoUrl,
      iconKey: client.iconKey,
      url: client.url,
      order: client.order ?? 0,
    })),
    proofCards: mapProofCards(proofRaw),
    reviews,
  };
};

export const fetchSiteContent = async (): Promise<SiteContent> => {
  try {
    return await fetchSiteContentFromSanity();
  } catch (error) {
    if (!import.meta.env.PROD) throw error;

    console.warn("Live Sanity fetch failed, falling back to baked CMS JSON.", error);
    const baked = await loadBakedSiteContent();
    if (baked) return baked;
    throw error;
  }
};

const getYouTubeVideoId = (url: string): string | undefined => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/
  );
  return match?.[1];
};

export const getYouTubeThumbnail = (url: string): string | undefined => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
};

export type YouTubeEmbedOptions = {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  enableJsApi?: boolean;
  origin?: string;
};

export const getYouTubeEmbedUrl = (
  url: string,
  options: YouTubeEmbedOptions = {}
): string | undefined => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return undefined;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    playsinline: "1",
    controls: String(options.controls !== false ? 1 : 0),
    autoplay: String(options.autoplay ? 1 : 0),
    mute: String(options.muted ? 1 : 0),
  });

  if (options.enableJsApi) {
    params.set("enablejsapi", "1");
    if (options.origin) {
      params.set("origin", options.origin);
    }
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const isYouTubeUrl = (url: string): boolean =>
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url);
