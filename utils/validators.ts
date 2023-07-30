import { LANGUAGES } from "@/constants/languages";
import { formatLanguageForUrl } from "./format";

const ValidLanguages = new Set(LANGUAGES.map(formatLanguageForUrl));

export const validateLanguage = (language: string) => {
  let formattedLang = formatLanguageForUrl(language);
  if (ValidLanguages.has(formattedLang)) {
    return formattedLang;
  }
  return null;
};
