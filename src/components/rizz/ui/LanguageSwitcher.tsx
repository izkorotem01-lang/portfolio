import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import type { UrlLocale } from "@/i18n/locale";
import { useSiteContent } from "@/contexts/SiteContentContext";

export const LanguageSwitcher = ({
  className,
  onLocaleSwitch,
}: {
  className?: string;
  onLocaleSwitch?: () => void;
}) => {
  const { urlLocale, switchUrlLocale } = useLanguage();
  const { rizzPage, requirePick } = useSiteContent();
  if (!rizzPage?.nav) throw new Error("Missing required Sanity content: rizzPage.nav");
  const nav = rizzPage.nav;

  const options: { locale: UrlLocale; label: string }[] = [
    { locale: "en", label: requirePick(nav.switchToEn, "rizzPage.nav.switchToEn") },
    { locale: "hb", label: requirePick(nav.switchToHb, "rizzPage.nav.switchToHb") },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[#1D2B3E] bg-[#030712]/60 p-0.5 text-xs font-semibold uppercase tracking-wider",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {options.map(({ locale, label }) => {
        const active = urlLocale === locale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => {
              if (urlLocale === locale) return;
              switchUrlLocale(locale);
              onLocaleSwitch?.();
            }}
            className={cn(
              "rounded-full px-2.5 py-1 transition-colors",
              active
                ? "bg-[#187BFF]/20 text-[#F5F7FA]"
                : "text-[#6F7A8C] hover:text-[#A7B0C0]",
            )}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
