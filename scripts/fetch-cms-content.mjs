import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
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

const imageBuilder = imageUrlBuilder({ projectId, dataset });

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

const REVIEWS_QUERY = `*[_type == "review"] | order(order asc) {
  _id,
  name,
  company,
  rating,
  text,
  showOnMainSection,
  order,
  "videoUrl": coalesce(videoFile.asset->url, youtubeUrl),
  "thumbnailUrl": thumbnail.asset->url,
  "screenshotUrl": screenshot.asset->url
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

const isYouTubeUrl = (url) =>
  Boolean(url && /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url));

const getYouTubeThumbnail = (url) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#/]+)/
  );
  return match?.[1]
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : undefined;
};

const buildHomePage = (sections) => {
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
    contactSection:
      sections.contact?.title || sections.contact?.subtitle
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

const buildSiteSettings = (sections) => {
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

const mapReviews = (docs) =>
  docs
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

const mapCategories = (docs) =>
  docs
    .filter((doc) => doc.showInFilters !== false)
    .map((doc) => ({
      id: doc._id,
      name: doc.name?.en ?? "",
      nameHe: doc.name?.he ?? "",
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
      titleHe: doc.title?.he ?? "",
      subtitle: doc.subtitle?.en ?? "",
      subtitleHe: doc.subtitle?.he ?? "",
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

const fetchSiteContent = async () => {
  const [sections, trustedRaw, highlightsRaw, reviewDocs] = await Promise.all([
    client.fetch(SECTIONS_QUERY),
    client.fetch(TRUSTED_CLIENTS_QUERY),
    client.fetch(HIGHLIGHT_VIDEOS_QUERY),
    client.fetch(REVIEWS_QUERY),
  ]);

  return {
    homePage: buildHomePage(sections),
    siteSettings: buildSiteSettings(sections),
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
