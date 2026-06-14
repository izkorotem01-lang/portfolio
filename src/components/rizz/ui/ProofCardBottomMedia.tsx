import type { ProofCardMedia } from "@/lib/sanitySite";
import { ProofCardMediaBlock } from "@/components/rizz/ui/ProofCardMediaBlock";
import { cn } from "@/lib/utils";

type BottomMediaLayout =
  | { type: "gallery"; main: ProofCardMedia; secondary: ProofCardMedia[]; others: ProofCardMedia[] }
  | { type: "stack"; items: ProofCardMedia[] };

const isImageOnly = (item: ProofCardMedia) =>
  Boolean(item.imageUrl && !item.videoUrl && !item.quote);

const mediaFrameClass =
  "overflow-hidden rounded-lg border border-[#1D2B3E] bg-[#07111F]";

const ProofCardQuoteBlock = ({
  quote,
  className,
}: {
  quote: string;
  className?: string;
}) => (
  <blockquote className={cn("proof-card-quote", className)}>
    <span className="proof-card-quote-mark" aria-hidden>
      &ldquo;
    </span>
    <p className="proof-card-quote-text">{quote}</p>
  </blockquote>
);

const renderBottomItem = (item: ProofCardMedia, className?: string) => {
  if (item.quote) {
    return <ProofCardQuoteBlock quote={item.quote} className={className} />;
  }

  return (
    <ProofCardMediaBlock media={item} compact className={cn(mediaFrameClass, className)} />
  );
};

const organizeBottomMedia = (items: ProofCardMedia[]): BottomMediaLayout => {
  const images = items.filter(isImageOnly);
  const others = items.filter((item) => !isImageOnly(item));

  if (images.length >= 2) {
    const main = images.find((item) => item.isMain) ?? images[0];
    const secondary = images.filter((item) => item.id !== main.id);
    return { type: "gallery", main, secondary, others };
  }

  return { type: "stack", items };
};

export const ProofCardBottomMedia = ({ items }: { items: ProofCardMedia[] }) => {
  const layout = organizeBottomMedia(items);

  if (layout.type === "gallery") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex min-h-[140px] gap-2 overflow-hidden rounded-lg">
          <div className={cn("min-w-0 flex-[1.65] self-stretch", mediaFrameClass)}>
            <ProofCardMediaBlock
              media={layout.main}
              compact
              className="h-full min-h-[140px] rounded-none border-0"
            />
          </div>
          {layout.secondary.length > 0 && (
            <div className="flex min-w-0 flex-1 flex-col gap-2 self-stretch">
              {layout.secondary.map((item) => (
                <div key={item.id} className={cn("min-h-0 flex-1", mediaFrameClass)}>
                  <ProofCardMediaBlock
                    media={item}
                    compact
                    className="h-full min-h-[64px] rounded-none border-0"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {layout.others.map((item) => (
          <div key={item.id} className={item.quote ? "w-full self-start" : undefined}>
            {renderBottomItem(item)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid items-start gap-2 overflow-hidden rounded-lg",
        layout.items.length === 2 ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {layout.items.map((item) => (
        <div key={item.id} className={item.quote ? "w-full self-start" : undefined}>
          {renderBottomItem(item)}
        </div>
      ))}
    </div>
  );
};
