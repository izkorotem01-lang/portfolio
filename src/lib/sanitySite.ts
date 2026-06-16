import { sanityClient, urlForImage } from "@/lib/sanity";
import type { LocaleString, LocaleText } from "@/lib/sanity/locale";
import {
  fetchReviewsFromSanity,
  type ContentReview,
} from "@/lib/sanityReviews";

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
  cardNumber?: string;
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
    whoItsFor?: LocaleString;
    whatWeBuild?: LocaleString;
    headlineBefore?: LocaleText;
    headlineAccent?: LocaleString;
    headlineAfter?: LocaleText;
    howWeWork?: LocaleString;
    columns?: Array<{
      audience?: Array<{
        icon?: string;
        title?: LocaleString;
        description?: LocaleText;
      }>;
      services?: Array<{
        number?: string;
        title?: LocaleText;
        titleAccent?: LocaleString;
        icon?: string;
      }>;
    }>;
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
    starsAriaPrefix?: LocaleString;
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
    trustedBy?: LocaleString;
    showBio?: LocaleString;
    hideBio?: LocaleString;
    cards?: Array<{
      name?: LocaleString;
      role?: LocaleString;
      keywords?: LocaleString;
      bio?: LocaleText;
      badge?: LocaleString;
      variant?: string;
      imageKey?: string;
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
  };
  seo?: {
    title?: LocaleString;
    description?: LocaleText;
  };
} | null;

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
  cardNumber?: string;
  clientName?: string;
  clientRole?: LocaleString;
  tag?: string;
  titleAccent?: string;
  titleRest?: string;
  subtext?: string;
  subSubtext?: string;
  order?: number;
  titleSegments?: Array<{ _key: string; text?: LocaleString; accent?: boolean }>;
  checkpoints?: LocaleString[];
  headerMedia?: SanityProofCardMedia | null;
  bottomMedia?: SanityProofCardMedia[];
  mediaItems?: SanityProofCardMedia[];
  statistics?: SanityProofCardStatistic[];
};

export type SiteContent = {
  homePage: HomePageContent | null;
  siteSettings: SiteSettingsContent | null;
  rizzPage: RizzPageContent;
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

const mapTitleSegments = (doc: SanityProofCard): ProofCardTitleSegment[] => {
  if (doc.titleSegments?.length) {
    return doc.titleSegments
      .filter((segment) => segment.text?.en?.trim() || segment.text?.hb?.trim())
      .map((segment) => ({
        id: segment._key,
        text: segment.text,
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
      clientRole: doc.clientRole,
      headerMedia: mapProofCardMedia(doc.headerMedia) ?? legacyMedia[0],
      titleSegments: mapTitleSegments(doc),
      checkpoints: (doc.checkpoints ?? []).filter(
        (point) => Boolean(point?.en?.trim() || point?.hb?.trim()),
      ),
      bottomMedia: mappedBottom.length > 0 ? mappedBottom : legacyMedia.slice(1),
      statistics: (doc.statistics ?? [])
        .filter((stat) => (stat.label?.en?.trim() || stat.label?.hb?.trim()) && stat.value?.trim())
        .map((stat) => ({
          id: stat._key,
          label: stat.label,
          value: stat.value!.trim(),
        })),
      order: doc.order ?? 0,
    };
  });

const RIZZ_PAGE_QUERY = `*[_type == "rizzPage"][0]{
  nav{
    logoAlt, openMenu, bookCall, viewWork, switchToEn, switchToHb,
    links[]{label, href},
    footerLinks[]{label, href}
  },
  hero{eyebrow, titleLine1, titleLine2, titleAccent, titleAfterAccent, description, tagline, "heroImageLtrUrl": heroImageLtr.asset->url, "heroImageRtlUrl": heroImageRtl.asset->url},
  proof{eyebrow, titlePrimary, titleAccent, subtitle},
  howWeGetYouThere{
    whoItsFor, whatWeBuild, headlineBefore, headlineAccent, headlineAfter, howWeWork,
    columns[]{
      audience[]{icon, title, description},
      services[]{number, title, titleAccent, icon}
    },
    process[]{step, title, icon, description}
  },
  portfolio{eyebrow, titlePrimary, titleAccent, allVideos, categoriesAria, emptyState, untitled},
  testimonials{eyebrow, titleLine1, titleAccent, starsAriaPrefix, starsAriaSuffix},
  founders{
    eyebrow, titleBefore, titleFilmed, titleEdited, titleLived, titleAfter,
    intro, values, trustedBy, showBio, hideBio,
    cards[]{name, role, keywords, bio, badge, variant, imageKey}
  },
  cta{eyebrow, titleLine1, titleAccent, description, tagline, bookCall, emailUs},
  footer{description, navigation, getStarted, getStartedDescription, copyrightPrefix, copyrightSuffix, tagline},
  seo{title, description}
}`;

export const fetchSiteContentFromSanity = async (): Promise<SiteContent> => {
  const [sections, rizzPage, trustedRaw, highlightsRaw, proofRaw, reviews] = await Promise.all([
    sanityClient.fetch<SectionsQueryResult>(SECTIONS_QUERY),
    sanityClient.fetch<RizzPageContent>(RIZZ_PAGE_QUERY),
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
    rizzPage,
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
  return await fetchSiteContentFromSanity();
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
