import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO_TITLE_EN } from "@/data/rizz-copy-overhaul";
import { useSiteContent } from "@/contexts/SiteContentContext";

export const RizzSeo = () => {
  const { rizzPage, requirePick } = useSiteContent();
  const { urlLocale } = useLanguage();
  useEffect(() => {
    if (!rizzPage?.seo) return;
    // EN title follows the new hero headline until Sanity seo.title is updated.
    const title =
      urlLocale === "en"
        ? SEO_TITLE_EN
        : requirePick(rizzPage.seo.title, "rizzPage.seo.title");
    const description = requirePick(
      rizzPage.seo.description,
      "rizzPage.seo.description",
    );

    document.title = title;

    const ensureMeta = (name: string) => {
      let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      return meta;
    };

    ensureMeta("description").setAttribute("content", description);
  }, [rizzPage, requirePick, urlLocale]);

  return null;
};

