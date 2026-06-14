import { useEffect, useMemo, useRef } from "react";
import _Marquee from "react-fast-marquee";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { resolveTrustedClients } from "@/lib/trustedByClients";

const Marquee =
  (_Marquee as unknown as { default?: typeof _Marquee }).default ?? _Marquee;

const formatClientName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) {
    return { primary: name.toUpperCase(), secondary: null as string | null };
  }

  return {
    primary: parts[0].toUpperCase(),
    secondary: parts.slice(1).join(" ").toUpperCase(),
  };
};

export const TrustedByWheel = () => {
  const { trustedClients } = useSiteContent();
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);
  const mobileInteractionTimeoutRef = useRef<number | null>(null);
  const isMobileInteractingRef = useRef(false);

  const clients = useMemo(
    () => resolveTrustedClients(trustedClients),
    [trustedClients]
  );

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    let animationFrame = 0;
    let lastTimestamp = 0;
    const pixelsPerSecond = 28;

    const step = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isMobileInteractingRef.current) {
        const loopWidth = scroller.scrollWidth / 2;
        scroller.scrollLeft += (pixelsPerSecond * elapsed) / 1000;
        if (scroller.scrollLeft >= loopWidth) scroller.scrollLeft -= loopWidth;
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (mobileInteractionTimeoutRef.current !== null) {
        window.clearTimeout(mobileInteractionTimeoutRef.current);
      }
    };
  }, [clients.length]);

  const pauseMobileAutoScroll = () => {
    isMobileInteractingRef.current = true;
    if (mobileInteractionTimeoutRef.current !== null) {
      window.clearTimeout(mobileInteractionTimeoutRef.current);
      mobileInteractionTimeoutRef.current = null;
    }
  };

  const resumeMobileAutoScroll = () => {
    if (mobileInteractionTimeoutRef.current !== null) {
      window.clearTimeout(mobileInteractionTimeoutRef.current);
    }
    mobileInteractionTimeoutRef.current = window.setTimeout(() => {
      isMobileInteractingRef.current = false;
      mobileInteractionTimeoutRef.current = null;
    }, 1200);
  };

  const renderCardContent = (client: (typeof clients)[number]) => {
    if (client.iconSrc) {
      return (
        <img
          src={client.iconSrc}
          alt={client.name}
          className="proof-trusted-logo"
        />
      );
    }

    const { primary, secondary } = formatClientName(client.name);

    return (
      <div className="text-center leading-none">
        <div className="text-[#F5F7FA] font-semibold text-sm tracking-wider">
          {primary}
        </div>
        {secondary && (
          <div className="text-[#6F7A8C] text-[10px] tracking-[0.2em] mt-1">
            {secondary}
          </div>
        )}
      </div>
    );
  };

  const renderClient = (client: (typeof clients)[number], key: string) => {
    if (!client.url) {
      return (
        <div
          key={key}
          className="proof-trusted-card mx-1.5"
          aria-label={client.name}
        >
          {renderCardContent(client)}
        </div>
      );
    }

    return (
      <a
        key={key}
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        className="proof-trusted-card mx-1.5"
        aria-label={`${client.name} website`}
      >
        {renderCardContent(client)}
      </a>
    );
  };

  if (clients.length === 0) return null;

  return (
    <div className="overflow-hidden px-4">
      <div
        ref={mobileScrollerRef}
        dir="ltr"
        className="md:hidden overflow-x-auto scrollbar-hide"
        tabIndex={-1}
        onTouchStart={pauseMobileAutoScroll}
        onTouchEnd={resumeMobileAutoScroll}
        onTouchCancel={resumeMobileAutoScroll}
        onMouseDown={pauseMobileAutoScroll}
        onMouseUp={resumeMobileAutoScroll}
        onMouseLeave={resumeMobileAutoScroll}
      >
        <div className="flex w-max min-w-full items-center touch-pan-x py-1">
          {[...clients, ...clients].map((client, index) =>
            renderClient(client, `${client.id}-${index}`)
          )}
        </div>
      </div>

      <div dir="ltr" className="hidden md:block py-1">
        <Marquee speed={35} autoFill pauseOnHover={false}>
          {clients.map((client) => renderClient(client, client.id))}
        </Marquee>
      </div>
    </div>
  );
};
