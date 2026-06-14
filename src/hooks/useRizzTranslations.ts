import { useLanguage } from "@/contexts/LanguageContext";
import { rizzTranslations, type RizzTranslations } from "@/i18n/rizz-translations";

export const useRizzTranslations = (): RizzTranslations => {
  const { language } = useLanguage();
  return rizzTranslations[language];
};
