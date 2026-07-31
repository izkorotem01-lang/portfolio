import { useEffect } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";

export const RizzSeo = () => {
  const { rizzPage, requirePick } = useSiteContent();
  useEffect(() => {
    if (!rizzPage?.seo) return;
    const title = requirePick(rizzPage.seo.title, "rizzPage.seo.title");
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
  }, [rizzPage, requirePick]);

  return null;
};

