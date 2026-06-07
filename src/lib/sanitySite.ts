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
  "work": *[_type == "workSection"][0]{ title, allWorkLabel, expandVideoLabel },
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
    portfolioSection { title, allWorkLabel, expandVideoLabel },
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

export type SiteContent = {
  homePage: HomePageContent | null;
  siteSettings: SiteSettingsContent | null;
  trustedClients: TrustedClient[];
  highlightVideos: HighlightVideo[];
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

export const fetchSiteContent = async (): Promise<SiteContent> => {
  const [sections, trustedRaw, highlightsRaw, reviews] = await Promise.all([
    sanityClient.fetch<SectionsQueryResult>(SECTIONS_QUERY),
    sanityClient.fetch<SanityTrustedClient[]>(TRUSTED_CLIENTS_QUERY),
    sanityClient.fetch<SanityHighlightVideo[]>(HIGHLIGHT_VIDEOS_QUERY),
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
    reviews,
  };
};

export const getYouTubeThumbnail = (url: string): string | undefined => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/
  );
  if (!match?.[1]) return undefined;
  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
};

export const resolveHighlightThumbnail = (video: HighlightVideo): string | undefined =>
  video.thumbnailUrl;
