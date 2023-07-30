export const formatLanguageForUrl = (language: string) => {
  return language.toLowerCase().trim().replace(/\s/g, "-");
};
