import { sanityClient, urlForImage } from "@/lib/sanity";
import type { LocaleString, LocaleText } from "@/lib/sanity/locale";
import {
  fetchReviewsFromSanity,
  type ContentReview,
} from "@/lib/sanityReviews";
import { loadBakedSiteContent } from "@/lib/cmsContent";

export type { ContentReview };

export type AboutFounder = {
  _key: string;
  name?: LocaleString;
  role?: LocaleString;
  bio?: LocaleText;
  photoUrl?: string;
  photoAlt?: LocaleString;
  glowColor?: "cyan" | "orange";
  order?: number;
};

export type AboutStat = {
  _key: string;
  value?: string;
  label?: LocaleString;
};

export type AboutCapability = {
  _key: string;
  title?: LocaleString;
  icon?: string;
};

export type ContactProcessStep = {
  _key: string;
  title?: LocaleString;
  description?: LocaleText;
};

export type HomePageContent = {
  hero?: {
    wordmarkUrl?: string;
    wordmarkAlt?: LocaleString;
    subtitle?: LocaleString;
    cta?: LocaleString;
  };
  trustedBy?: {
    title?: LocaleString;
    subtitle?: LocaleString;
    visitLabel?: LocaleString;
    clientLabel?: LocaleString;
  };
  showcaseTitle?: LocaleString;
  about?: {
    title?: LocaleString;
    headline?: LocaleString;
    subline?: LocaleString;
    founders?: AboutFounder[];
    audience?: LocaleText;
    capabilities?: AboutCapability[];
    agencyTitle?: LocaleString;
    agencyContent?: LocaleText;
    agencyMission?: LocaleText;
    stats?: AboutStat[];
  };
  portfolioSection?: {
    title?: LocaleString;
    allWorkLabel?: LocaleString;
    expandVideoLabel?: LocaleString;
    maxVideosDisplayed?: number;
  };
  contactSection?: {
    title?: LocaleString;
    subtitle?: LocaleString;
    processSteps?: ContactProcessStep[];
  };
  servicesSection?: {
    title?: LocaleString;
    subtitle?: LocaleText;
  };
  reviewsSection?: {
    title?: LocaleString;
    subtitle?: LocaleText;
    ctaTitle?: LocaleString;
    ctaSubtitle?: LocaleText;
    ctaContact?: LocaleString;
    ctaPortfolio?: LocaleString;
  };
};

export type SiteSettingsContent = {
  contactEmail?: string;
  contactPhone?: string;
  whatsappLabel?: LocaleString;
  whatsappUrl?: string;
  footerText?: LocaleString;
  socialLinks?: Array<{
    _key: string;
    platform?: string;
    url?: string;
    label?: LocaleString;
  }>;
};

export type TrustedClient = {
  id: string;
  name: string;
  logoUrl?: string;
  iconKey?: string;
  url?: string;
  order: number;
};

export type HighlightVideo = {
  id: string;
  title?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order: number;
};

export type ProofCardMedia = {
  id: string;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  alt?: string;
  isMain?: boolean;
  quote?: string;
};

export type ProofCardTitleSegment = {
  id: string;
  text: string;
  accent: boolean;
};

export type ProofCardStatistic = {
  id: string;
  label: string;
  value: string;
};

export type ProofCard = {
  id: string;
  cardNumber?: string;
  clientName?: string;
  clientRole?: string;
  headerMedia?: ProofCardMedia;
  titleSegments: ProofCardTitleSegment[];
  checkpoints: string[];
  bottomMedia: ProofCardMedia[];
  statistics: ProofCardStatistic[];
  order: number;
};

const SECTIONS_QUERY = `{
  "introduction": *[_type == "introductionSection"][0]{
    hero {
      "wordmarkUrl": wordmarkImage.asset->url,
      wordmarkAlt,
      subtitle,
      cta
    },
    trustedBy { title, subtitle, visitLabel, clientLabel }
  },
  "highlights": *[_type == "highlightsSection"][0]{ showcaseTitle },
  "about": *[_type == "aboutSection"][0]{
    title,
    headline,
    subline,
    founders[]{
      _key,
      name,
      role,
      bio,
      "photoUrl": photo.asset->url,
      photoAlt,
      glowColor,
      order
    },
    audience,
    capabilities[]{ _key, title, icon }
  },
  "work": *[_type == "workSection"][0]{ title, allWorkLabel, expandVideoLabel, maxVideosDisplayed },
  "services": *[_type == "servicesSection"][0]{ title, subtitle },
  "reviews": *[_type == "reviewsSection"][0]{
    title,
    subtitle,
    ctaTitle,
    ctaSubtitle,
    ctaContact,
    ctaPortfolio
  },
  "contact": *[_type == "contactSection"][0]{
    title,
    subtitle,
    contactEmail,
    contactPhone,
    whatsappLabel,
    whatsappUrl,
    processSteps[]{ _key, title, description },
    socialLinks[]{ _key, platform, url, label }
  },
  "settings": *[_type == "siteSettings"][0]{ footerText },
  "legacyHomePage": *[_type == "homePage"][0]{
    hero {
      "wordmarkUrl": wordmarkImage.asset->url,
      wordmarkAlt,
      subtitle,
      cta
    },
    trustedBy { title, subtitle, visitLabel, clientLabel },
    showcaseTitle,
    about {
      title,
      founders[]{
        _key,
        name,
        role,
        bio,
        "photoUrl": photo.asset->url,
        photoAlt,
        glowColor,
        order
      },
      agencyTitle,
      agencyContent,
      agencyMission,
      stats[]{ _key, value, label }
    },
    portfolioSection { title, allWorkLabel, expandVideoLabel, maxVideosDisplayed },
    contactSection { title, subtitle, processSteps[]{ _key, title, description } },
    reviewsSection {
      title,
      subtitle,
      ctaTitle,
      ctaSubtitle,
      ctaContact,
      ctaPortfolio
    }
  },
  "legacySettings": *[_type == "siteSettings"][0]{
    contactEmail,
    contactPhone,
    whatsappLabel,
    whatsappUrl,
    footerText,
    socialLinks[]{ _key, platform, url, label }
  }
}`;

const TRUSTED_CLIENTS_QUERY = `*[_type == "trustedByClient"] | order(order asc) {
  _id,
  name,
  iconKey,
  url,
  order,
  "logoUrl": logo.asset->url
}`;

const HIGHLIGHT_VIDEOS_QUERY = `*[_type == "highlightVideo" && active != false] | order(order asc)[0...4] {
  _id,
  title,
  order,
  "videoUrl": videoFile.asset->url,
  "thumbnailUrl": coalesce(thumbnail.asset->url, null)
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
  cardNumber,
  clientName,
  clientRole,
  order,
  tag,
  titleAccent,
  titleRest,
  subtext,
  subSubtext,
  titleSegments[]{
    _key,
    text,
    accent
  },
  checkpoints,
  "headerMedia": headerMedia ${PROOF_CARD_MEDIA_FIELDS},
  bottomMedia[] ${PROOF_CARD_MEDIA_FIELDS},
  mediaItems[] ${PROOF_CARD_MEDIA_FIELDS},
  statistics[]{
    _key,
    label,
    value
  }
}`;

type SanityTrustedClient = {
  _id: string;
  name: string;
  iconKey?: string;
  url?: string;
  order?: number;
  logoUrl?: string;
};

type SanityHighlightVideo = {
  _id: string;
  title?: string;
  videoUrl?: string;
  order?: number;
  thumbnailUrl?: string;
};

type SanityProofCardMedia = {
  _key: string;
  alt?: string;
  isMain?: boolean;
  quote?: string;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
};

type SanityProofCardStatistic = {
  _key: string;
  label?: string;
  value?: string;
};

type SanityProofCard = {
  _id: string;
  cardNumber?: string;
  clientName?: string;
  clientRole?: string;
  tag?: string;
  titleAccent?: string;
  titleRest?: string;
  subtext?: string;
  subSubtext?: string;
  order?: number;
  titleSegments?: Array<{ _key: string; text?: string; accent?: boolean }>;
  checkpoints?: string[];
  headerMedia?: SanityProofCardMedia | null;
  bottomMedia?: SanityProofCardMedia[];
  mediaItems?: SanityProofCardMedia[];
  statistics?: SanityProofCardStatistic[];
};

export type SiteContent = {
  homePage: HomePageContent | null;
  siteSettings: SiteSettingsContent | null;
  trustedClients: TrustedClient[];
  highlightVideos: HighlightVideo[];
  proofCards: ProofCard[];
  reviews: ContentReview[];
};

type SectionsQueryResult = {
  introduction?: HomePageContent | null;
  highlights?: { showcaseTitle?: LocaleString } | null;
  about?: HomePageContent["about"] | null;
  work?: HomePageContent["portfolioSection"] | null;
  services?: HomePageContent["servicesSection"] | null;
  reviews?: HomePageContent["reviewsSection"] | null;
  contact?: SiteSettingsContent & HomePageContent["contactSection"] | null;
  settings?: { footerText?: LocaleString } | null;
  legacyHomePage?: HomePageContent | null;
  legacySettings?: SiteSettingsContent | null;
};

const buildHomePage = (sections: SectionsQueryResult): HomePageContent | null => {
  const legacy = sections.legacyHomePage;
  const introduction = sections.introduction;
  const about = sections.about ?? legacy?.about;

  if (
    !introduction?.hero &&
    !sections.highlights?.showcaseTitle &&
    !about &&
    !sections.work &&
    !sections.contact?.title &&
    !legacy
  ) {
    return legacy ?? null;
  }

  return {
    hero: introduction?.hero ?? legacy?.hero,
    trustedBy: introduction?.trustedBy ?? legacy?.trustedBy,
    showcaseTitle: sections.highlights?.showcaseTitle ?? legacy?.showcaseTitle,
    about,
    portfolioSection: sections.work ?? legacy?.portfolioSection,
    contactSection: sections.contact?.title || sections.contact?.subtitle
      ? {
          title: sections.contact.title,
          subtitle: sections.contact.subtitle,
          processSteps: sections.contact.processSteps,
        }
      : legacy?.contactSection,
    servicesSection: sections.services,
    reviewsSection: sections.reviews ?? legacy?.reviewsSection,
  };
};

const buildSiteSettings = (sections: SectionsQueryResult): SiteSettingsContent | null => {
  const contact = sections.contact;
  const settings = sections.settings;
  const legacy = sections.legacySettings;

  if (!contact?.contactEmail && !settings?.footerText && !legacy) {
    return legacy ?? null;
  }

  return {
    contactEmail: contact?.contactEmail ?? legacy?.contactEmail,
    contactPhone: contact?.contactPhone ?? legacy?.contactPhone,
    whatsappLabel: contact?.whatsappLabel ?? legacy?.whatsappLabel,
    whatsappUrl: contact?.whatsappUrl ?? legacy?.whatsappUrl,
    footerText: settings?.footerText ?? legacy?.footerText,
    socialLinks: contact?.socialLinks ?? legacy?.socialLinks,
  };
};

const mapProofCardMedia = (item?: SanityProofCardMedia | null): ProofCardMedia | undefined => {
  const quote = item?.quote?.trim();
  if (!item || (!item.imageUrl && !item.videoUrl && !quote)) return undefined;
  return {
    id: item._key || "media",
    imageUrl: item.imageUrl || undefined,
    videoUrl: item.videoUrl?.trim() || undefined,
    posterUrl: item.posterUrl || undefined,
    alt: item.alt?.trim() || undefined,
    isMain: Boolean(item.isMain),
    quote: quote || undefined,
  };
};

const mapTitleSegments = (doc: SanityProofCard): ProofCardTitleSegment[] => {
  if (doc.titleSegments?.length) {
    return doc.titleSegments
      .filter((segment) => segment.text?.trim())
      .map((segment) => ({
        id: segment._key,
        text: segment.text!.trim(),
        accent: Boolean(segment.accent),
      }));
  }

  const legacy: ProofCardTitleSegment[] = [];
  if (doc.titleAccent?.trim()) {
    legacy.push({ id: "legacy-accent", text: doc.titleAccent.trim(), accent: true });
  }
  if (doc.titleRest?.trim()) {
    legacy.push({ id: "legacy-rest", text: doc.titleRest.trim(), accent: false });
  }
  return legacy;
};

const mapProofCards = (docs: SanityProofCard[]): ProofCard[] =>
  docs.map((doc) => {
    const legacyMedia = (doc.mediaItems ?? [])
      .map((item) => mapProofCardMedia(item))
      .filter((item): item is ProofCardMedia => Boolean(item));

    const mappedBottom = (doc.bottomMedia ?? [])
      .map((item) => mapProofCardMedia(item))
      .filter((item): item is ProofCardMedia => Boolean(item));

    return {
      id: doc._id,
      cardNumber: doc.cardNumber?.trim() || undefined,
      clientName: doc.clientName?.trim() || doc.subtext?.trim() || undefined,
      clientRole:
        doc.clientRole?.trim() || doc.subSubtext?.trim() || doc.tag?.trim() || undefined,
      headerMedia: mapProofCardMedia(doc.headerMedia) ?? legacyMedia[0],
      titleSegments: mapTitleSegments(doc),
      checkpoints: (doc.checkpoints ?? []).map((point) => point.trim()).filter(Boolean),
      bottomMedia: mappedBottom.length > 0 ? mappedBottom : legacyMedia.slice(1),
      statistics: (doc.statistics ?? [])
        .filter((stat) => stat.label?.trim() && stat.value?.trim())
        .map((stat) => ({
          id: stat._key,
          label: stat.label!.trim(),
          value: stat.value!.trim(),
        })),
      order: doc.order ?? 0,
    };
  });

export const fetchSiteContentFromSanity = async (): Promise<SiteContent> => {
  const [sections, trustedRaw, highlightsRaw, proofRaw, reviews] = await Promise.all([
    sanityClient.fetch<SectionsQueryResult>(SECTIONS_QUERY),
    sanityClient.fetch<SanityTrustedClient[]>(TRUSTED_CLIENTS_QUERY),
    sanityClient.fetch<SanityHighlightVideo[]>(HIGHLIGHT_VIDEOS_QUERY),
    sanityClient.fetch<SanityProofCard[]>(PROOF_CARDS_QUERY),
    fetchReviewsFromSanity(sanityClient),
  ]);

  const homePage = buildHomePage(sections);
  const siteSettings = buildSiteSettings(sections);

  return {
    homePage,
    siteSettings,
    trustedClients: trustedRaw.map((client) => ({
      id: client._id,
      name: client.name,
      logoUrl: client.logoUrl,
      iconKey: client.iconKey,
      url: client.url,
      order: client.order ?? 0,
    })),
    highlightVideos: highlightsRaw
      .filter((video) => video.videoUrl?.trim())
      .map((video) => ({
        id: video._id,
        title: video.title?.trim() || undefined,
        videoUrl: video.videoUrl ?? "",
        thumbnailUrl: video.thumbnailUrl || undefined,
        order: video.order ?? 0,
      })),
    proofCards: mapProofCards(proofRaw),
    reviews,
  };
};

export const fetchSiteContent = async (): Promise<SiteContent> => {
  if (import.meta.env.PROD) {
    const baked = await loadBakedSiteContent();
    if (baked) return baked;
  }

  try {
    return await fetchSiteContentFromSanity();
  } catch (error) {
    const baked = await loadBakedSiteContent();
    if (baked) {
      console.warn("Sanity fetch failed; using baked CMS content.", error);
      return baked;
    }
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

export const resolveHighlightThumbnail = (video: HighlightVideo): string | undefined =>
  video.thumbnailUrl;
