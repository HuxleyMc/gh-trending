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

export const parseNumber = (str = "") => {
  const number = Number.parseInt(str.replaceAll(",", "").trim());
  return isNaN(number) ? 0 : number;
};

export const validateHexColor = (color: string) => {
  const isValid = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  return isValid ? color : undefined;
};
