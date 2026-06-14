import type { ProofCard } from "@/lib/sanitySite";
import { ProofCardBottomMedia } from "@/components/rizz/ui/ProofCardBottomMedia";
import { ProofCardMediaBlock } from "@/components/rizz/ui/ProofCardMediaBlock";

export const ProofCardItem = ({ card }: { card: ProofCard }) => {
  const hasTitle = card.titleSegments.length > 0;
  const hasStats = card.statistics.length > 0;
  const hasBottomMedia = card.bottomMedia.length > 0;
  const hasHeaderMedia = Boolean(
    card.headerMedia && (card.headerMedia.imageUrl || card.headerMedia.videoUrl)
  );
  const showNameOnHeader =
    hasHeaderMedia && Boolean(card.clientName || card.clientRole);

  return (
    <article className="rizz-card flex h-full w-full flex-col overflow-hidden">
      {hasHeaderMedia && card.headerMedia && (
        <div className="relative shrink-0 overflow-hidden border-b border-[#1D2B3E]">
          <ProofCardMediaBlock
            media={card.headerMedia}
            className="rounded-none"
            overlay={
              showNameOnHeader
                ? {
                    clientName: card.clientName,
                    clientRole: card.clientRole,
                  }
                : undefined
            }
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        {!showNameOnHeader && (card.clientName || card.clientRole) && (
          <div>
            {card.clientName && (
              <div className="text-lg font-semibold uppercase leading-tight tracking-tight text-[#F5F7FA]">
                {card.clientName}
              </div>
            )}
            {card.clientRole && (
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#187BFF]">
                {card.clientRole}
              </div>
            )}
          </div>
        )}

        {hasTitle && (
          <h3 className="text-xl font-bold leading-snug text-[#F5F7FA] md:text-[1.35rem]">
            {card.titleSegments.map((segment, index) => (
              <span
                key={segment.id}
                className={segment.accent ? "rizz-title-accent" : undefined}
              >
                {index > 0 && !segment.text.startsWith(" ") ? " " : ""}
                {segment.text}
              </span>
            ))}
          </h3>
        )}

        {card.checkpoints.length > 0 && (
          <ul className="flex flex-col gap-2">
            {card.checkpoints.map((point, index) => (
              <li
                key={`${card.id}-cp-${index}`}
                className="flex items-start gap-2 text-sm leading-snug text-[#A7B0C0]"
              >
                <span className="mt-0.5 shrink-0 text-[#187BFF]">✓</span>
                {point}
              </li>
            ))}
          </ul>
        )}

        {hasStats && (
          <div
            className="proof-card-stats-bar"
            style={{
              gridTemplateColumns: `repeat(${Math.min(card.statistics.length, 4)}, minmax(0, 1fr))`,
            }}
          >
            {card.statistics.map((stat) => (
              <div key={stat.id} className="proof-card-stat-item">
                <div className="proof-card-stat-value">{stat.value}</div>
                <div className="proof-card-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {hasBottomMedia && <ProofCardBottomMedia items={card.bottomMedia} />}
      </div>
    </article>
  );
};
