import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Keeps the page at the top on load/refresh unless a hash target exists.
 * Prevents the browser from restoring a prior scroll offset (e.g. past Trusted By).
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timeoutId = window.setTimeout(scrollToTop, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
