import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  pickLocale,
  requireLocale,
  type LocaleString,
  type LocaleText,
} from "@/lib/sanity/locale";
import {
  fetchSiteContent,
  type SiteContent,
} from "@/lib/sanitySite";
import { ScrollRestoration } from "@/components/ScrollRestoration";

const emptyContent: SiteContent = {
  homePage: null,
  siteSettings: null,
  rizzPage: null,
  trustedClients: [],
  highlightVideos: [],
  proofCards: [],
  reviews: [],
};

type SiteContentContextValue = SiteContent & {
  isLoading: boolean;
  pick: (field?: LocaleString | LocaleText) => string;
  requirePick: (field: LocaleString | LocaleText | undefined, debugPath: string) => string;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export const SiteContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { language } = useLanguage();
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSiteContent();
        if (!cancelled) setContent({ ...emptyContent, ...data });
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

  const requirePick = useMemo(
    () =>
      (field: LocaleString | LocaleText | undefined, debugPath: string) =>
        requireLocale(field, language, debugPath),
    [language]
  );

  const value = useMemo(
    () => ({
      ...content,
      isLoading,
      pick,
      requirePick,
    }),
    [content, isLoading, pick, requirePick]
  );

  return (
    <SiteContentContext.Provider value={value}>
      <ScrollRestoration ready={!isLoading} />
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
