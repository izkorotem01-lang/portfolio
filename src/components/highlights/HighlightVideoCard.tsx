import React, { useCallback, useEffect, useRef, useState } from "react";
import type { DisplayVideo } from "@/lib/videoTypes";

const HIGHLIGHT_SOUND_EVENT = "highlight-video-sound";

export type HighlightVideoCardProps = {
  video: DisplayVideo;
  language: string;
  isActive: boolean;
  onActivate: () => void;
  mode?: "hero" | "grid";
  forceMuted?: boolean;
  fillContainer?: boolean;
};

const HighlightVideoCard = ({
  video,
  language: _language,
  isActive,
  onActivate,
  mode = "grid",
  forceMuted = false,
  fillContainer = false,
}: HighlightVideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const title = video.title?.trim() || "Highlight video";
  const soundLocked = forceMuted;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = soundLocked || !soundEnabled;
    el.loop = true;
    el.play().catch(() => {});
  }, [soundLocked, soundEnabled, video.videoUrl]);

  useEffect(() => {
    if (!isActive) {
      setSoundEnabled(false);
    }
  }, [isActive]);

  useEffect(() => {
    const onSoundChange = (event: Event) => {
      const activeId = (event as CustomEvent<string>).detail;
      if (activeId !== video.id) {
        setSoundEnabled(false);
      }
    };

    window.addEventListener(HIGHLIGHT_SOUND_EVENT, onSoundChange);
    return () => window.removeEventListener(HIGHLIGHT_SOUND_EVENT, onSoundChange);
  }, [video.id]);

  const handleActivate = useCallback(() => {
    if (soundLocked || !isActive) return;

    onActivate();

    if (soundEnabled) {
      setSoundEnabled(false);
      return;
    }

    window.dispatchEvent(new CustomEvent(HIGHLIGHT_SOUND_EVENT, { detail: video.id }));
    setSoundEnabled(true);
  }, [soundLocked, isActive, onActivate, soundEnabled, video.id]);

  return (
    <div className="shortform-showcase__card group relative h-full w-full">
      <div
        className={`brand-video-frame hero-showreel-frame highlight-reel-frame relative block h-full w-full overflow-hidden bg-black text-left ${
          fillContainer ? "aspect-auto" : ""
        }${soundLocked ? "" : " cursor-pointer"}`}
        aria-label={title}
        role={soundLocked ? undefined : "button"}
        tabIndex={soundLocked ? -1 : 0}
        onClick={handleActivate}
        onKeyDown={(event) => {
          if (soundLocked) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleActivate();
          }
        }}
      >
        <div className="brand-video-frame__media h-full w-full">
          {video.thumbnailUrl && (
            <img
              src={video.thumbnailUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          )}
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="relative h-full w-full object-cover"
            playsInline
            autoPlay
            loop
            muted
            preload="auto"
            poster={video.thumbnailUrl}
            onLoadedData={() => {
              const el = videoRef.current;
              if (!el) return;
              el.muted = soundLocked || !soundEnabled;
              el.play().catch(() => {});
            }}
          />
        </div>
      </div>

      {mode !== "hero" && !forceMuted && video.title?.trim() && (
        <p className="mt-2 line-clamp-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/75 sm:text-sm">
          {title}
        </p>
      )}
    </div>
  );
};

export default HighlightVideoCard;
