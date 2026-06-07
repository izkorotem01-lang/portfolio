import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLocale, type LocaleString, type LocaleText } from "@/lib/sanity/locale";
import {
  fetchSiteContent,
  type SiteContent,
} from "@/lib/sanitySite";

type SiteContentContextValue = SiteContent & {
  isLoading: boolean;
  pick: (field?: LocaleString | LocaleText) => string;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export const SiteContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { language } = useLanguage();
  const [content, setContent] = useState<SiteContent>({
    homePage: null,
    siteSettings: null,
    trustedClients: [],
    highlightVideos: [],
    reviews: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSiteContent();
        if (!cancelled) setContent(data);
      } catch (error) {
        console.error("Failed to load site content from Sanity:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pick = useMemo(
    () => (field?: LocaleString | LocaleText) => pickLocale(field, language),
    [language]
  );

  const value = useMemo(
    () => ({
      ...content,
      isLoading,
      pick,
    }),
    [content, isLoading, pick]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
};
