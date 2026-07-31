/** URL path segment shown to users */
export type UrlLocale = "en" | "hb";

/** Content locale stored in Sanity and used in the app */
export type ContentLocale = "en" | "hb";

export const URL_LOCALES: UrlLocale[] = ["en", "hb"];
export const DEFAULT_URL_LOCALE: UrlLocale = "en";

export const isUrlLocale = (value: string | undefined): value is UrlLocale =>
  value === "en" || value === "hb";

export const urlLocaleToContentLocale = (urlLocale: UrlLocale): ContentLocale => urlLocale;

export const contentLocaleToUrlLocale = (contentLocale: ContentLocale): UrlLocale => contentLocale;

export const localePath = (urlLocale: UrlLocale, hash = ""): string =>
  `/${urlLocale}${hash ? (hash.startsWith("#") ? hash : `#${hash}`) : ""}`;
