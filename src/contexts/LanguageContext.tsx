/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  contentLocaleToUrlLocale,
  DEFAULT_URL_LOCALE,
  isUrlLocale,
  type ContentLocale,
  type UrlLocale,
  urlLocaleToContentLocale,
} from "@/i18n/locale";

const urlLocaleFromPath = (pathname: string): UrlLocale => {
  const segment = pathname.split("/").filter(Boolean)[0];
  return isUrlLocale(segment) ? segment : DEFAULT_URL_LOCALE;
};

interface LanguageContextType {
  language: ContentLocale;
  urlLocale: UrlLocale;
  setLanguage: (lang: ContentLocale) => void;
  switchUrlLocale: (locale: UrlLocale) => void;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const urlLocale = urlLocaleFromPath(location.pathname);
  const language = urlLocaleToContentLocale(urlLocale);
  const dir = language === "hb" ? "rtl" : "ltr";

  const switchUrlLocale = (nextLocale: UrlLocale) => {
    if (nextLocale === urlLocale) return;
    navigate(`/${nextLocale}${location.hash}`, { replace: true });
  };

  const setLanguage = (lang: ContentLocale) => {
    switchUrlLocale(contentLocaleToUrlLocale(lang));
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const value = useMemo(
    () => ({
      language,
      urlLocale,
      setLanguage,
      switchUrlLocale,
      dir,
    }),
    [language, urlLocale, dir],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div
        dir={dir}
        className={
          language === "hb"
            ? "font-assistant min-h-screen"
            : "font-sans min-h-screen"
        }
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export type { ContentLocale, UrlLocale };
