import React from "react";
import _Marquee from "react-fast-marquee";

/** CJS/ESM interop: some bundlers expose the component as `.default`. */
const Marquee =
  (_Marquee as unknown as { default?: typeof _Marquee }).default ?? _Marquee;
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import trustedByClients from "@/data/trusted-by.json";
import timelapseIcon from "@/assets/client-icons/timelapse.png";
import noamFiruzIcon from "@/assets/client-icons/noam-firuz.png";
import xaufundedIcon from "@/assets/client-icons/xaufunded.png";
import mbIcon from "@/assets/client-icons/MB.png";
import itayDahariIcon from "@/assets/client-icons/itay-dahari.png";
import margoaNataniaIcon from "@/assets/client-icons/margoa-natania.png";
import paletJewlryIcon from "@/assets/client-icons/palet-jewlry.png";
import saritFarjunIcon from "@/assets/client-icons/sarit-farjun.png";
import shapoDigitalIcon from "@/assets/client-icons/shapo-digital.png";
import theBoldCrewIcon from "@/assets/client-icons/the-bold-crew.png";

const iconMap: Record<string, string> = {
  timelapse: timelapseIcon,
  "noam-firuz": noamFiruzIcon,
  xaufunded: xaufundedIcon,
  MB: mbIcon,
  "itay-dahari": itayDahariIcon,
  "margoa-natania": margoaNataniaIcon,
  "palet-jewlry": paletJewlryIcon,
  "sarit-farjun": saritFarjunIcon,
  "shapo-digital": shapoDigitalIcon,
  "the-bold-crew": theBoldCrewIcon,
};

type TrustedClient = {
  name: string;
  icon: string;
  url: string | null;
};

const TrustedBySection = () => {
  const { ref: sectionRef } = useScrollAnimation({ threshold: 0.2 });
  const mobileScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const mobileInteractionTimeoutRef = React.useRef<number | null>(null);
  const isMobileInteractingRef = React.useRef(false);

  const clients = (trustedByClients as TrustedClient[]).map((client) => ({
    ...client,
    iconSrc: iconMap[client.icon],
  }));

  React.useEffect(() => {
    const scroller = mobileScrollerRef.current;

    if (!scroller) {
      return;
    }

    let animationFrame = 0;
    let lastTimestamp = 0;
    const pixelsPerSecond = 28;

    const step = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isMobileInteractingRef.current) {
        const loopWidth = scroller.scrollWidth / 2;
        scroller.scrollLeft += (pixelsPerSecond * elapsed) / 1000;

        if (scroller.scrollLeft >= loopWidth) {
          scroller.scrollLeft -= loopWidth;
        }
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
  }, []);

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

  const renderClient = (client: TrustedClient & { iconSrc: string }) => {
    const content = (
      <img
        src={client.iconSrc}
        alt={client.name}
        className="h-12 md:h-14 w-auto object-contain opacity-80 transition-all duration-300 hover:opacity-100"
      />
    );

    if (!client.url) {
      return (
        <div
          key={client.name}
          className="flex shrink-0 items-center justify-center"
          aria-label={client.name}
        >
          {content}
        </div>
      );
    }

    return (
      <a
        key={client.name}
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center justify-center hover:-translate-y-1 transition-transform duration-300"
        aria-label={`${client.name} website`}
      >
        {content}
      </a>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="trusted-by"
      className="relative z-10 overflow-hidden pt-4 pb-3 md:pt-5 md:pb-4"
    >
      <div
        ref={mobileScrollerRef}
        dir="ltr"
        className="md:hidden overflow-x-auto scrollbar-hide px-4"
        onTouchStart={pauseMobileAutoScroll}
        onTouchEnd={resumeMobileAutoScroll}
        onTouchCancel={resumeMobileAutoScroll}
        onMouseDown={pauseMobileAutoScroll}
        onMouseUp={resumeMobileAutoScroll}
        onMouseLeave={resumeMobileAutoScroll}
      >
        <div className="flex w-max min-w-full items-center gap-5 touch-pan-x pr-6">
          {[...clients, ...clients].map((client, index) => (
            <div key={`${client.name}-${index}`}>
              {renderClient(client)}
            </div>
          ))}
        </div>
      </div>

      <div dir="ltr" className="hidden md:block">
        <Marquee speed={40} autoFill pauseOnHover={false}>
          {clients.map((client) => (
            <div key={client.name} className="mx-5 md:mx-8">
              {renderClient(client)}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default TrustedBySection;
