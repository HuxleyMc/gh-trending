import { CACHE_MAX_AGE } from "@/constants";
import { SPOKEN_LANG } from "@/constants/filters";

export const getLanguageCode = (language: string) => {
  return SPOKEN_LANG.find((lang) => lang.label === language)?.code;
};

// Utils for creating cache headers
export const getCacheHeaders = (maxAge: number = CACHE_MAX_AGE) => {
  return {
    "cache-control": `max-age=${maxAge}`,
  };
};
