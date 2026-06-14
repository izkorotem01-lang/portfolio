import type { ProofCardMedia } from "@/lib/sanitySite";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
} from "@/lib/sanitySite";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type MediaOverlayProps = {
  clientName?: string;
  clientRole?: string;
  visible: boolean;
  compact?: boolean;
};

const MediaOverlay = ({
  clientName,
  clientRole,
  visible,
  compact = false,
}: MediaOverlayProps) => {
  if (!clientName && !clientRole) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        aria-hidden={!visible}
      >
        <div className="proof-card-media-vignette absolute inset-0" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      aria-hidden={!visible}
    >
      <div className="proof-card-media-vignette absolute inset-0" />
      <div
        className={cn(
          "absolute text-left",
          compact ? "bottom-3 left-3 pr-12" : "bottom-4 left-4 pr-20"
        )}
      >
        {clientName && (
          <div className="text-lg font-semibold uppercase leading-tight tracking-tight text-[#F5F7FA] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {clientName}
          </div>
        )}
        {clientRole && (
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#187BFF] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {clientRole}
          </div>
        )}
      </div>
    </div>
  );
};

type ProofCardMediaBlockProps = {
  media: ProofCardMedia;
  className?: string;
  compact?: boolean;
  overlay?: {
    clientName?: string;
    clientRole?: string;
  };
};

const parseYouTubePlayerState = (data: unknown): number | undefined => {
  if (!data || typeof data !== "object") return undefined;
  const payload = data as {
    event?: string;
    info?: number | { playerState?: number };
  };

  if (payload.event === "onStateChange" && typeof payload.info === "number") {
    return payload.info;
  }

  if (
    payload.event === "infoDelivery" &&
    payload.info &&
    typeof payload.info === "object" &&
    typeof payload.info.playerState === "number"
  ) {
    return payload.info.playerState;
  }

  return undefined;
};

const YouTubeProofMedia = ({
  videoUrl,
  alt,
  aspect,
  className,
  compact = false,
  overlay,
}: {
  videoUrl: string;
  alt?: string;
  aspect: string;
  className?: string;
  compact?: boolean;
  overlay?: ProofCardMediaBlockProps["overlay"];
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedActive, setEmbedActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnail = getYouTubeThumbnail(videoUrl);
  const hasOverlay = Boolean(overlay && !compact);
  const showChrome = hasOverlay ? !isPlaying : !embedActive;

  const embedUrl = embedActive
    ? getYouTubeEmbedUrl(videoUrl, {
        autoplay: true,
        controls: true,
        enableJsApi: hasOverlay,
        origin: typeof window !== "undefined" ? window.location.origin : undefined,
      })
    : undefined;

  const sendYouTubeCommand = useCallback((func: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  }, []);

  const handlePlay = useCallback(() => {
    if (embedActive) {
      sendYouTubeCommand("playVideo");
      setIsPlaying(true);
      return;
    }

    setEmbedActive(true);
    setIsPlaying(true);
  }, [embedActive, sendYouTubeCommand]);

  useEffect(() => {
    if (!embedActive || !hasOverlay) return;

    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;

      let data: unknown = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      const playerState = parseYouTubePlayerState(data);
      if (playerState === undefined) return;

      setIsPlaying(playerState === 1);
    };

    const subscribe = () => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        "*"
      );
    };

    window.addEventListener("message", handleMessage);
    const timer = window.setTimeout(subscribe, 400);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.clearTimeout(timer);
    };
  }, [embedActive, hasOverlay]);

  if (!thumbnail && !embedUrl) return null;

  const playButtonClass = compact
    ? "bottom-2 right-2 h-8 w-8"
    : "bottom-3 right-3 h-9 w-9";
  const playIconSize = compact ? 12 : 14;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#07111F]",
        aspect,
        className
      )}
    >
      {embedActive && embedUrl ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={alt ?? "Proof video"}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        thumbnail && (
          <img
            src={thumbnail}
            alt={alt ?? ""}
            className="h-full w-full object-cover"
          />
        )
      )}

      {hasOverlay && (
        <MediaOverlay
          clientName={overlay?.clientName}
          clientRole={overlay?.clientRole}
          visible={showChrome}
          compact={compact}
        />
      )}

      {showChrome && (
        <button
          type="button"
          onClick={handlePlay}
          className="group absolute inset-0 z-20 cursor-pointer border-0 bg-transparent p-0"
          aria-label={alt ?? "Play video"}
        >
          <span
            className={cn(
              "absolute flex items-center justify-center rounded-full border border-white/80 bg-black/70 text-white shadow-lg transition-transform group-hover:scale-105",
              playButtonClass
            )}
          >
            <Play size={playIconSize} fill="currentColor" className="ml-0.5" />
          </span>
        </button>
      )}
    </div>
  );
};

export const ProofCardMediaBlock = ({
  media,
  className,
  compact = false,
  overlay,
}: ProofCardMediaBlockProps) => {
  const fillsContainer = Boolean(className?.includes("h-full"));
  const aspect = fillsContainer
    ? undefined
    : compact
      ? "aspect-[4/3]"
      : "aspect-[16/10]";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasOverlay = Boolean(overlay && !compact);
  const showChrome = hasOverlay ? !isPlaying : false;

  if (media.imageUrl) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#07111F]",
          aspect,
          className
        )}
      >
        <img
          src={media.imageUrl}
          alt={media.alt ?? ""}
          className="h-full w-full object-cover"
        />
        {hasOverlay && (
          <MediaOverlay
            clientName={overlay?.clientName}
            clientRole={overlay?.clientRole}
            visible
            compact={compact}
          />
        )}
      </div>
    );
  }

  if (!media.videoUrl) return null;

  if (isYouTubeUrl(media.videoUrl)) {
    return (
      <YouTubeProofMedia
        videoUrl={media.videoUrl}
        alt={media.alt}
        aspect={aspect ?? ""}
        className={className}
        compact={compact}
        overlay={overlay}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#07111F]",
        aspect,
        className
      )}
    >
      <video
        ref={videoRef}
        src={media.videoUrl}
        poster={media.posterUrl}
        controls={!compact && (!hasOverlay || isPlaying)}
        playsInline
        className="h-full w-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      {hasOverlay && (
        <MediaOverlay
          clientName={overlay?.clientName}
          clientRole={overlay?.clientRole}
          visible={showChrome}
          compact={compact}
        />
      )}
      {hasOverlay && showChrome && (
        <button
          type="button"
          onClick={() => {
            void videoRef.current?.play();
          }}
          className="group absolute inset-0 z-20 cursor-pointer border-0 bg-transparent p-0"
          aria-label={media.alt ?? "Play video"}
        >
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-black/70 text-white shadow-lg transition-transform group-hover:scale-105">
            <Play size={14} fill="currentColor" className="ml-0.5" />
          </span>
        </button>
      )}
      {compact && !hasOverlay && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-black/60 text-white">
            <Play size={16} fill="currentColor" className="ml-0.5" />
          </span>
        </div>
      )}
    </div>
  );
};

export const hasPlayableMedia = (media?: ProofCardMedia) =>
  Boolean(
    media?.videoUrl &&
      !isYouTubeUrl(media.videoUrl) &&
      media.videoUrl.startsWith("http")
  );
