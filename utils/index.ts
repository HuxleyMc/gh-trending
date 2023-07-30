import { SPOKEN_LANG } from "@/constants/filters";

export const getLanguageCode = (language: string) => {
  return SPOKEN_LANG.find((lang) => lang.label === language)?.code;
};
