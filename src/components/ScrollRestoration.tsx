import { restoreScrollPosition, saveScrollPosition } from "@/lib/scrollRestoration";
import { useLayoutEffect, useEffect } from "react";

type ScrollRestorationProps = {
  ready: boolean;
};

export const ScrollRestoration = ({ ready }: ScrollRestorationProps) => {
  useEffect(() => {
    let timeoutId = 0;

    const onScroll = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("beforeunload", saveScrollPosition);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    const restore = () => restoreScrollPosition();
    restore();
    const rafId = requestAnimationFrame(restore);
    const timeoutId = window.setTimeout(restore, 50);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [ready]);

  return null;
};
