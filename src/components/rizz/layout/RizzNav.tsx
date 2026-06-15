import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import rizzIcon from "@/assets/icon-nobg.png";
import { RizzButton } from "@/components/rizz/ui/RizzButton";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { localePath } from "@/i18n/locale";
import { RIZZ_CONTACT } from "@/data/rizz-contact";

export const RizzNav = () => {
  const t = useRizzTranslations();
  const { urlLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#030712]/90 backdrop-blur-xl border-b border-[#1D2B3E]"
          : "bg-transparent",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex items-center px-16 max-w-full transition-all duration-300",
          scrolled ? "h-[64px]" : "h-[120px]",
        )}
      >
        <a
          href={localePath(urlLocale, "#home")}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#home");
          }}
          className="relative z-10 flex items-center shrink-0"
        >
          <img
            src={rizzIcon}
            alt={t.nav.logoAlt}
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-16" : "h-28",
            )}
          />
        </a>

        <nav className="pointer-events-none absolute inset-x-0 hidden items-center justify-center gap-8 md:flex">
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="pointer-events-auto text-[#A7B0C0] hover:text-[#F5F7FA] transition-colors text-sm font-medium uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-3">
          <RizzButton
            href={RIZZ_CONTACT.phoneTel}
            variant="outline"
            className="hidden md:inline-flex py-3 px-5 text-[#A7B0C0] hover:text-[#F5F7FA] transition-colors"
          >
            {t.nav.bookCall}
          </RizzButton>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden text-[#F5F7FA] p-2"
                aria-label={t.nav.openMenu}
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full bg-[#030712] border-[#1D2B3E] flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-[#F5F7FA] font-semibold text-xl uppercase tracking-widest">
                  RIZZ<span className="text-[#FF6A00]">.</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#A7B0C0]"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {t.nav.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-[#F5F7FA] text-2xl font-bold uppercase tracking-wider hover:text-[#FF6A00] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto pt-8">
                <RizzButton
                  href={RIZZ_CONTACT.phoneTel}
                  variant="outline"
                  className="w-full justify-center py-4"
                >
                  {t.nav.bookCall}
                </RizzButton>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
