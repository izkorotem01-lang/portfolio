import { RIZZ_SOCIAL_LINKS } from "@/data/rizz-mock";
import { RIZZ_CONTACT } from "@/data/rizz-contact";
import { Instagram, Youtube } from "lucide-react";
import { useRizzTranslations } from "@/hooks/useRizzTranslations";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.392-2.085-1.392-3.338h-3.067v14.829c0 1.673-1.357 3.029-3.029 3.029s-3.029-1.357-3.029-3.029 1.357-3.029 3.029-3.029c.314 0 .617.048.9.138V9.851a9.965 9.965 0 0 0 5.233 1.442V7.469c-.884 0-1.723-.203-2.494-.537z" />
  </svg>
);

const socialIcons = {
  Instagram,
  YouTube: Youtube,
  TikTok: TikTokIcon,
} as const;

export const RizzFooter = () => {
  const t = useRizzTranslations();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#1D2B3E] bg-[#030712]">
      <div className="mx-auto max-w-[1440px] px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-[#F5F7FA] font-semibold text-2xl uppercase tracking-widest mb-4">
              RIZZ<span className="text-[#FF6A00]">.</span>
            </div>
            <p className="text-[#A7B0C0] text-sm leading-relaxed mb-6 max-w-xs">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              {RIZZ_SOCIAL_LINKS.map((link) => {
                const Icon =
                  socialIcons[link.label as keyof typeof socialIcons];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-[#6F7A8C] hover:text-[#FF6A00] transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="rizz-eyebrow mb-4">{t.footer.navigation}</p>
            <nav className="flex flex-col gap-3">
              {t.nav.footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className="text-[#A7B0C0] hover:text-[#F5F7FA] transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="rizz-eyebrow mb-4">{t.footer.getStarted}</p>
            <p className="text-[#A7B0C0] text-sm mb-6 leading-relaxed">
              {t.footer.getStartedDescription}
            </p>
            <a
              href={RIZZ_CONTACT.phoneTel}
              className="rizz-btn-primary inline-flex text-sm py-3 px-5"
            >
              {t.nav.bookCall}
            </a>
          </div>
        </div>

        <div className="border-t border-[#1D2B3E] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6F7A8C] text-sm">
            {t.footer.copyright(new Date().getFullYear())}
          </p>
          <p className="text-[#6F7A8C] text-sm uppercase tracking-[0.2em]">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};
