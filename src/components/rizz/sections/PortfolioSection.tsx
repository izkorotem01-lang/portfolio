import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { EyebrowLabel } from "@/components/rizz/ui/EyebrowLabel";
import { RizzFilterNav } from "@/components/rizz/ui/RizzFilterNav";
import { SectionWrapper } from "@/components/rizz/ui/SectionWrapper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSiteContent } from "@/contexts/SiteContentContext";
import {
  getCategories,
  getVideos,
  getPortfolioVideosForCategory,
  DEFAULT_PORTFOLIO_VIDEO_LIMIT,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isUploadedReelVideo,
  isYouTubeUrl,
  type PortfolioCategory,
  type PortfolioVideo,
} from "@/lib/portfolioService";
import { loadBakedPortfolio } from "@/lib/cmsContent";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const PortfolioVideoCard = ({
  video,
  onOpen,
  untitledLabel,
}: {
  video: PortfolioVideo;
  onOpen: () => void;
  untitledLabel: string;
}) => {
  const isYouTube = isYouTubeUrl(video.videoUrl);
  const isReel = isUploadedReelVideo(video);
  const thumbnailUrl =
    video.thumbnailUrl ||
    (isYouTube ? getYouTubeThumbnail(video.videoUrl) : undefined);
  const title = video.title || video.titleHe || untitledLabel;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#1D2B3E] text-left transition-all duration-300 hover:border-[rgba(255,106,0,0.45)] hover:shadow-[0_0_40px_rgba(255,106,0,0.08)]"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black",
          isReel ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className={cn(
              "absolute inset-0 h-full w-full",
              isReel ? "object-contain" : "object-cover",
            )}
            loading="lazy"
            decoding="async"
          />
        ) : !isYouTube ? (
          <video
            src={video.videoUrl}
            className={cn(
              "absolute inset-0 h-full w-full",
              isReel ? "object-contain" : "object-cover",
            )}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f3a] to-[#030712]" />
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-[#030712]/35 opacity-100 transition-opacity duration-300 group-hover:bg-[#030712]/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#F5F7FA] transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-[#F5F7FA] text-[#F5F7FA]" />
          </div>
        </div>
      </div>

      <div
        dir="rtl"
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent p-4 text-right"
      >
        <h3 className="text-sm font-bold text-[#F5F7FA]">{title}</h3>
      </div>
    </button>
  );
};

export const PortfolioSection = () => {
  const { language } = useLanguage();
  const { rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.portfolio) throw new Error("Missing required Sanity content: rizzPage.portfolio");
  const portfolioCopy = rizzPage.portfolio;
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxVideo, setLightboxVideo] = useState<PortfolioVideo | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolioData = async () => {
      if (import.meta.env.PROD) {
        const baked = await loadBakedPortfolio();
        if (!cancelled && baked) {
          setCategories(baked.categories);
          setVideos(baked.videos);
          setIsLoading(false);
        }
      }

      try {
        const [categoriesData, videosData] = await Promise.all([
          getCategories(),
          getVideos(),
        ]);
        if (!cancelled) {
          setCategories(categoriesData);
          setVideos(videosData);
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadPortfolioData();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayCategories = useMemo(
    () => [
      {
        id: "all",
        label: requirePick(portfolioCopy.allVideos, "rizzPage.portfolio.allVideos"),
      },
      ...categories.map((category) => ({
        id: category.id,
        label: language === "hb" ? category.nameHe : category.name,
      })),
    ],
    [categories, language, requirePick, portfolioCopy.allVideos],
  );

  const maxVideosDisplayed = DEFAULT_PORTFOLIO_VIDEO_LIMIT;

  const filteredVideos = useMemo(
    () => getPortfolioVideosForCategory(videos, activeCategory, maxVideosDisplayed),
    [activeCategory, videos, maxVideosDisplayed],
  );

  const openLightbox = (video: PortfolioVideo) => {
    setLightboxVideo(video);
  };

  return (
    <section id="work" className="overflow-x-hidden bg-[#030712] px-6 py-28">
      <div className="mx-auto max-w-[1440px]">
        <SectionWrapper className="text-center">
          <EyebrowLabel className="w-full text-center">
            {requirePick(portfolioCopy.eyebrow, "rizzPage.portfolio.eyebrow")}
          </EyebrowLabel>
          <h2
            className="mb-10 whitespace-nowrap font-semibold uppercase leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.05em" }}
          >
            <span className="text-[#F5F7FA]">
              {requirePick(portfolioCopy.titlePrimary, "rizzPage.portfolio.titlePrimary")}
            </span>{" "}
            <span className="rizz-title-accent">
              {requirePick(portfolioCopy.titleAccent, "rizzPage.portfolio.titleAccent")}
            </span>
          </h2>
        </SectionWrapper>

        <SectionWrapper delay={0.05}>
          <RizzFilterNav
            className="mb-12"
            aria-label={requirePick(portfolioCopy.categoriesAria, "rizzPage.portfolio.categoriesAria")}
            options={displayCategories}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        </SectionWrapper>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1D2B3E] border-t-[#FF6A00]" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-[#A7B0C0]">
              {requirePick(portfolioCopy.emptyState, "rizzPage.portfolio.emptyState")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video, index) => (
              <SectionWrapper key={video.id} delay={index * 0.04}>
                <PortfolioVideoCard
                  video={video}
                  onOpen={() => openLightbox(video)}
                  untitledLabel={requirePick(portfolioCopy.untitled, "rizzPage.portfolio.untitled")}
                />
              </SectionWrapper>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!lightboxVideo}
        onOpenChange={(open) => {
          if (!open) setLightboxVideo(null);
        }}
      >
        <DialogContent className="max-h-[95vh] w-[min(96vw,1200px)] max-w-[min(96vw,1200px)] gap-3 overflow-y-auto border-[#1D2B3E] bg-[#030712] p-3 sm:p-5">
          {lightboxVideo ? (
            <>
              <DialogTitle className="sr-only">{lightboxVideo.title}</DialogTitle>
              {isYouTubeUrl(lightboxVideo.videoUrl) ? (
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "16/9" }}
                >
                  <iframe
                    key={lightboxVideo.id}
                    src={
                      getYouTubeEmbedUrl(lightboxVideo.videoUrl, true, false) ?? undefined
                    }
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={lightboxVideo.title}
                  />
                </div>
              ) : (
                <div
                  className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black"
                  style={{ aspectRatio: "16/9" }}
                >
                  <video
                    key={lightboxVideo.id}
                    className="max-h-full max-w-full object-contain"
                    controls
                    playsInline
                    autoPlay
                    src={lightboxVideo.videoUrl}
                  >
                    <source src={lightboxVideo.videoUrl} type="video/mp4" />
                  </video>
                </div>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};
