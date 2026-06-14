import { useLanguage } from "@/contexts/LanguageContext";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import { cn } from "@/lib/utils";
import type { UrlLocale } from "@/i18n/locale";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { urlLocale, switchUrlLocale } = useLanguage();
  const t = useRizzTranslations();

  const options: { locale: UrlLocale; label: string }[] = [
    { locale: "en", label: t.nav.switchToEn },
    { locale: "hb", label: t.nav.switchToHb },
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
            onClick={() => switchUrlLocale(locale)}
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
