export type LocaleString = { en?: string; he?: string };
export type LocaleText = { en?: string; he?: string };

export const pickLocale = (
  field: LocaleString | LocaleText | undefined,
  language: "en" | "he"
): string => {
  if (!field) return "";
  const primary = language === "he" ? field.he : field.en;
  const fallback = language === "he" ? field.en : field.he;
  return (primary || fallback || "").trim();
};
