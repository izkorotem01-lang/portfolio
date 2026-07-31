import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const stripLocalePrefix = (path: string) => path.replace(/^\/(en|hb)/, "") || "/";

/**
 * Scrolls to top on client-side route changes. On refresh, the browser restores
 * scroll position. Hash links still scroll to their target section.
 * Locale-only switches (/en ↔ /hb) preserve scroll position.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const isInitialMount = useRef(true);
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start" });
        previousPathname.current = pathname;
        return;
      }
    }

    const localeOnlyChange =
      stripLocalePrefix(previousPathname.current) === stripLocalePrefix(pathname) &&
      previousPathname.current !== pathname;

    previousPathname.current = pathname;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (localeOnlyChange) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
