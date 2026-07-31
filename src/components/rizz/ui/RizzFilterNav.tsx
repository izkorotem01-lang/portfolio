import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FilterOption = { id: string; label: string };

type RizzFilterNavProps = {
  options: FilterOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  "aria-label"?: string;
};

export const RizzFilterNav = ({
  options,
  activeId,
  onChange,
  className,
  "aria-label": ariaLabel,
}: RizzFilterNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0 });
  const [isReady, setIsReady] = useState(false);

  const INDICATOR_HEIGHT = 18;

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeEl = itemRefs.current.get(activeId);
    if (!nav || !activeEl) return;

    const navRect = nav.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicator({
      left: activeRect.left - navRect.left,
      width: activeRect.width,
      top: activeRect.bottom - navRect.top - INDICATOR_HEIGHT,
    });
    setIsReady(true);
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, options]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(nav);
    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <nav
      ref={navRef}
      className={cn("rizz-filter-nav", className)}
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.id}
          ref={(el) => {
            if (el) itemRefs.current.set(option.id, el);
            else itemRefs.current.delete(option.id);
          }}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "rizz-filter-nav__link",
            activeId === option.id && "rizz-filter-nav__link--active",
          )}
        >
          {option.label}
        </button>
      ))}

      <span
        className={cn(
          "rizz-filter-nav__indicator",
          isReady && "rizz-filter-nav__indicator--ready",
        )}
        style={{ left: indicator.left, width: indicator.width, top: indicator.top }}
        aria-hidden="true"
      >
        <span className="rizz-filter-nav__indicator-glow" />
        <span className="rizz-filter-nav__indicator-line" />
      </span>
    </nav>
  );
};
