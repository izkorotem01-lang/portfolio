import { RIZZ_CONTACT } from "@/data/rizz-contact";
import { Instagram, Youtube } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";

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
  const { rizzPage, requirePick, pick } = useSiteContent();
  if (!rizzPage?.footer) throw new Error("Missing required Sanity content: rizzPage.footer");
  if (!rizzPage?.nav) throw new Error("Missing required Sanity content: rizzPage.nav");
  const footer = rizzPage.footer;
  const nav = rizzPage.nav;
  const year = new Date().getFullYear();

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
              {requirePick(footer.description, "rizzPage.footer.description")}
            </p>
            <div className="flex gap-4">
              {(footer.socialLinks ?? []).map((link) => {
                const label = pick(link.label) || link.label?.en?.trim() || link.label?.hb?.trim() || "";
                const Icon = socialIcons[label as keyof typeof socialIcons] ?? Instagram;
                return (
                  <a
                    key={link._key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[#6F7A8C] hover:text-[#FF6A00] transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="rizz-eyebrow mb-4">
              {requirePick(footer.navigation, "rizzPage.footer.navigation")}
            </p>
            <nav className="flex flex-col gap-3">
              {(nav.footerLinks ?? []).map((link, index) => (
                <a
                  key={`${link.href ?? "footer-link"}-${index}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href) scrollTo(link.href);
                  }}
                  className="text-[#A7B0C0] hover:text-[#F5F7FA] transition-colors text-sm"
                >
                  {requirePick(link.label, `rizzPage.nav.footerLinks[${index}].label`)}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="rizz-eyebrow mb-4">
              {requirePick(footer.getStarted, "rizzPage.footer.getStarted")}
            </p>
            <p className="text-[#A7B0C0] text-sm mb-6 leading-relaxed">
              {requirePick(footer.getStartedDescription, "rizzPage.footer.getStartedDescription")}
            </p>
            <a
              href={RIZZ_CONTACT.phoneTel}
              className="rizz-btn-primary inline-flex text-sm py-3 px-5"
            >
              {requirePick(nav.bookCall, "rizzPage.nav.bookCall")}
            </a>
          </div>
        </div>

        <div className="border-t border-[#1D2B3E] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#6F7A8C] text-sm">
            {`${requirePick(footer.copyrightPrefix, "rizzPage.footer.copyrightPrefix")}${year}${requirePick(footer.copyrightSuffix, "rizzPage.footer.copyrightSuffix")}`}
          </p>
          <p className="text-[#6F7A8C] text-sm uppercase tracking-[0.2em]">
            {requirePick(footer.tagline, "rizzPage.footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
};
