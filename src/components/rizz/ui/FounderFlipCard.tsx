import { useState } from "react";
import { cn } from "@/lib/utils";

export type FounderCardData = {
  name: string;
  role: string;
  keywords?: string;
  bio: string;
  image?: string;
  badge?: string;
  variant?: "portrait" | "team";
  showBioLabel?: string;
  hideBioLabel?: string;
};

interface FounderFlipCardProps {
  founder: FounderCardData;
  className?: string;
}

const ExtendedTeamBackground = () => (
  <div className="absolute inset-0 bg-[#030712]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(24,123,255,0.35)_0%,transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(255,106,0,0.28)_0%,transparent_50%)]" />
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-3 px-6 pb-28 opacity-70">
      {[0.85, 1, 0.95, 1.05, 0.9].map((scale, i) => (
        <div
          key={i}
          className="w-10 rounded-t-full bg-gradient-to-t from-[#0B1628] to-[#1A2A42]"
          style={{ height: `${scale * 88}px` }}
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
  </div>
);

const CardBackground = ({ founder }: { founder: FounderCardData }) => {
  if (founder.variant === "team" || !founder.image) {
    return <ExtendedTeamBackground />;
  }

  return (
    <>
      <img
        src={founder.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/25 to-[#030712]/10" />
    </>
  );
};

export const FounderFlipCard = ({ founder, className }: FounderFlipCardProps) => {
  const [locked, setLocked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isFlipped = locked || hovered;

  return (
    <button
      type="button"
      className={cn("founder-flip-card w-full text-start", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setLocked((value) => !value)}
      aria-pressed={isFlipped}
      aria-label={`${founder.name} — ${isFlipped ? founder.hideBioLabel ?? "hide bio" : founder.showBioLabel ?? "show bio"}`}
    >
      <div className={cn("founder-flip-inner", isFlipped && "is-flipped")}>
        <div className="founder-flip-face founder-flip-front">
          <CardBackground founder={founder} />
          {founder.badge && (
            <span className="founder-flip-badge">{founder.badge}</span>
          )}
          <div className="founder-flip-content">
            <h3 className="founder-flip-name">{founder.name}</h3>
            <p className="founder-flip-role">{founder.role}</p>
            {founder.keywords ? (
              <p className="founder-flip-keywords">{founder.keywords}</p>
            ) : null}
          </div>
        </div>

        <div className="founder-flip-face founder-flip-back">
          <div className="founder-flip-back-surface" aria-hidden />
          <div className="founder-flip-back-content">
            <div className="founder-flip-back-header">
              <h3 className="founder-flip-name">{founder.name}</h3>
              <p className="founder-flip-role">{founder.role}</p>
            </div>
            <p className="founder-flip-bio">{founder.bio}</p>
          </div>
        </div>
      </div>
    </button>
  );
};
