export type LocaleString = { en?: string; hb?: string };
export type LocaleText = { en?: string; hb?: string };

export const pickLocale = (
  field: LocaleString | LocaleText | undefined,
  language: "en" | "hb"
): string => {
  if (!field) return "";
  const primary = language === "hb" ? field.hb : field.en;
  return (primary || "").trim();
};

export const requireLocale = (
  field: LocaleString | LocaleText | undefined,
  language: "en" | "hb",
  debugPath: string
): string => {
  const value = pickLocale(field, language);
  if (value) return value;
  throw new Error(`Missing required localized content (${language}) at: ${debugPath}`);
};
