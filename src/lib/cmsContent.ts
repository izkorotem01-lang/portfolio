import { Timestamp } from "firebase/firestore";
import type { PortfolioCategory, PortfolioVideo } from "@/lib/portfolioService";
import type { SiteContent } from "@/lib/sanitySite";

type BakedPortfolio = {
  categories: Array<
    Omit<PortfolioCategory, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
  videos: Array<
    Omit<PortfolioVideo, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

const cmsUrl = (filename: string) =>
  `${import.meta.env.BASE_URL}cms/${filename}`.replace(/\/{2,}/g, "/");

const loadJson = async <T>(filename: string): Promise<T | null> => {
  try {
    const response = await fetch(cmsUrl(filename), { cache: "no-cache" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const loadBakedSiteContent = () => loadJson<SiteContent>("site-content.json");

export const loadBakedPortfolio = async (): Promise<{
  categories: PortfolioCategory[];
  videos: PortfolioVideo[];
} | null> => {
  const baked = await loadJson<BakedPortfolio>("portfolio.json");
  if (!baked) return null;

  return {
    categories: baked.categories.map((category) => ({
      ...category,
      createdAt: Timestamp.fromDate(new Date(category.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(category.updatedAt)),
    })),
    videos: baked.videos.map((video) => ({
      ...video,
      createdAt: Timestamp.fromDate(new Date(video.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(video.updatedAt)),
    })),
  };
};
