import {
  isYouTubeUrl,
  PortfolioCategory,
  PortfolioVideo,
} from "@/lib/portfolioService";

const SHORTFORM_CATEGORY_PATTERN =
  /short|reel|tiktok|instagram|social|vertical|סושיאל|ריל|טיקטוק|קצר/i;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickRandomShortformVideos(
  videos: PortfolioVideo[],
  categories: PortfolioCategory[],
  count = 4
): PortfolioVideo[] {
  const shortformCategoryIds = new Set(
    categories
      .filter(
        (c) =>
          SHORTFORM_CATEGORY_PATTERN.test(c.name) ||
          SHORTFORM_CATEGORY_PATTERN.test(c.nameHe)
      )
      .map((c) => c.id)
  );

  let pool = videos.filter(
    (v) => v.videoUrl?.trim() && !isYouTubeUrl(v.videoUrl)
  );

  if (shortformCategoryIds.size > 0) {
    const inShortform = pool.filter((v) =>
      shortformCategoryIds.has(v.categoryId)
    );
    if (inShortform.length >= Math.min(count, 1)) {
      pool = inShortform;
    }
  }

  return shuffle(pool).slice(0, count);
}
