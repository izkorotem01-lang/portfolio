/** URL path segment shown to users */
export type UrlLocale = "en" | "hb";

/** Internal content locale (Hebrew uses ISO `he`; URL uses `hb`) */
export type ContentLocale = "en" | "he";

export const URL_LOCALES: UrlLocale[] = ["en", "hb"];
export const DEFAULT_URL_LOCALE: UrlLocale = "en";

export const isUrlLocale = (value: string | undefined): value is UrlLocale =>
  value === "en" || value === "hb";

export const urlLocaleToContentLocale = (urlLocale: UrlLocale): ContentLocale =>
  urlLocale === "hb" ? "he" : "en";

export const contentLocaleToUrlLocale = (contentLocale: ContentLocale): UrlLocale =>
  contentLocale === "he" ? "hb" : "en";

export const localePath = (urlLocale: UrlLocale, hash = ""): string =>
  `/${urlLocale}${hash ? (hash.startsWith("#") ? hash : `#${hash}`) : ""}`;
